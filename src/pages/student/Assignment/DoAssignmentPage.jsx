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
  Modal,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAssignmentDetail,
  startAssignment,
  saveAssignmentProgress,
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

        // ✅ LOAD CÁC CÂU TRẢ LỜI ĐÃ LÀM (NẾU CÓ)
        if (sub.answers && sub.answers.length > 0) {
          const savedAnswers = {};
          sub.answers.forEach((ans) => {
            // Chuyển UUID thành string để làm key
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
  }, [timeLeft, submissionId]);

  // ✅ AUTOSAVE với debounce
  useEffect(() => {
    if (!submissionId || Object.keys(answers).length === 0) return;

    // Clear timeout cũ
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set timeout mới - sau 2 giây không thay đổi thì lưu
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const payload = Object.keys(answers).map((qID) => ({
          question_id: qID,
          selected_id: answers[qID],
        }));
        await saveAssignmentProgress(submissionId, payload, token);
        console.log("✅ Đã autosave");
      } catch (err) {
        console.error("❌ Lỗi autosave:", err);
      } finally {
        setSaving(false);
      }
    }, 2000); // Debounce 2 giây

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

  const handleSubmit = async (subId = submissionId) => {
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
    Modal.confirm({
      title: "Xác nhận nộp bài",
      content:
        "Bạn có chắc chắn muốn nộp bài? Sau khi nộp sẽ không thể chỉnh sửa.",
      okText: "Nộp bài",
      cancelText: "Hủy",
      onOk: handleSubmit,
    });
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  if (!assignment)
    return <Alert message="Không tìm thấy bài tập" type="error" />;

  return (
    <Card bodyStyle={{ padding: 24 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Title level={3}>Làm bài: {assignment.title}</Title>
        <Paragraph style={{ color: "#666" }}>
          {assignment.description}
        </Paragraph>

        {assignment.time_limit > 0 && timeLeft !== null && (
          <Alert
            type={timeLeft < 300 ? "error" : "warning"}
            message={`Giới hạn thời gian: ${
              assignment.time_limit
            } phút – Còn lại: ${formatTime(timeLeft)}`}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Alert
          type="info"
          message={
            saving
              ? "Đang lưu..."
              : "✓ Tiến trình được lưu tự động khi bạn chọn đáp án"
          }
          showIcon
          style={{ marginBottom: 16 }}
        />

        {assignment.questions.length === 0 ? (
          <Alert message="Bài tập chưa có câu hỏi." type="info" showIcon />
        ) : (
          assignment.questions.map((q, index) => (
            <Card
              key={q.id}
              style={{ marginBottom: 16, background: "#fafafa" }}
            >
              <Title level={5}>
                Câu {index + 1}: {q.question} <span>({q.points} điểm)</span>
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
          onClick={confirmSubmit}
          disabled={Object.keys(answers).length === 0}
        >
          Nộp bài
        </Button>
      </Space>
    </Card>
  );
};

export default DoAssignmentPage;
