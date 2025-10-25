import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Button,
  Space,
  Tag,
  Divider,
  message,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { getQuizAttemptDetail } from "../../../services/api_quiz";

const { Title, Text } = Typography;

const QuizAttemptDetailPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [attemptId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getQuizAttemptDetail(attemptId);
      console.log("Detail API response:", res);
      setAttempt(res.attempt);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải chi tiết lần làm bài!");
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

  if (!attempt) return null;

  const histories = attempt.histories || attempt.Histories || [];
  if (histories.length === 0)
    return <Empty description="Chưa có dữ liệu câu hỏi nào" />;

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>

        <Title level={3}>
          {attempt.quiz_set?.title || "Bài trắc nghiệm"} - Chi tiết lần làm
        </Title>

        <Card>
          <Space wrap>
            <Tag color="blue">Điểm: {attempt.score}</Tag>
            <Tag color="green">Đúng: {attempt.correct_count}</Tag>
            <Tag color="red">Sai: {attempt.incorrect_count}</Tag>
            <Tag>Thời gian: {attempt.duration_sec}s</Tag>
          </Space>
        </Card>

        <Divider />

        {histories.map((history, index) => {
          const question = history.question || history.Question;
          const selectedId = history.selected_id || history.SelectedID;
          const options = question?.options || question?.Options || [];
          const correctOption = options.find((o) => o.is_correct);

          const isBlank = !selectedId; // <-- câu bỏ trống

          return (
            <Card
              key={index}
              title={`Câu ${index + 1}: ${question?.question}`}
              style={{ marginBottom: 16, borderRadius: 12 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {options.map((opt) => {
                  const isSelected = selectedId === opt.id;
                  const isCorrect = opt.is_correct;
                  let bgColor = "#fafafa";

                  if (isCorrect) bgColor = "#f6ffed";
                  else if (isSelected && !isCorrect) bgColor = "#fff1f0";

                  return (
                    <div
                      key={opt.id}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        backgroundColor: bgColor,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text>{opt.option_text}</Text>
                      {isCorrect ? (
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      ) : isSelected ? (
                        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                      ) : null}
                    </div>
                  );
                })}

                <Divider style={{ margin: "12px 0" }} />

                {isBlank ? (
                  <Text type="warning" style={{ fontWeight: 500 }}>
                    <MinusCircleOutlined /> Bạn chưa chọn đáp án
                  </Text>
                ) : (
                  <Text
                    type={history.is_correct ? "success" : "danger"}
                    style={{ fontWeight: 500 }}
                  >
                    {history.is_correct ? "✓ Trả lời đúng" : "✗ Trả lời sai"}
                  </Text>
                )}

                {correctOption && (
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginTop: 8,
                      fontStyle: "italic",
                    }}
                  >
                    Đáp án đúng: <b>{correctOption.option_text}</b>
                  </Text>
                )}

                {question?.hint && (
                  <Text
                    type="secondary"
                    italic
                    style={{ display: "block", marginTop: 8 }}
                  >
                    Gợi ý: {question.hint}
                  </Text>
                )}
              </Space>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default QuizAttemptDetailPage;
