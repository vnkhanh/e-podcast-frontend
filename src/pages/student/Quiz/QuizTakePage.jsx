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
      console.log("Quiz data:", data);

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
    // Kiểm tra đã trả lời hết chưa
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
      //Tính thời gian làm bài (giây)
      const durationSec = Math.floor((Date.now() - startTime) / 1000);

      // Gửi cả duration_sec trong body
      const res = await submitQuiz(id, {
        answers: formattedAnswers,
        duration_sec: durationSec,
      });
      console.log("Submit response:", res);

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
    return (answered / questions.length) * 100;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Đang tải bài trắc nghiệm..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>

          {quizSet && (
            <>
              <Title level={3}>{quizSet.title}</Title>
              <Paragraph type="secondary">{quizSet.description}</Paragraph>

              <Row gutter={16}>
                <Col span={12}>
                  <Text>
                    <ClockCircleOutlined /> Tổng số câu:{" "}
                    <strong>{questions.length}</strong>
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
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
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                style={{ marginTop: 16 }}
              />
            </>
          )}
        </Card>

        {/* Questions */}
        {questions.length === 0 ? (
          <Card>
            <Text type="secondary">
              Bộ trắc nghiệm này chưa có câu hỏi nào.
            </Text>
          </Card>
        ) : (
          <>
            {questions.map((q, index) => (
              <Card
                key={q.id}
                title={
                  <Space>
                    <Text strong>Câu {index + 1}</Text>
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
                    >
                      Gợi ý
                    </Button>
                  )
                }
                style={{ borderRadius: 12 }}
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
                          padding: "12px",
                          border: "1px solid #d9d9d9",
                          borderRadius: 8,
                          width: "100%",
                          marginBottom: 8,
                        }}
                      >
                        {opt.option_text}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Card>
            ))}

            <Card>
              <Button
                type="primary"
                icon={<SendOutlined />}
                size="large"
                onClick={handleSubmit}
                loading={submitting}
                disabled={score !== null}
                block
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
          <Paragraph type="secondary" italic style={{ marginBottom: 16 }}>
            <BulbOutlined style={{ color: "#faad14", marginRight: 8 }} />
            {sourceModal.hint}
          </Paragraph>
        )}

        <div style={{ marginTop: 12 }}>
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
        </div>
      </Modal>

      {/* Modal kết quả */}
      <Modal
        open={score !== null}
        footer={
          <Space>
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
            <Button type="primary" onClick={() => window.location.reload()}>
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
          percent={(score / 10) * 100}
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
              style={{ marginBottom: 16 }}
            >
              <Radio.Group
                value={selectedId || null}
                disabled
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {options.map((opt) => {
                    const optId = opt.id?.toString();
                    let color = "inherit";
                    let backgroundColor = "transparent";

                    if (optId === correctId) {
                      color = "green";
                      backgroundColor = "#f6ffed";
                    } else if (optId === selectedId && optId !== correctId) {
                      color = "red";
                      backgroundColor = "#fff1f0";
                    }

                    return (
                      <Radio
                        key={optId}
                        value={optId}
                        style={{
                          color,
                          backgroundColor,
                          padding: "8px",
                          borderRadius: 4,
                          width: "100%",
                        }}
                      >
                        {opt.option_text}
                        {optId === correctId && " ✓ (Đáp án đúng)"}
                        {optId === selectedId &&
                          optId !== correctId &&
                          " ✗ (Bạn chọn)"}
                      </Radio>
                    );
                  })}
                </Space>
              </Radio.Group>

              {!selectedId ? (
                <Text type="warning" style={{ marginTop: 8 }}>
                  Bạn chưa chọn đáp án
                </Text>
              ) : (
                <Text
                  type={selectedId === correctId ? "success" : "danger"}
                  style={{ marginTop: 8 }}
                >
                  {selectedId === correctId ? "✓ Đúng" : "✗ Sai"}
                </Text>
              )}
            </Card>
          );
        })}
      </Modal>
    </div>
  );
};

export default QuizTakePage;
