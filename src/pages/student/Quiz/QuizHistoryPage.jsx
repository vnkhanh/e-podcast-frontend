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
  Statistic,
  Progress,
  Avatar,
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getQuizAttemptsBySet } from "../../../services/api_quiz";
import { ThemeContext } from "../../../context/useTheme";

const { Title, Text } = Typography;

const QuizHistoryPage = () => {
  const { id } = useParams(); // quizSetId
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [quizSetInfo, setQuizSetInfo] = useState(null);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await getQuizAttemptsBySet(id);
      setAttempts(res.attempts || []);
      setQuizSetInfo(res.quiz_set || {});
    } catch (err) {
      console.error(err);
      message.error("Không thể tải lịch sử làm bài!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 8) return "#52c41a";
    if (score >= 5) return "#faad14";
    return "#ff4d4f";
  };

  const getPerformanceLevel = (score) => {
    if (score >= 9) return { text: "Xuất sắc", color: "#722ed1" };
    if (score >= 8) return { text: "Tốt", color: "#52c41a" };
    if (score >= 6) return { text: "Khá", color: "#1890ff" };
    if (score >= 5) return { text: "Trung bình", color: "#faad14" };
    return { text: "Cần cố gắng", color: "#ff4d4f" };
  };

  const calculateStats = () => {
    if (attempts.length === 0) return null;

    const totalAttempts = attempts.length;
    const bestScore = Math.max(...attempts.map((a) => a.score));
    const averageScore =
      attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts;
    const totalTime = attempts.reduce((sum, a) => sum + a.duration_sec, 0);

    return {
      totalAttempts,
      bestScore: Math.round(bestScore),
      averageScore: Math.round(averageScore),
      totalTime: Math.round(totalTime / 60),
    };
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
        <Spin size="large" tip="Đang tải lịch sử..." />
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        color: isDarkMode ? "#e5e7eb" : "#000",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
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
                    icon={<UserOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <div>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {quizSetInfo?.title || "Bộ câu hỏi"}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                      Lịch sử làm bài chi tiết
                    </Text>
                  </div>
                </div>
              </Col>

              {stats && (
                <Col xs={24} md={8}>
                  <div style={{ textAlign: "center" }}>
                    <Progress
                      type="circle"
                      percent={stats.averageScore * 10}
                      format={() => (
                        <div style={{ color: "white" }}>
                          <div style={{ fontSize: 20, fontWeight: "bold" }}>
                            TB: {parseFloat(stats.averageScore.toFixed(2))}/10
                          </div>
                        </div>
                      )}
                      strokeColor="white"
                      trailColor="rgba(255,255,255,0.3)"
                    />
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Card>

        {/* Stats */}
        {stats && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="center">
            <Col xs={12} md={6}>
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
                  value={stats.totalAttempts}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: "white" }}
                />
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng số lần làm
                </Text>
              </Card>
            </Col>

            <Col xs={12} md={6}>
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
                  value={stats.bestScore}
                  prefix={<TrophyOutlined />}
                  suffix="/10"
                  valueStyle={{ color: "white" }}
                />
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Điểm cao nhất
                </Text>
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  background: isDarkMode ? "#78350f" : "#fffbe6",
                  border: "none",
                }}
              >
                <Statistic
                  value={stats.totalTime}
                  suffix="phút"
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
                  Tổng thời gian
                </Text>
              </Card>
            </Col>
          </Row>
        )}

        {/* Attempts list */}
        {attempts.length === 0 ? (
          <Card
            style={{
              borderRadius: 16,
              border: "none",
              background: isDarkMode ? "#1f2937" : "white",
            }}
          >
            <Empty
              description="Chưa có lần làm nào cho bộ trắc nghiệm này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ color: isDarkMode ? "#e5e7eb" : undefined }}
            />
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
              dataSource={attempts}
              renderItem={(attempt, index) => {
                const performance = getPerformanceLevel(attempt.score);
                return (
                  <List.Item
                    onClick={() => navigate(`/quiz-attempts/${attempt.id}`)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: "16px 24px",
                      borderBottom: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #f0f0f0",
                    }}
                    className="quiz-history-item"
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
                            border: `2px solid ${
                              isDarkMode ? "#818cf8" : "#667eea"
                            }`,
                            color: isDarkMode ? "#c7d2fe" : "#667eea",
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

                      <Col xs={16} md={14}>
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
                            <CalendarOutlined
                              style={{
                                color: isDarkMode ? "#93c5fd" : "#1890ff",
                              }}
                            />
                            <Text
                              strong
                              style={{ color: isDarkMode ? "#f3f4f6" : "#000" }}
                            >
                              Ngày làm:{" "}
                              {new Date(attempt.taken_at).toLocaleString(
                                "vi-VN"
                              )}
                            </Text>
                          </div>

                          <Space wrap>
                            <Tag
                              icon={<CheckCircleOutlined />}
                              color="green"
                              style={{ borderRadius: 12, margin: 0 }}
                            >
                              Đúng: {attempt.correct_count}
                            </Tag>
                            <Tag
                              icon={<CloseCircleOutlined />}
                              color="red"
                              style={{ borderRadius: 12, margin: 0 }}
                            >
                              Sai: {attempt.incorrect_count}
                            </Tag>
                            <Tag
                              icon={<ClockCircleOutlined />}
                              style={{
                                borderRadius: 12,
                                margin: 0,
                                background: isDarkMode ? "#374151" : "#f0f0f0",
                                color: isDarkMode ? "#e5e7eb" : "#000",
                              }}
                            >
                              Thời gian: {attempt.duration_sec}s
                            </Tag>
                          </Space>
                        </Space>
                      </Col>

                      <Col xs={6} md={8} style={{ textAlign: "right" }}>
                        <Space direction="vertical" size="small">
                          <Progress
                            type="circle"
                            percent={attempt.score * 10}
                            width={60}
                            strokeColor={getScoreColor(attempt.score)}
                            trailColor={isDarkMode ? "#374151" : undefined}
                            format={() => (
                              <Text
                                strong
                                style={{
                                  color: getScoreColor(attempt.score),
                                  fontSize: 12,
                                }}
                              >
                                {parseFloat(attempt.score.toFixed(2))}
                              </Text>
                            )}
                          />
                          <Tag
                            color={performance.color}
                            style={{
                              borderRadius: 12,
                              border: "none",
                              margin: 0,
                            }}
                          >
                            {performance.text}
                          </Tag>
                        </Space>
                      </Col>
                    </Row>
                  </List.Item>
                );
              }}
            />
          </div>
        )}

        <style jsx>{`
          .quiz-history-item:hover {
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

export default QuizHistoryPage;
