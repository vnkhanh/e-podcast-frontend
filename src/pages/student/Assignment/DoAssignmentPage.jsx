// src/pages/DoAssignmentPage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Typography,
  Button,
  Radio,
  Space,
  message,
  Alert,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAssignmentDetail,
  submitAssignment,
} from "../../../services/api_assignment";

const { Title, Paragraph } = Typography;

const DoAssignmentPage = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAssignmentDetail(id, token);

        if (!res.data.assignment) {
          message.error("Không tìm thấy bài tập");
          navigate(-1);
          return;
        }

        setAssignment(res.data.assignment);

        // Nếu có giới hạn thời gian
        if (res.data.assignment.time_limit > 0) {
          setTimeLeft(res.data.assignment.time_limit * 60);
        }
      } catch (err) {
        console.error(err);
        message.error("Lỗi tải bài tập");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!timeLeft) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          message.warning("Hết thời gian. Bài sẽ được nộp.");
          handleSubmit();
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChoose = (questionID, optionID) => {
    setAnswers({
      ...answers,
      [questionID]: optionID,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.keys(answers).map((qID) => ({
        question_id: qID,
        selected_id: answers[qID],
      }));

      await submitAssignment(id, payload, token);

      message.success("Nộp bài thành công");
      navigate(`/assignment/${id}`);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi nộp bài");
    }
  };

  if (loading) return <Spin size="large" />;

  if (!assignment)
    return <Alert message="Không tìm thấy bài tập" type="error" />;

  return (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Title level={3}>Làm bài: {assignment.title}</Title>

        <Paragraph style={{ color: "#666" }}>
          {assignment.description}
        </Paragraph>

        {assignment.time_limit > 0 && (
          <Alert
            type="warning"
            message={`Giới hạn thời gian: ${
              assignment.time_limit
            } phút — Còn lại: ${formatTime(timeLeft)}`}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {assignment.questions.length === 0 ? (
          <Alert
            message="Bài tập chưa có câu hỏi."
            type="info"
            showIcon
            style={{ borderRadius: 8 }}
          />
        ) : (
          assignment.questions.map((q, index) => (
            <Card
              key={q.id}
              style={{
                borderRadius: 12,
                marginBottom: 16,
                background: "#fafafa",
              }}
            >
              <Title level={5}>
                Câu {index + 1}: {q.question}
              </Title>

              <Radio.Group
                onChange={(e) => handleChoose(q.id, e.target.value)}
                value={answers[q.id]}
              >
                <Space direction="vertical">
                  {q.options
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((opt) => (
                      <Radio key={opt.id} value={opt.id}>
                        {opt.option_text}
                      </Radio>
                    ))}
                </Space>
              </Radio.Group>
            </Card>
          ))
        )}

        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
        >
          Nộp bài
        </Button>
      </Space>
    </Card>
  );
};

export default DoAssignmentPage;
