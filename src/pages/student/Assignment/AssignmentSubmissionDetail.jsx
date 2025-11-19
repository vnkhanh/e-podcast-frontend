import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Radio,
  Divider,
  Alert,
  Button,
  Space,
  Tag,
  Progress,
  Row,
  Col,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getSubmissionDetail } from "../../../services/api_assignment";
import { ThemeContext } from "../../../context/useTheme";

const { Title, Text, Paragraph } = Typography;

const AssignmentSubmissionDetail = ({ token }) => {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmission() {
      setLoading(true);
      try {
        const res = await getSubmissionDetail(id, submissionId);
        setSubmission(res.submission);
      } catch (err) {
        console.error(err);
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    }
    loadSubmission();
  }, [id, submissionId, token]);

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
        <Spin size="large" tip="Đang tải kết quả..." />
      </div>
    );
  }

  if (!submission)
    return (
      <div
        style={{
          padding: 24,

          minHeight: "100vh",
        }}
      >
        <Card
          style={{
            maxWidth: 600,
            margin: "0 auto",
            borderRadius: 16,
          }}
        >
          <Alert
            message="Không tìm thấy bài làm"
            type="error"
            style={{ marginBottom: 16 }}
          />
          <Button
            onClick={() => navigate(-1)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              color: "white",
            }}
          >
            Quay lại
          </Button>
        </Card>
      </div>
    );

  const { assignment, attempt_num, score, max_score, time_spent, answers } =
    submission;

  const correctCount = answers.filter((ans) => ans.points_earned > 0).length;
  const totalQuestions = assignment.questions.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,

        color: isDarkMode ? "#e5e7eb" : "#000",
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
                  {assignment.title}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                  Lần làm bài #{attempt_num} - Chi tiết kết quả
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
                      <TrophyOutlined /> Điểm: {score} / {max_score}
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
                      <ClockCircleOutlined /> Thời gian: {time_spent}s
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
                      <FileTextOutlined /> Số câu: {totalQuestions}
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
          <Col xs={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: 12,
                background: isDarkMode ? "#052e16" : "#f0f9ff",
                border: "none",
                color: isDarkMode ? "#bbf7d0" : undefined,
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
                background: isDarkMode ? "#450a0a" : "#fff2f0",
                border: "none",
                color: isDarkMode ? "#fecaca" : undefined,
              }}
            >
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#ff4d4f" }}
              >
                {totalQuestions - correctCount}
              </div>
              <Text type="secondary">Câu sai</Text>
            </Card>
          </Col>
          <Col xs={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: 12,
                background: isDarkMode ? "#78350f" : "#fffbe6",
                border: "none",
                color: isDarkMode ? "#fde68a" : undefined,
              }}
            >
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#faad14" }}
              >
                {answers.filter((ans) => !ans.selected_id).length}
              </div>
              <Text type="secondary">Chưa trả lời</Text>
            </Card>
          </Col>
        </Row>

        {/* Questions List */}
        <div
          style={{
            background: isDarkMode ? "#1f2937" : "white",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: isDarkMode
              ? "0 4px 12px rgba(0,0,0,0.3)"
              : "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {assignment.questions.map((question, index) => {
            const answer = answers.find((a) => a.question.id === question.id);
            const selectedId = answer?.selected_id;
            const isAnswered = !!selectedId;
            const isCorrect = answer?.points_earned > 0;
            const correctOption = question.options.find((o) => o.is_correct);

            return (
              <div
                key={question.id}
                style={{
                  padding: 24,
                  borderBottom: isDarkMode
                    ? "1px solid #374151"
                    : "1px solid #f0f0f0",
                  background: isCorrect
                    ? isDarkMode
                      ? "#064e3b"
                      : "#f6ffed"
                    : !isAnswered
                    ? isDarkMode
                      ? "#78350f"
                      : "#fffbe6"
                    : isDarkMode
                    ? "#7f1d1d"
                    : "#fff2f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  <Badge
                    count={isCorrect ? "✓" : !isAnswered ? "−" : "✗"}
                    style={{
                      backgroundColor: isCorrect
                        ? "#52c41a"
                        : !isAnswered
                        ? "#faad14"
                        : "#ff4d4f",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        border: `2px solid ${
                          isCorrect
                            ? "#52c41a"
                            : !isAnswered
                            ? "#faad14"
                            : "#ff4d4f"
                        }`,
                        background: isDarkMode ? "#1f2937" : "white",
                        color: isDarkMode ? "#e5e7eb" : "#000",
                      }}
                    >
                      {index + 1}
                    </div>
                  </Badge>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <Paragraph
                        style={{
                          whiteSpace: "pre-wrap",
                          fontSize: 16,
                          fontWeight: 500,
                          margin: 0,
                          flex: 1,
                          color: isDarkMode ? "#e5e7eb" : "#000",
                        }}
                      >
                        {question.question}
                      </Paragraph>
                    </div>

                    {/* Points Information */}
                    <div style={{ marginBottom: 16 }}>
                      <Tag
                        color="blue"
                        style={{
                          borderRadius: 12,
                          fontWeight: 500,
                        }}
                      >
                        Điểm: {answer?.points_earned || 0} / {question.points}
                      </Tag>
                    </div>

                    <Radio.Group
                      value={selectedId}
                      disabled
                      style={{ width: "100%" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {question.options.map((opt) => {
                          const isSelected = selectedId === opt.id;
                          const isCorrectOption = opt.is_correct;

                          let optionStyle = {
                            padding: "12px 16px",
                            borderRadius: 8,
                            backgroundColor: isDarkMode ? "#374151" : "#fafafa",
                            border: isDarkMode
                              ? "1px solid #4b5563"
                              : "1px solid #d9d9d9",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.3s ease",
                          };

                          if (isCorrectOption) {
                            optionStyle.backgroundColor = isDarkMode
                              ? "#064e3b"
                              : "#f6ffed";
                            optionStyle.borderColor = "#b7eb8f";
                          } else if (isSelected && !isCorrectOption) {
                            optionStyle.backgroundColor = isDarkMode
                              ? "#7f1d1d"
                              : "#fff2f0";
                            optionStyle.borderColor = "#ffccc7";
                          }

                          return (
                            <div key={opt.id} style={optionStyle}>
                              <Text
                                style={{
                                  color: isDarkMode ? "#f3f4f6" : "#000",
                                }}
                              >
                                {opt.option_text}
                              </Text>
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
                    </Radio.Group>

                    <div style={{ marginTop: 16 }}>
                      {!isAnswered ? (
                        <Text
                          type="warning"
                          style={{
                            fontWeight: 500,
                            color: isDarkMode ? "#facc15" : undefined,
                          }}
                        >
                          <MinusCircleOutlined /> Bạn chưa chọn đáp án
                        </Text>
                      ) : (
                        <Text
                          type={isCorrect ? "success" : "danger"}
                          style={{
                            fontWeight: 500,
                            color: isCorrect
                              ? "#22c55e"
                              : isDarkMode
                              ? "#f87171"
                              : "#ff4d4f",
                          }}
                        >
                          {isCorrect ? "✓ Trả lời đúng" : "✗ Trả lời sai"}
                        </Text>
                      )}
                    </div>

                    {correctOption && (
                      <Text
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontStyle: "italic",
                          color: "#52c41a",
                        }}
                      >
                        Đáp án đúng: <b>{correctOption.option_text}</b>
                      </Text>
                    )}
                    {question.explanation && (
                      <Text
                        type="secondary"
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontSize: 12,
                          color: isDarkMode ? "#9ca3af" : undefined,
                        }}
                      >
                        Giải thích: {question.explanation}
                      </Text>
                    )}

                    {answer && (
                      <>
                        <Divider style={{ margin: "16px 0" }} />
                        <Text
                          style={{
                            display: "block",
                            color: isDarkMode ? "#9ca3af" : "#666",
                            fontSize: 14,
                          }}
                        >
                          Điểm đạt được: <strong>{answer.points_earned}</strong>{" "}
                          / {question.points}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            onClick={() => navigate(-1)}
            size="large"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              color: "white",
              borderRadius: 8,
              padding: "0 32px",
              height: 40,
              fontWeight: 500,
            }}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionDetail;
