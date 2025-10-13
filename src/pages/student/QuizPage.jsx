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

  // ✅ Khi podcastId có giá trị thì mới fetch quiz
  useEffect(() => {
    if (podcastId) {
      fetchQuiz(podcastId);
    }
  }, [podcastId]);

  const fetchQuiz = async (pid) => {
    setLoading(true);
    try {
      const data = await getQuizQuestions(pid);
      setQuestions(data.questions || []);
      console.log(data);

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
      const res = await createQuizFromDocument(documentId);
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

  const handleSubmit = async () => {
    Modal.confirm({
      title: "Nộp bài?",
      content: "Bạn có chắc chắn muốn nộp bài làm không?",
      okText: "Nộp",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const finalId = podcastId || localStorage.getItem("current_podcast_id");
          if (!finalId) {
            message.warning("Không xác định được podcastID để nộp bài!");
            return;
          }

          const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
            question_id: qId,
            option_id: oId,
          }));

          console.log("Submit with podcastId:", finalId);
          console.log("Answers:", formattedAnswers);

          const res = await submitQuiz(finalId, formattedAnswers);
          setScore(res.score);
          message.success("Đã nộp bài!");
        } catch (err) {
          console.error(err);
          message.error("Lỗi khi nộp bài!");
        }
      },
    });
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
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
            <Card key={q.id} style={{ borderRadius: 12 }}>
              <Title level={5}>
                Câu {index + 1}: {q.question}
              </Title>
              <Radio.Group
                onChange={(e) => handleSelect(q.id, e.target.value)}
                value={answers[q.id]}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
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
          >
            Nộp bài
          </Button>
        </Space>
      )}

      {score !== null && (
        <Modal
          open={true}
          footer={null}
          onCancel={() => setScore(null)}
          title="Kết quả bài làm"
        >
          <Title level={3}>Điểm của bạn: {score.toFixed(2)} / 10</Title>
        </Modal>
      )}
    </div>
  );
};

export default QuizPage;
