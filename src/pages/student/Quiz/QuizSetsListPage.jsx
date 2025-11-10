import React, { useEffect, useState, useContext } from "react";
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
  Avatar,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  RocketOutlined,
  CrownOutlined,
  BookOutlined,
  UserOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  getQuizSetsByPodcast,
  createQuizFromDocument,
  deleteQuizSetByCurrentUser,
  deleteAllQuizSetsByCurrentUser,
} from "../../../services/api_quiz";
import { getPodcastById } from "../../../services/api_podcast";
import { ThemeContext } from "../../../context/useTheme";

const { Title, Text, Paragraph } = Typography;

const QuizSetsListPage = () => {
  const { id } = useParams(); // podcast_id
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [quizSets, setQuizSets] = useState([]);
  const [podcast, setPodcast] = useState(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const podcastRes = await getPodcastById(id);
      setPodcast(podcastRes.data);

      const quizData = await getQuizSetsByPodcast(id);
      setQuizSets(quizData.quiz_sets || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách quiz sets!");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateQuiz = () => {
    Modal.confirm({
      title: "Tạo bộ trắc nghiệm",
      content: (
        <div style={{ padding: "8px 0" }}>
          <p>Hệ thống sử dụng AI để tạo bộ câu hỏi trắc nghiệm.</p>
        </div>
      ),
      okText: "Bắt đầu tạo",
      cancelText: "Hủy bỏ",
      icon: <RocketOutlined style={{ color: "#1890ff" }} />,
      okButtonProps: {
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: 8,
        },
      },
      async onOk() {
        setGenerating(true);
        try {
          const podcastRes = await getPodcastById(id);
          const documentId = podcastRes.data?.document_id;

          if (!documentId) {
            message.error("Không tìm thấy tài liệu liên kết với podcast này!");
            return;
          }

          await createQuizFromDocument(documentId);
          message.success("Tạo bộ trắc nghiệm thành công!");
          fetchData();
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

  const calculateStats = () => {
    if (quizSets.length === 0) return null;

    const totalQuestions = quizSets.reduce(
      (total, set) => total + (set.questions?.length || 0),
      0
    );
    const latestQuiz = quizSets.reduce(
      (latest, set) =>
        new Date(set.created_at) > new Date(latest.created_at) ? set : latest,
      quizSets[0]
    );

    return {
      totalQuizSets: quizSets.length,
      totalQuestions,
      latestDate: latestQuiz.created_at,
    };
  };
  // Xóa 1 quiz set
  const handleDeleteQuizSet = (quizSetId) => {
    Modal.confirm({
      title: "Xác nhận xóa bộ câu hỏi",
      icon: <DeleteOutlined />,
      content:
        "Bạn có chắc chắn muốn xóa bộ câu hỏi này không? Hành động không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteQuizSetByCurrentUser(quizSetId);
          message.success("Đã xóa bộ quiz thành công!");
          fetchData(); // reload danh sách
        } catch (err) {
          console.error(err);
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  // Xóa tất cả quiz set
  const handleDeleteAllQuizSets = () => {
    Modal.confirm({
      title: "Xác nhận xóa tất cả bộ quiz",
      icon: <DeleteOutlined />,
      content:
        "Bạn có chắc chắn muốn xóa tất cả bộ quiz? Hành động này không thể hoàn tác.",
      okText: "Xóa tất cả",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteAllQuizSetsByCurrentUser();
          message.success("Đã xóa tất cả bộ quiz!");
          fetchData(); // reload danh sách
        } catch (err) {
          console.error(err);
          message.error("Xóa tất cả thất bại!");
        }
      },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Đang tải bộ trắc nghiệm..." />
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#e5e7eb" : "#000",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER */}
        <Card
          style={{
            marginBottom: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 16,
            color: "white",
          }}
        >
          <div style={{ padding: 24 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                marginBottom: 16,
              }}
            >
              Quay lại
            </Button>

            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={16}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  <Avatar
                    size={64}
                    src={podcast?.cover_image}
                    icon={<UserOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "2px solid rgba(255,255,255,0.4)",
                    }}
                  />
                  <div>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {podcast?.title || "Podcast"}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                      Danh sách bộ trắc nghiệm
                    </Text>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <Button
                  icon={<RocketOutlined />}
                  type="primary"
                  size="large"
                  loading={generating}
                  onClick={handleGenerateQuiz}
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    height: 48,
                    width: "100%",
                  }}
                >
                  Tạo Quiz bằng AI
                </Button>
              </Col>
            </Row>
          </div>
        </Card>

        {/* STATISTICS */}
        {stats && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="center">
            <Col xs={24} md={8}>
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  background: isDarkMode
                    ? "#312e81"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                }}
              >
                <Statistic
                  value={stats.totalQuizSets}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: "white" }}
                />
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng số bộ quiz
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  background: isDarkMode
                    ? "#7f1d1d"
                    : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  border: "none",
                  color: "white",
                }}
              >
                <Statistic
                  value={stats.totalQuestions}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "white" }}
                />
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng câu hỏi
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  background: isDarkMode ? "#78350f" : "#fffbe6",
                  border: "none",
                }}
              >
                <Statistic
                  value={
                    stats.latestDate
                      ? new Date(stats.latestDate).toLocaleDateString("vi-VN")
                      : "--"
                  }
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{
                    color: isDarkMode ? "#facc15" : "#faad14",
                  }}
                />
                <Text
                  type="secondary"
                  style={{
                    color: isDarkMode ? "#fef9c3" : undefined,
                  }}
                >
                  Cập nhật gần nhất
                </Text>
              </Card>
            </Col>
          </Row>
        )}
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteAllQuizSets}
          style={{
            marginTop: 16,
            borderRadius: 8,
            width: 180,
            margin: "15px 0",
          }}
        >
          Xóa tất cả bộ quiz
        </Button>
        {/* QUIZ LIST */}
        {quizSets.length === 0 ? (
          <Card
            style={{
              borderRadius: 16,
              border: "none",
              background: isDarkMode ? "#1f2937" : "white",
            }}
          >
            <Empty
              description="Chưa có bộ trắc nghiệm nào cho podcast này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ color: isDarkMode ? "#e5e7eb" : undefined }}
            >
              <Button
                type="primary"
                icon={<RocketOutlined />}
                size="large"
                onClick={handleGenerateQuiz}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: 8,
                }}
              >
                Tạo Quiz đầu tiên
              </Button>
            </Empty>
          </Card>
        ) : (
          <div
            style={{
              background: isDarkMode ? "#1f2937" : "white",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={quizSets}
              renderItem={(quizSet, index) => {
                const questionCount = quizSet.questions?.length || 0;
                return (
                  <List.Item
                    className="quiz-set-item"
                    style={{
                      padding: "16px 24px",
                      borderBottom: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <Row
                      gutter={[16, 16]}
                      align="middle"
                      style={{ width: "100%" }}
                    >
                      <Col xs={2} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: isDarkMode
                              ? "rgba(129, 140, 248, 0.2)"
                              : "rgba(102, 126, 234, 0.2)",
                            color: isDarkMode ? "#c7d2fe" : "#667eea",
                            border: `2px solid ${
                              isDarkMode ? "#818cf8" : "#667eea"
                            }`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          {index + 1}
                        </div>
                      </Col>

                      <Col xs={14} md={12}>
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <FileTextOutlined
                              style={{
                                color: isDarkMode ? "#60a5fa" : "#1890ff",
                              }}
                            />
                            <Text
                              strong
                              style={{
                                fontSize: 16,
                                color: isDarkMode ? "#f3f4f6" : undefined,
                              }}
                            >
                              {quizSet.title}
                            </Text>
                            {index === 0 && (
                              <CrownOutlined style={{ color: "#faad14" }} />
                            )}
                          </div>

                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{
                              margin: 0,
                              color: isDarkMode ? "#9ca3af" : "#666",
                              fontSize: 14,
                            }}
                          >
                            {quizSet.description ||
                              "Bộ câu hỏi được tạo tự động từ nội dung podcast"}
                          </Paragraph>

                          <Space wrap>
                            <Tag
                              icon={<FileTextOutlined />}
                              color={isDarkMode ? "blue" : "blue"}
                            >
                              {questionCount} câu hỏi
                            </Tag>
                            <Tag
                              icon={<ClockCircleOutlined />}
                              style={{
                                background: isDarkMode ? "#374151" : "#f0f0f0",
                                color: isDarkMode ? "#e5e7eb" : "#000",
                              }}
                            >
                              {new Date(quizSet.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Tag>
                          </Space>
                        </Space>
                      </Col>

                      <Col xs={8} md={10} style={{ textAlign: "right" }}>
                        <Space.Compact block>
                          <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleStartQuiz(quizSet.id)}
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                              margin: 5,
                            }}
                          >
                            Làm bài
                          </Button>
                          <Button
                            icon={<HistoryOutlined />}
                            onClick={() =>
                              navigate(`/quiz-sets/${quizSet.id}/history`)
                            }
                            style={{
                              margin: 5,
                            }}
                          >
                            Lịch sử
                          </Button>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteQuizSet(quizSet.id)}
                            style={{ margin: 5 }}
                          >
                            Xóa
                          </Button>
                        </Space.Compact>
                      </Col>
                    </Row>
                  </List.Item>
                );
              }}
            />
          </div>
        )}

        <style jsx>{`
          .quiz-set-item:hover {
            background: ${isDarkMode
              ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
              : "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)"};
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default QuizSetsListPage;
