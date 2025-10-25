import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  List,
  Typography,
  Space,
  Spin,
  Button,
  Tag,
  Empty,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getQuizAttemptsBySet } from "../../../services/api_quiz";

const { Title, Text } = Typography;

const QuizHistoryPage = () => {
  const { id } = useParams(); // quizSetId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchAttempts();
  }, [id]);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await getQuizAttemptsBySet(id);
      setAttempts(res.attempts || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải lịch sử làm bài!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>

        <Title level={3}>Lịch sử làm bài</Title>

        {attempts.length === 0 ? (
          <Card>
            <Empty
              description="Chưa có lần làm nào cho bộ trắc nghiệm này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={attempts}
            renderItem={(attempt) => (
              <List.Item
                onClick={() => navigate(`/quiz-attempts/${attempt.id}`)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Card
                  hoverable
                  style={{ width: "100%", borderRadius: 12 }}
                  bodyStyle={{ padding: "16px 20px" }}
                >
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="small"
                  >
                    <Space
                      align="center"
                      style={{ justifyContent: "space-between", width: "100%" }}
                    >
                      <Text strong>
                        Lần làm lúc{" "}
                        {new Date(attempt.taken_at).toLocaleString("vi-VN")}
                      </Text>
                      <Tag
                        color={
                          attempt.score >= 80
                            ? "green"
                            : attempt.score >= 50
                            ? "gold"
                            : "red"
                        }
                        icon={<TrophyOutlined />}
                      >
                        {attempt.score} điểm
                      </Tag>
                    </Space>

                    <Space wrap>
                      <Tag icon={<CheckCircleOutlined />} color="blue">
                        Đúng: {attempt.correct_count}
                      </Tag>
                      <Tag icon={<CloseCircleOutlined />} color="red">
                        Sai: {attempt.incorrect_count}
                      </Tag>
                      <Tag icon={<ClockCircleOutlined />} color="default">
                        Thời gian: {attempt.duration_sec}s
                      </Tag>
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Space>
    </div>
  );
};

export default QuizHistoryPage;
