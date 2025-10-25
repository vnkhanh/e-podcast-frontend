import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Radio,
  Typography,
  Space,
  Spin,
  Modal,
  message,
  Progress,
  Row,
  Col,
} from "antd";
import {
  BulbOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  DownOutlined,
  UpOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getQuizQuestions, submitQuiz } from "../../../services/api_quiz";

const { Title, Text, Paragraph } = Typography;

const QuizTakePage = () => {
  const { id } = useParams(); // quiz_set_id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizSet, setQuizSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizResult, setQuizResult] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [sourceModal, setSourceModal] = useState({
    open: false,
    text: "",
    hint: "",
  });

  useEffect(() => {
    if (id) fetchQuiz(id);
  }, [id]);

  const fetchQuiz = async (quizSetId) => {
    setLoading(true);
    try {
      const data = await getQuizQuestions(quizSetId);
      setQuizSet(data.quiz_set);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được câu hỏi!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      Modal.confirm({
        title: "Còn câu hỏi chưa trả lời",
        content: `Bạn còn ${unanswered.length} câu chưa trả lời. Bạn có chắc muốn nộp bài?`,
        okText: "Nộp bài",
        cancelText: "Tiếp tục làm",
        onOk: () => submitQuizConfirm(),
      });
    } else {
      Modal.confirm({
        title: "Nộp bài?",
        content: "Bạn có chắc chắn muốn nộp bài làm không?",
        okText: "Nộp",
        cancelText: "Hủy",
        onOk: () => submitQuizConfirm(),
      });
    }
  };

  const submitQuizConfirm = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        option_id: answers[q.id] || null,
      }));

      const durationSec = Math.floor((Date.now() - startTime) / 1000);
      const res = await submitQuiz(id, {
        answers: formattedAnswers,
        duration_sec: durationSec,
      });

      setScore(res.score);
      setQuizResult(res.results ?? []);
      message.success("Đã nộp bài thành công!");
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi nộp bài!");
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    if (questions.length === 0) return 0;
    return parseFloat(((answered / questions.length) * 100).toFixed(2));
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "120px 0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải bài trắc nghiệm..." />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        padding: 24,
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

            {quizSet && (
              <>
                <Title level={3} style={{ color: "white", margin: 0 }}>
                  {quizSet.title}
                </Title>
                <Paragraph style={{ color: "rgba(255,255,255,0.8)" }}>
                  {quizSet.description || "Bài trắc nghiệm tự động từ podcast"}
                </Paragraph>

                <Row gutter={16}>
                  <Col span={12}>
                    <Text style={{ color: "white" }}>
                      <ClockCircleOutlined /> Tổng số câu:{" "}
                      <strong>{questions.length}</strong>
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ color: "white" }}>
                      Đã trả lời:{" "}
                      <strong>
                        {Object.keys(answers).length}/{questions.length}
                      </strong>
                    </Text>
                  </Col>
                </Row>

                <Progress
                  percent={getProgress()}
                  status="active"
                  strokeColor={{
                    "0%": "#ffeaa7",
                    "100%": "#55efc4",
                  }}
                  style={{ marginTop: 16 }}
                />
              </>
            )}
          </Card>

          {/* Questions */}
          {questions.length === 0 ? (
            <Card style={{ borderRadius: 16, textAlign: "center" }}>
              <Text type="secondary">Bộ trắc nghiệm này chưa có câu hỏi.</Text>
            </Card>
          ) : (
            <>
              {questions.map((q, index) => (
                <Card
                  key={q.id}
                  style={{
                    borderRadius: 16,
                    background: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  className="quiz-question-card"
                  title={
                    <Space>
                      <Text strong style={{ fontSize: 16 }}>
                        Câu {index + 1}
                      </Text>
                      {answers[q.id] && (
                        <Text type="success" style={{ fontSize: 12 }}>
                          ✓ Đã trả lời
                        </Text>
                      )}
                    </Space>
                  }
                  extra={
                    q.hint && (
                      <Button
                        icon={<BulbOutlined />}
                        size="small"
                        onClick={() =>
                          setSourceModal({
                            open: true,
                            text: q.source_text,
                            hint: q.hint,
                            showSource: false,
                          })
                        }
                        style={{
                          background:
                            "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
                          border: "none",
                          color: "#333",
                          fontWeight: 500,
                          borderRadius: 8,
                        }}
                      >
                        Gợi ý
                      </Button>
                    )
                  }
                >
                  <Paragraph strong style={{ fontSize: 16, marginBottom: 16 }}>
                    {q.question}
                  </Paragraph>

                  <Radio.Group
                    onChange={(e) => handleSelect(q.id, e.target.value)}
                    value={answers[q.id] || null}
                    style={{ width: "100%" }}
                    disabled={submitting || score !== null}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {(q.options || q.Options || []).map((opt) => (
                        <Radio
                          key={opt.id}
                          value={opt.id}
                          style={{
                            padding: "12px 16px",
                            border: "1px solid #d9d9d9",
                            borderRadius: 8,
                            width: "100%",
                            marginBottom: 8,
                            transition: "all 0.2s ease",
                            background:
                              answers[q.id] === opt.id
                                ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                                : "white",
                          }}
                        >
                          {opt.option_text}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Card>
              ))}

              <Card style={{ borderRadius: 16, textAlign: "center" }}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  size="large"
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={score !== null}
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

        {/* Modal gợi ý */}
        <Modal
          open={sourceModal.open}
          footer={null}
          onCancel={() => setSourceModal({ open: false, text: "", hint: "" })}
          title="Gợi ý từ câu hỏi"
        >
          {sourceModal.hint && (
            <Paragraph italic style={{ color: "#faad14", marginBottom: 16 }}>
              <BulbOutlined style={{ marginRight: 8 }} />
              {sourceModal.hint}
            </Paragraph>
          )}

          <Button
            type="link"
            icon={sourceModal.showSource ? <UpOutlined /> : <DownOutlined />}
            onClick={() =>
              setSourceModal((prev) => ({
                ...prev,
                showSource: !prev.showSource,
              }))
            }
          >
            {sourceModal.showSource
              ? "Ẩn trích dẫn tài liệu"
              : "Hiện trích dẫn tài liệu"}
          </Button>

          {sourceModal.showSource && (
            <div
              style={{
                background: "#fafafa",
                borderRadius: 8,
                padding: 12,
                marginTop: 8,
              }}
            >
              <Text>{sourceModal.text}</Text>
            </div>
          )}
        </Modal>

        {/* Modal kết quả */}
        <Modal
          open={score !== null}
          footer={
            <Space>
              <Button onClick={() => navigate(-1)}>Quay lại</Button>
              <Button
                type="primary"
                onClick={() => window.location.reload()}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                Làm lại
              </Button>
            </Space>
          }
          onCancel={() => {
            setScore(null);
            setQuizResult([]);
          }}
          title="Kết quả bài làm"
          width={800}
        >
          <Title level={3} style={{ textAlign: "center", color: "#52c41a" }}>
            Điểm của bạn: {score?.toFixed(2)} / 10
          </Title>

          <Progress
            percent={parseFloat(((score / 10) * 100).toFixed(2))}
            strokeColor={{
              "0%": "#ff4d4f",
              "100%": "#52c41a",
            }}
            style={{ marginBottom: 24 }}
          />

          {quizResult.map((q, idx) => {
            const selectedId = q.selected_id?.toString();
            const correctId = q.correct_id?.toString();
            const options = Array.isArray(q.options) ? q.options : [];

            return (
              <Card
                key={q.question_id}
                type="inner"
                title={`Câu ${idx + 1}: ${q.question}`}
                style={{ marginBottom: 16, borderRadius: 12 }}
              >
                <Radio.Group
                  value={selectedId || null}
                  disabled
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {options.map((opt) => {
                      const optId = opt.id?.toString();
                      const isCorrect = optId === correctId;
                      const isSelected = optId === selectedId;
                      return (
                        <Radio
                          key={optId}
                          value={optId}
                          style={{
                            color: isCorrect
                              ? "green"
                              : isSelected
                              ? "red"
                              : "inherit",
                            background: isCorrect
                              ? "#f6ffed"
                              : isSelected && !isCorrect
                              ? "#fff1f0"
                              : "white",
                            padding: 8,
                            borderRadius: 6,
                            width: "100%",
                          }}
                        >
                          {opt.option_text}
                          {isCorrect && " ✓ (Đáp án đúng)"}
                          {isSelected && !isCorrect && " ✗ (Bạn chọn)"}
                        </Radio>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </Card>
            );
          })}
        </Modal>
      </div>
      <style jsx>{`
        .quiz-question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default QuizTakePage;
