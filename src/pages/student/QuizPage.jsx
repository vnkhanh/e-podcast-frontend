import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  Radio,
  Typography,
  Space,
  Spin,
  Modal,
  message,
} from "antd";
import { BulbOutlined, SendOutlined } from "@ant-design/icons";
import {
  createQuizFromDocument,
  getQuizQuestions,
  submitQuiz,
} from "../../services/api_quiz";

const { Title, Text } = Typography;

const QuizPage = () => {
  const { id: documentId } = useParams();
  const [podcastId, setPodcastId] = useState(
    localStorage.getItem("current_podcast_id") || null
  );
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizResult, setQuizResult] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [sourceModal, setSourceModal] = useState({ open: false, text: "" });

  useEffect(() => {
    if (podcastId) fetchQuiz(podcastId);
  }, [podcastId]);

  const fetchQuiz = async (pid) => {
    setLoading(true);
    try {
      console.log("Fetching quiz for podcastId:", pid);
      const data = await getQuizQuestions(pid);
      console.log("Quiz data:", data);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được câu hỏi!");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGenerating(true);
    try {
      console.log("Generating quiz from documentId:", documentId);
      const res = await createQuizFromDocument(documentId);
      console.log("Generate response:", res);
      message.success("Tạo trắc nghiệm thành công!");

      if (res.podcast_id) {
        setPodcastId(res.podcast_id);
        localStorage.setItem("current_podcast_id", res.podcast_id);
        fetchQuiz(res.podcast_id);
      } else {
        message.warning("Không tìm thấy podcast_id trong phản hồi!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tạo trắc nghiệm!");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    console.log(`Selected for question ${questionId}:`, optionId);
  };

  const handleSubmit = async () => {
    Modal.confirm({
      title: "Nộp bài?",
      content: "Bạn có chắc chắn muốn nộp bài làm không?",
      okText: "Nộp",
      cancelText: "Hủy",
      onOk: async () => {
        setSubmitting(true);
        try {
          const finalId =
            podcastId || localStorage.getItem("current_podcast_id");
          if (!finalId) {
            message.warning("Không xác định được podcastID để nộp bài!");
            setSubmitting(false);
            return;
          }

          // Gửi tất cả câu, kể cả chưa chọn
          const formattedAnswers = questions.map((q) => ({
            question_id: q.id,
            option_id: answers[q.id] || null,
          }));

          console.log("Submitting quiz for podcastId:", finalId);
          console.log("Answers:", formattedAnswers);

          const res = await submitQuiz(finalId, formattedAnswers);
          console.log("Submit response:", res);

          setScore(res.score);
          setQuizResult(res.results ?? []);
          message.success("Đã nộp bài!");
        } catch (err) {
          console.error(err);
          message.error("Lỗi khi nộp bài!");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Bài trắc nghiệm</Title>

      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<BulbOutlined />}
          onClick={handleGenerateQuiz}
          loading={generating}
          type="primary"
        >
          Tạo trắc nghiệm bằng AI
        </Button>
      </Space>

      {questions.length === 0 ? (
        <Text type="secondary">Chưa có câu hỏi nào cho podcast này.</Text>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          {questions.map((q, index) => (
            <Card
              key={q.id}
              style={{ borderRadius: 12 }}
              extra={
                <Button
                  icon={<BulbOutlined />}
                  size="small"
                  onClick={() =>
                    setSourceModal({ open: true, text: q.source_text })
                  }
                >
                  Gợi ý
                </Button>
              }
            >
              <Title level={5}>
                Câu {index + 1}: {q.question}
              </Title>
              <Radio.Group
                onChange={(e) => handleSelect(q.id, e.target.value)}
                value={answers[q.id] || null}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
                disabled={submitting}
              >
                {(q.Options || []).map((opt) => (
                  <Radio key={opt.id} value={opt.id}>
                    {opt.option_text}
                  </Radio>
                ))}
              </Radio.Group>
            </Card>
          ))}

          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleSubmit}
            loading={submitting}
          >
            Nộp bài
          </Button>
        </Space>
      )}

      {/* Modal trích dẫn */}
      <Modal
        open={sourceModal.open}
        footer={null}
        onCancel={() => setSourceModal({ open: false, text: "" })}
        title="Trích dẫn từ tài liệu"
      >
        <Text>{sourceModal.text}</Text>
      </Modal>

      {/* Modal kết quả */}
      <Modal
        open={score !== null}
        footer={null}
        onCancel={() => {
          setScore(null);
          setQuizResult([]);
        }}
        title="Kết quả bài làm"
        width={800}
      >
        <Title level={3}>Điểm của bạn: {score?.toFixed(2)} / 10</Title>

        {console.log("QuizResult for modal:", quizResult)}

        {quizResult.map((q, idx) => {
          const selectedId = q.selected_id?.toString();
          const correctId = q.correct_id?.toString();
          const options = Array.isArray(q.options) ? q.options : [];

          return (
            <Card
              key={q.question_id}
              type="inner"
              title={`Câu ${idx + 1}: ${q.question}`}
            >
              <Radio.Group
                value={selectedId || null}
                disabled
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                {options.map((opt) => {
                  const optId = opt.id?.toString();
                  let color = "inherit";

                  if (optId === correctId) color = "green";
                  else if (optId === selectedId && optId !== correctId)
                    color = "red";

                  return (
                    <Radio key={optId} value={optId} style={{ color }}>
                      {opt.option_text}
                      {optId === correctId ? " (Đáp án đúng)" : ""}
                      {optId === selectedId && optId !== correctId
                        ? " (Bạn chọn)"
                        : ""}
                    </Radio>
                  );
                })}
              </Radio.Group>

              {!selectedId ? (
                <Text type="warning">Bạn chưa chọn đáp án</Text>
              ) : (
                <Text type={selectedId === correctId ? "success" : "danger"}>
                  {selectedId === correctId ? "Đúng" : "Sai"}
                </Text>
              )}
            </Card>
          );
        })}
      </Modal>
    </div>
  );
};

export default QuizPage;
