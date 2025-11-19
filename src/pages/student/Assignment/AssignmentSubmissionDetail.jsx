import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, Radio, Divider, Alert, Button } from "antd";
import { getSubmissionDetail } from "../../../services/api_assignment";

const { Title, Text } = Typography;

const AssignmentSubmissionDetail = ({ token }) => {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();
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

  if (loading)
    return (
      <Spin
        tip="Đang tải..."
        style={{ display: "block", margin: "100px auto" }}
      />
    );

  if (!submission)
    return (
      <Card>
        <Alert message="Không tìm thấy bài làm" type="error" />
        <Button onClick={() => navigate(-1)} style={{ marginTop: 12 }}>
          Quay lại
        </Button>
      </Card>
    );

  const { assignment, attempt_num, score, max_score, time_spent, answers } =
    submission;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        {assignment.title} - Lần làm #{attempt_num}
      </Title>
      <Text>
        Điểm: {score} / {max_score}
      </Text>
      <Text style={{ display: "block", marginBottom: 12 }}>
        Thời gian làm bài: {time_spent} giây
      </Text>

      {assignment.questions.map((question, idx) => {
        // Tìm câu trả lời của sinh viên (nếu có)
        const ans = answers.find((a) => a.question.id === question.id);

        return (
          <Card
            key={question.id}
            type="inner"
            title={`Câu ${idx + 1}: ${question.question}`}
            style={{ marginTop: 12 }}
          >
            <Radio.Group value={ans?.selected_id} disabled>
              {question.options.map((opt) => (
                <Radio
                  key={opt.id}
                  value={opt.id}
                  style={{
                    display: "block",
                    color: opt.is_correct ? "#52c41a" : undefined,
                    fontWeight: ans?.selected_id === opt.id ? 600 : 400,
                  }}
                >
                  {opt.option_text}{" "}
                  {opt.is_correct && <Text type="success">(Đáp án)</Text>}
                </Radio>
              ))}
            </Radio.Group>

            {/* Chỉ hiển thị điểm nếu sinh viên đã trả lời */}
            {ans && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <Text>
                  Điểm: {ans.points_earned} / {ans.question.points}
                </Text>
              </>
            )}
          </Card>
        );
      })}

      <Button style={{ marginTop: 24 }} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </div>
  );
};

export default AssignmentSubmissionDetail;
