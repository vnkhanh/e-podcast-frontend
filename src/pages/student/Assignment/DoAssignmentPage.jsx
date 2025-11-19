import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Card,
  Typography,
  Button,
  Radio,
  Space,
  message,
  Alert,
  Spin,
  Modal,
  Progress,
  Row,
  Col,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAssignmentDetail,
  startAssignment,
  saveAssignmentProgress,
  submitAssignment,
} from "../../../services/api_assignment";
import {
  SendOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "../../../context/useTheme";

const { Title, Paragraph, Text } = Typography;

const DoAssignmentPage = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [saving, setSaving] = useState(false);

  const timerRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await getAssignmentDetail(id, token);
        if (!res.assignment) {
          message.error("Không tìm thấy bài tập");
          navigate(-1);
          return;
        }
        setAssignment(res.assignment);

        // Bắt đầu hoặc load submission
        const startRes = await startAssignment(id, token);
        if (!mounted) return;

        const sub = startRes.submission;
        setSubmissionId(sub.id);
        setStartTime(new Date(sub.started_at));

        // LOAD CÁC CÂU TRẢ LỜI ĐÃ LÀM (NẾU CÓ)
        if (sub.answers && sub.answers.length > 0) {
          const savedAnswers = {};
          sub.answers.forEach((ans) => {
            savedAnswers[ans.question_id] = ans.selected_id;
          });
          setAnswers(savedAnswers);
          message.info(
            `Tiếp tục làm bài - Đã có ${sub.answers.length} câu trả lời`
          );
        } else {
          message.success("Bắt đầu làm bài mới");
        }

        // Xử lý time limit
        if (res.assignment.time_limit > 0) {
          const elapsed = Math.floor(
            (Date.now() - new Date(sub.started_at)) / 1000
          );
          const remaining = res.assignment.time_limit * 60 - elapsed;
          setTimeLeft(remaining > 0 ? remaining : 0);
          if (remaining <= 0) handleSubmit(sub.id);
        }
      } catch (err) {
        console.error(err);
        message.error(err.error || "Lỗi tải bài tập");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          message.warning("Hết thời gian. Bài sẽ được nộp.");
          handleSubmit(submissionId);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submissionId]);

  // AUTOSAVE với debounce
  useEffect(() => {
    if (!submissionId || Object.keys(answers).length === 0) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const payload = Object.keys(answers).map((qID) => ({
          question_id: qID,
          selected_id: answers[qID],
        }));
        await saveAssignmentProgress(submissionId, payload, token);
        console.log("Đã autosave");
      } catch (err) {
        console.error("Lỗi autosave:", err);
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [answers, submissionId, token]);

  // Warn before unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (submissionId && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = "Bạn có chắc muốn thoát? Tiến trình đã lưu tự động.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submissionId, answers]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  const handleChoose = (questionID, optionID) =>
    setAnswers({ ...answers, [questionID]: optionID });

  const handleSubmit = async () => {
    try {
      const timeSpent = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 0;
      const payload = Object.keys(answers).map((qID) => ({
        question_id: qID,
        selected_id: answers[qID],
      }));
      await submitAssignment(
        id,
        { answers: payload, time_spent: timeSpent },
        token
      );
      message.success("Nộp bài thành công");
      navigate(`/assignment/${id}`);
    } catch (err) {
      console.error(err);
      message.error(err.error || "Lỗi khi nộp bài");
    }
  };

  const confirmSubmit = () => {
    const unanswered = assignment.questions.filter((q) => !answers[q.id]);

    const confirmProps = {
      okText: "Nộp bài",
      cancelText: "Tiếp tục làm",
      onOk: handleSubmit,
    };

    if (unanswered.length > 0) {
      Modal.confirm({
        title: "Còn câu hỏi chưa trả lời",
        content: `Bạn còn ${unanswered.length} câu chưa trả lời. Bạn có chắc muốn nộp bài?`,
        ...confirmProps,
      });
    } else {
      Modal.confirm({
        title: "Nộp bài?",
        content: "Bạn có chắc chắn muốn nộp bài làm không?",
        ...confirmProps,
      });
    }
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    if (!assignment || assignment.questions.length === 0) return 0;
    return parseFloat(
      ((answered / assignment.questions.length) * 100).toFixed(2)
    );
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "120px 0",
          background: isDarkMode
            ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải bài tập..." />
      </div>
    );
  }

  if (!assignment)
    return (
      <Alert
        message="Không tìm thấy bài tập"
        type="error"
        style={{ margin: 24 }}
      />
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: isDarkMode ? "#111827" : "#f5f5f5",
        color: isDarkMode ? "#e5e7eb" : "#000",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <Card
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
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

            <Title level={3} style={{ color: "white", margin: 0 }}>
              {assignment.title}
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.8)" }}>
              {assignment.description || "Bài tập trắc nghiệm"}
            </Paragraph>

            <Row gutter={16}>
              <Col span={12}>
                <Text style={{ color: "white" }}>
                  <ClockCircleOutlined /> Tổng số câu:{" "}
                  <strong>{assignment.questions.length}</strong>
                </Text>
              </Col>
              <Col span={12}>
                <Text style={{ color: "white" }}>
                  Đã trả lời:{" "}
                  <strong>
                    {Object.keys(answers).length}/{assignment.questions.length}
                  </strong>
                </Text>
              </Col>
            </Row>

            {assignment.time_limit > 0 && timeLeft !== null && (
              <Alert
                type={timeLeft < 300 ? "error" : "warning"}
                message={
                  <Space>
                    <ClockCircleOutlined />
                    <span>
                      Giới hạn thời gian: {assignment.time_limit} phút – Còn
                      lại: <strong>{formatTime(timeLeft)}</strong>
                    </span>
                  </Space>
                }
                style={{
                  marginTop: 16,
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                }}
              />
            )}

            <Progress
              percent={getProgress()}
              status="active"
              strokeColor={{
                "0%": "#ffeaa7",
                "100%": "#55efc4",
              }}
              style={{ marginTop: 16 }}
            />
          </Card>

          {/* Auto-save Alert */}
          <Alert
            type="info"
            message={
              <Space>
                {saving ? (
                  <Spin size="small" />
                ) : (
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                )}
                <span>
                  {saving
                    ? "Đang lưu tiến trình..."
                    : "Tiến trình được lưu tự động khi bạn chọn đáp án"}
                </span>
              </Space>
            }
            style={{
              borderRadius: 12,
              background: isDarkMode ? "#1f2937" : "#e6f7ff",
              border: isDarkMode ? "1px solid #374151" : "1px solid #91d5ff",
            }}
          />

          {/* Questions */}
          {assignment.questions.length === 0 ? (
            <Card
              style={{
                borderRadius: 16,
                textAlign: "center",
                background: isDarkMode ? "#1f2937" : "white",
                color: isDarkMode ? "#e5e7eb" : "#000",
              }}
            >
              <Text type="secondary">Bài tập này chưa có câu hỏi.</Text>
            </Card>
          ) : (
            <>
              {assignment.questions.map((q, index) => (
                <Card
                  key={q.id}
                  style={{
                    borderRadius: 16,
                    background: isDarkMode ? "#1f2937" : "white",
                    boxShadow: isDarkMode
                      ? "0 2px 6px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    color: isDarkMode ? "#e5e7eb" : "#000",
                  }}
                  className="assignment-question-card"
                  title={
                    <Space>
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          color: isDarkMode ? "#fff" : "#000",
                        }}
                      >
                        Câu {index + 1} {q.points > 0 && `(${q.points} điểm)`}
                      </Text>
                      {answers[q.id] && (
                        <Text type="success" style={{ fontSize: 12 }}>
                          ✓ Đã trả lời
                        </Text>
                      )}
                    </Space>
                  }
                >
                  <Paragraph strong style={{ fontSize: 16, marginBottom: 16 }}>
                    {q.question}
                  </Paragraph>

                  <Radio.Group
                    onChange={(e) => handleChoose(q.id, e.target.value)}
                    value={answers[q.id] || null}
                    style={{ width: "100%" }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {q.options
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((opt) => (
                          <Radio
                            key={opt.id}
                            value={opt.id}
                            style={{
                              padding: "12px 16px",
                              border: isDarkMode
                                ? "1px solid #374151"
                                : "1px solid #d9d9d9",
                              borderRadius: 8,
                              width: "100%",
                              marginBottom: 8,
                              transition: "all 0.2s ease",
                              background:
                                answers[q.id] === opt.id
                                  ? isDarkMode
                                    ? "linear-gradient(135deg, #312e81 0%, #4338ca 100%)"
                                    : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                                  : isDarkMode
                                  ? "#111827"
                                  : "white",
                              color: isDarkMode ? "#f3f4f6" : "#000",
                            }}
                          >
                            {opt.option_text}
                          </Radio>
                        ))}
                    </Space>
                  </Radio.Group>
                </Card>
              ))}

              {/* Submit Button */}
              <Card
                style={{
                  borderRadius: 16,
                  textAlign: "center",
                  background: isDarkMode ? "#1f2937" : "white",
                }}
              >
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  size="large"
                  onClick={confirmSubmit}
                  disabled={Object.keys(answers).length === 0}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    height: 48,
                    width: "100%",
                  }}
                >
                  Nộp bài
                </Button>
              </Card>
            </>
          )}
        </Space>
      </div>

      <style jsx>{`
        .assignment-question-card:hover {
          transform: translateY(-2px);
          box-shadow: ${isDarkMode
            ? "0 4px 12px rgba(255,255,255,0.1)"
            : "0 6px 16px rgba(0, 0, 0, 0.08)"};
        }
      `}</style>
    </div>
  );
};

export default DoAssignmentPage;
