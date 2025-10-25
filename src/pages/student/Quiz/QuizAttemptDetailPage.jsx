import React, { useEffect, useState, useCallback } from "react";
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
  Progress,
  Row,
  Col,
  Avatar,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { getQuizAttemptDetail } from "../../../services/api_quiz";

const { Title, Text } = Typography;

const QuizAttemptDetailPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [playingQuestion, setPlayingQuestion] = useState(null);

  const fetchDetail = useCallback(async () => {
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
  }, [attemptId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleAudioPlay = (questionId) => {
    if (playingQuestion === questionId) {
      // Pause logic would go here
      setPlayingQuestion(null);
    } else {
      setPlayingQuestion(questionId);
      // Audio play logic would go here
    }
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
        <Spin size="large" tip="Đang tải kết quả..." />
      </div>
    );
  }

  if (!attempt) return null;

  const histories = attempt.histories || attempt.Histories || [];
  if (histories.length === 0)
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <Empty description="Chưa có dữ liệu câu hỏi nào" />
      </div>
    );

  const correctCount = attempt.correct_count || 0;
  const totalQuestions = histories.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

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
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  {attempt.quiz_set?.title || "Bài trắc nghiệm"}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                  Chi tiết kết quả làm bài
                </Text>

                <div style={{ marginTop: 16 }}>
                  <Space wrap>
                    <Tag
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "none",
                        borderRadius: 20,
                        padding: "4px 12px",
                      }}
                    >
                      <TrophyOutlined /> Điểm: {attempt.score}
                    </Tag>
                    <Tag
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "none",
                        borderRadius: 20,
                        padding: "4px 12px",
                      }}
                    >
                      <ClockCircleOutlined /> Thời gian: {attempt.duration_sec}s
                    </Tag>
                  </Space>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div style={{ textAlign: "center" }}>
                  <Progress
                    type="circle"
                    percent={accuracy}
                    format={(percent) => (
                      <div style={{ color: "white" }}>
                        <div style={{ fontSize: 24, fontWeight: "bold" }}>
                          {percent}%
                        </div>
                        <div style={{ fontSize: 12 }}>Độ chính xác</div>
                      </div>
                    )}
                    strokeColor="white"
                    trailColor="rgba(255,255,255,0.3)"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Stats Overview */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={6} md={4}></Col>
          <Col xs={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: 12,
                background: "#f0f9ff",
                border: "none",
              }}
            >
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#52c41a" }}
              >
                {correctCount}
              </div>
              <Text type="secondary">Câu đúng</Text>
            </Card>
          </Col>
          <Col xs={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: 12,
                background: "#fff2f0",
                border: "none",
              }}
            >
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#ff4d4f" }}
              >
                {attempt.incorrect_count}
              </div>
              <Text type="secondary">Câu sai</Text>
            </Card>
          </Col>
        </Row>

        {/* Questions List */}
        <div
          style={{ background: "white", borderRadius: 16, overflow: "hidden" }}
        >
          {histories.map((history, index) => {
            const question = history.question || history.Question;
            const selectedId = history.selected_id || history.SelectedID;
            const options = question?.options || question?.Options || [];
            const correctOption = options.find((o) => o.is_correct);
            const isBlank = !selectedId;
            const isCorrect = history.is_correct;

            return (
              <div
                key={index}
                style={{
                  padding: 24,
                  borderBottom: "1px solid #f0f0f0",
                  background: isCorrect
                    ? "#f6ffed"
                    : isBlank
                    ? "#fffbe6"
                    : "#fff2f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  {/* Question Number with Status */}
                  <Badge
                    count={isCorrect ? "✓" : isBlank ? "−" : "✗"}
                    style={{
                      backgroundColor: isCorrect
                        ? "#52c41a"
                        : isBlank
                        ? "#faad14"
                        : "#ff4d4f",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        border: `2px solid ${
                          isCorrect
                            ? "#52c41a"
                            : isBlank
                            ? "#faad14"
                            : "#ff4d4f"
                        }`,
                      }}
                    >
                      {index + 1}
                    </div>
                  </Badge>

                  {/* Question Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <Typography.Paragraph
                        style={{
                          whiteSpace: "pre-wrap",
                          fontSize: 16,
                          fontWeight: 500,
                          margin: 0,
                          flex: 1,
                        }}
                      >
                        {question?.question}
                      </Typography.Paragraph>

                      {/* Audio Play Button (Podcast-style) */}
                      {question?.audio_url && (
                        <Button
                          type="text"
                          icon={
                            playingQuestion === question.id ? (
                              <PauseCircleOutlined />
                            ) : (
                              <PlayCircleOutlined />
                            )
                          }
                          onClick={() => handleAudioPlay(question.id)}
                          style={{
                            fontSize: 24,
                            color: "#1890ff",
                          }}
                        />
                      )}
                    </div>

                    {/* Difficulty Tag */}
                    <Tag
                      color={
                        question?.difficulty === "hard"
                          ? "red"
                          : question?.difficulty === "medium"
                          ? "orange"
                          : "blue"
                      }
                      style={{ marginBottom: 16, borderRadius: 12 }}
                    >
                      {question?.difficulty}
                    </Tag>

                    {/* Options */}
                    <Space
                      direction="vertical"
                      style={{ width: "100%", marginBottom: 16 }}
                    >
                      {options.map((opt) => {
                        const isSelected = selectedId === opt.id;
                        const isCorrectOption = opt.is_correct;

                        let optionStyle = {
                          padding: "12px 16px",
                          borderRadius: 8,
                          backgroundColor: "#fafafa",
                          border: "1px solid #d9d9d9",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.3s ease",
                        };

                        if (isCorrectOption) {
                          optionStyle.backgroundColor = "#f6ffed";
                          optionStyle.borderColor = "#b7eb8f";
                        } else if (isSelected && !isCorrectOption) {
                          optionStyle.backgroundColor = "#fff2f0";
                          optionStyle.borderColor = "#ffccc7";
                        }

                        return (
                          <div key={opt.id} style={optionStyle}>
                            <Text>{opt.option_text}</Text>
                            {isCorrectOption ? (
                              <CheckCircleOutlined
                                style={{ color: "#52c41a" }}
                              />
                            ) : isSelected ? (
                              <CloseCircleOutlined
                                style={{ color: "#ff4d4f" }}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </Space>

                    {/* Result Status */}
                    <div style={{ marginBottom: 8 }}>
                      {isBlank ? (
                        <Text type="warning" style={{ fontWeight: 500 }}>
                          <MinusCircleOutlined /> Bạn chưa chọn đáp án
                        </Text>
                      ) : (
                        <Text
                          type={isCorrect ? "success" : "danger"}
                          style={{ fontWeight: 500 }}
                        >
                          {isCorrect ? "✓ Trả lời đúng" : "✗ Trả lời sai"}
                        </Text>
                      )}
                    </div>

                    {/* Correct Answer */}
                    {correctOption && (
                      <Text
                        style={{
                          display: "block",
                          marginBottom: 8,
                          fontStyle: "italic",
                          color: "#52c41a",
                        }}
                      >
                        Đáp án đúng: <b>{correctOption.option_text}</b>
                      </Text>
                    )}

                    {question?.source_text && (
                      <Text
                        type="secondary"
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontSize: 12,
                        }}
                      >
                        Nguồn: {question.source_text}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptDetailPage;
