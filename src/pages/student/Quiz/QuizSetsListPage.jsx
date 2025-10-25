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
  Row,
  Col,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PlayCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import {
  getQuizSetsByPodcast,
  createQuizFromDocument,
} from "../../../services/api_quiz";
import { getPodcastById } from "../../../services/api_podcast";

const { Title, Text, Paragraph } = Typography;

const QuizSetsListPage = () => {
  const { id } = useParams(); // podcast_id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [quizSets, setQuizSets] = useState([]);
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy thông tin podcast
      const podcastRes = await getPodcastById(id);
      setPodcast(podcastRes.data);

      // Lấy danh sách quiz sets
      const quizData = await getQuizSetsByPodcast(id);
      setQuizSets(quizData.quiz_sets || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách quiz sets!");
    } finally {
      setLoading(false);
    }
  };

  // === Tạo quiz set mới bằng AI ===
  const handleGenerateQuiz = () => {
    Modal.confirm({
      title: "Tạo bộ trắc nghiệm bằng AI?",
      content:
        "Hệ thống sẽ sử dụng nội dung tài liệu của podcast này để sinh câu hỏi tự động.",
      okText: "Tạo",
      cancelText: "Hủy",
      async onOk() {
        setGenerating(true);
        try {
          // Lấy document_id từ podcast
          const podcastRes = await getPodcastById(id);
          const documentId = podcastRes.data?.document_id;

          if (!documentId) {
            message.error("Không tìm thấy tài liệu liên kết với podcast này!");
            return;
          }

          // Gọi API sinh quiz bằng AI
          const res = await createQuizFromDocument(documentId);
          console.log("Quiz AI generated:", res);

          message.success("Tạo bộ trắc nghiệm thành công!");
          fetchData(); // Reload lại danh sách quiz sets
        } catch (err) {
          console.error(err);
          message.error("Lỗi khi tạo bộ trắc nghiệm!");
        } finally {
          setGenerating(false);
        }
      },
    });
  };

  const handleStartQuiz = (quizSetId) => {
    navigate(`/quiz-sets/${quizSetId}/take`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/podcast/${id}`)}
        >
          Quay lại Podcast
        </Button>

        {podcast && (
          <Card bordered={false}>
            <Row gutter={16} align="middle">
              <Col>
                <img
                  src={podcast.cover_image}
                  alt={podcast.title}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col flex={1}>
                <Title level={3} style={{ margin: 0 }}>
                  Bộ trắc nghiệm
                </Title>
                <Text type="secondary">{podcast.title}</Text>
              </Col>
              <Col>
                <Button
                  icon={<BulbOutlined />}
                  type="primary"
                  loading={generating}
                  onClick={handleGenerateQuiz}
                >
                  Tạo bộ trắc nghiệm bằng AI
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        {/* Quiz Sets List */}
        {quizSets.length === 0 ? (
          <Card>
            <Empty
              description="Chưa có bộ trắc nghiệm nào cho podcast này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            ></Empty>
          </Card>
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={quizSets}
            renderItem={(quizSet) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ borderRadius: 12, height: "100%" }}
                  actions={[
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleStartQuiz(quizSet.id)}
                      block
                    >
                      Bắt đầu làm bài
                    </Button>,
                    <Button
                      icon={<ClockCircleOutlined />}
                      onClick={() =>
                        navigate(`/quiz-sets/${quizSet.id}/history`)
                      }
                      block
                    >
                      Xem lịch sử làm bài
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <FileTextOutlined
                        style={{ fontSize: 32, color: "#1890ff" }}
                      />
                    }
                    title={
                      <Text strong ellipsis>
                        {quizSet.title}
                      </Text>
                    }
                    description={
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ margin: 0, color: "#666" }}
                        >
                          {quizSet.description}
                        </Paragraph>

                        <Space wrap>
                          <Tag icon={<FileTextOutlined />} color="blue">
                            {quizSet.questions?.length || 0} câu hỏi
                          </Tag>
                          <Tag icon={<ClockCircleOutlined />} color="green">
                            {new Date(quizSet.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </Tag>
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Space>
    </div>
  );
};

export default QuizSetsListPage;
