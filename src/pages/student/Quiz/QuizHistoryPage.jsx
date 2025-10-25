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
  Statistic,
  Progress,
  Avatar,
  Badge,
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
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { getQuizAttemptsBySet } from "../../../services/api_quiz";

const { Title, Text } = Typography;

const QuizHistoryPage = () => {
  const { id } = useParams(); // quizSetId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [quizSetInfo, setQuizSetInfo] = useState(null);

  useEffect(() => {
    fetchAttempts();
  }, [id]);

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
      totalTime: Math.round(totalTime / 60), // in minutes
    };
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header Section */}
        <Card
          style={{
            marginBottom: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 16,
            color: "white",
            overflow: "hidden",
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
                      percent={stats.averageScore * 10} // vòng hiển thị tỉ lệ (0–100)
                      format={() => (
                        <div style={{ color: "white" }}>
                          <div style={{ fontSize: 20, fontWeight: "bold" }}>
                            Điểm TB: {parseFloat(stats.averageScore.toFixed(2))}
                            /10
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

        {/* Statistics Overview */}
        {stats && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="center">
            <Col xs={12} md={6}>
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  border: "none",
                  color: "white",
                }}
              >
                <Statistic
                  value={parseFloat(stats.bestScore.toFixed(2))}
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
                  background:
                    "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
                  border: "none",
                }}
              >
                <Statistic
                  value={stats.totalTime}
                  suffix="phút"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
                <Text type="secondary">Tổng thời gian</Text>
              </Card>
            </Col>
          </Row>
        )}

        {/* Attempts List */}
        {attempts.length === 0 ? (
          <Card style={{ borderRadius: 16, border: "none" }}>
            <Empty
              description="Chưa có lần làm nào cho bộ trắc nghiệm này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <div
            style={{
              background: "white",
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
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    className="quiz-history-item"
                  >
                    <div style={{ width: "100%" }}>
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={2} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "rgba(102, 126, 234, 0.2)",
                              color: "#667eea",
                              border: "2px solid #667eea",
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
                              <CalendarOutlined style={{ color: "#1890ff" }} />
                              <Text strong>
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
                                  background: "#f0f0f0",
                                }}
                              >
                                Thời gian làm: {attempt.duration_sec}s
                              </Tag>
                            </Space>
                          </Space>
                        </Col>

                        <Col xs={6} md={8} style={{ textAlign: "right" }}>
                          <Space direction="vertical" size="small">
                            <div>
                              <Progress
                                type="circle"
                                percent={attempt.score * 10} // 0–10 → 0–100 cho vòng tròn
                                width={60}
                                strokeColor={getScoreColor(attempt.score)}
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
                            </div>
                            <Tag
                              color={performance.color}
                              style={{
                                margin: 0,
                                borderRadius: 12,
                                border: "none",
                              }}
                            >
                              {performance.text}
                            </Tag>
                          </Space>
                        </Col>
                      </Row>
                    </div>
                  </List.Item>
                );
              }}
            />
          </div>
        )}

        {/* CSS for hover effects */}
        <style jsx>{`
          .quiz-history-item:hover {
            background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default QuizHistoryPage;
