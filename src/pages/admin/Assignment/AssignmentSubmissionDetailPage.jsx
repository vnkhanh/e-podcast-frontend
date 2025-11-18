import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Space,
  Spin,
  Alert,
  Button,
  Divider,
  Descriptions,
  Badge,
  Tag,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const AssignmentSubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/admin/assignments/submissions/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmission(res.data.submission || null);
      } catch (err) {
        setError(err.response?.data?.error || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id, token]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div style={{ padding: 24 }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  if (!submission) return null;

  const assignment = submission.assignment || {};
  const user = submission.user || {};
  const answers = submission.answers || [];
  const timeSpent = submission.time_spent ?? 0;
  const score = submission.score ?? 0;
  const maxScore = submission.max_score ?? 0;
  const isPassed = submission.is_passed ?? false;

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Câu hỏi",
      key: "question",
      width: 400,
      render: (_, answer) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          <Paragraph style={{ marginBottom: 4 }}>
            {answer.question?.question || "-"}
          </Paragraph>
          {answer.question?.explanation && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              <i>Giải thích: {answer.question.explanation}</i>
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Đáp án",
      key: "selected",
      width: 100,
      render: (_, answer) =>
        answer.selected_option ? (
          <Text
            style={{
              color: answer.selected_option.is_correct ? "green" : "red",
              fontWeight: 500,
              // Bỏ nowrap & ellipsis để chữ xuống hàng
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {answer.selected_option.option_text || "-"}
          </Text>
        ) : (
          <Text type="secondary">Bỏ trống</Text>
        ),
    },

    {
      title: "Đúng/Sai",
      key: "correct",
      width: 60,
      render: (_, answer) =>
        answer.is_correct ? (
          <Text style={{ color: "green", fontWeight: 500 }}>Đúng</Text>
        ) : (
          <Text style={{ color: "red", fontWeight: 500 }}>Sai</Text>
        ),
    },
    {
      title: "Điểm",
      key: "points",
      width: 60,
      render: (_, answer) => answer.points_earned ?? 0,
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <Space
        style={{
          marginBottom: 24,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Badge
          count={`Lần làm: ${submission.attempt_num}`}
          style={{ backgroundColor: "#1890ff" }}
        />
      </Space>

      {/* Thông tin bài nộp */}
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          {assignment.title || "Không có tiêu đề"}{" "}
          {assignment.has_password && assignment.password && (
            <Tag color="orange" style={{ fontSize: 14 }}>
              Mật khẩu: {assignment.password}
            </Tag>
          )}
        </Title>
        <Text type="secondary">
          {assignment.description || "Không có mô tả"}
        </Text>

        <Divider />

        <Descriptions column={2} size="middle">
          <Descriptions.Item label="Sinh viên">
            {user.full_name || "-"} ({user.email || "-"})
          </Descriptions.Item>
          <Descriptions.Item label="Điểm">
            <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
              {score}
            </Text>{" "}
            / {maxScore}{" "}
            {isPassed ? (
              <Tag color="green">Đạt</Tag>
            ) : (
              <Tag color="red">Chưa đạt</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian làm">
            {Math.floor(timeSpent / 60)} phút {timeSpent % 60} giây
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian nộp">
            {submission.submitted_at
              ? dayjs(submission.submitted_at).format("DD/MM/YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Danh sách câu trả lời */}
      <Card title="Chi tiết câu trả lời" style={{ borderRadius: 8 }}>
        {answers.length > 0 ? (
          <Table
            dataSource={answers}
            columns={columns}
            rowKey={(row) => row.id}
            pagination={false}
            bordered
            size="middle"
            scroll={{ x: 700 }}
            style={{ tableLayout: "fixed" }}
          />
        ) : (
          <Alert
            message="Không có câu trả lời"
            description="Sinh viên chưa nộp câu trả lời nào."
            type="info"
            showIcon
          />
        )}
      </Card>
    </div>
  );
};

export default AssignmentSubmissionDetailPage;
