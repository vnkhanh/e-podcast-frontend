import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Space, Button, Table, Alert, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssignmentDetail,
  getUserSubmissions,
} from "../../../services/api_assignment";

const { Title, Paragraph } = Typography;

const AssignmentDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(0);

  // Reset state khi token thay đổi (switch account)
  useEffect(() => {
    setAssignment(null);
    setSubmissions([]);
    setAttemptsLeft(0);
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        // Lấy chi tiết assignment
        const res = await getAssignmentDetail(id, token);
        setAssignment(res.data.assignment);
        setAttemptsLeft(res.data.attempts_left);

        // Lấy lịch sử làm bài của user hiện tại
        const subs = await getUserSubmissions(id, token);
        setSubmissions(subs.data.submissions || []);
      } catch (err) {
        console.error(err);
        setAssignment(null);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, token, navigate]);

  const columns = [
    { title: "Lần", dataIndex: "attempt_num", width: 70 },
    {
      title: "Điểm",
      render: (row) => `${row.score}/${row.max_score}`,
      width: 120,
    },
    {
      title: "Trạng thái",
      render: (row) =>
        row.is_passed ? (
          <Tag color="green">Đạt</Tag>
        ) : (
          <Tag color="red">Chưa đạt</Tag>
        ),
      width: 120,
    },
    { title: "Thời gian nộp", dataIndex: "submitted_at" },
  ];

  const handleStart = () => {
    navigate(`/assignment/${id}/start`);
  };

  if (loading) return <Spin size="large" />;

  if (!assignment)
    return <Alert message="Không tìm thấy bài tập" type="error" />;

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "none",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Title level={3}>{assignment.title}</Title>
        <Paragraph>{assignment.description}</Paragraph>

        <Space>
          <Tag color="blue">Lượt làm tối đa: {assignment.max_attempts}</Tag>
          <Tag color="purple">Còn lại: {attemptsLeft}</Tag>
          {assignment.due_date && (
            <Tag color="orange">
              Hạn nộp: {new Date(assignment.due_date).toLocaleString()}
            </Tag>
          )}
        </Space>

        {/* Hiển thị nút làm bài chỉ khi còn lượt */}
        {attemptsLeft > 0 ? (
          <Button type="primary" onClick={handleStart} style={{ marginTop: 8 }}>
            Làm bài ngay
          </Button>
        ) : (
          <Alert
            message="Bạn đã hết lượt làm bài"
            type="warning"
            showIcon
            style={{ marginTop: 8, borderRadius: 8 }}
          />
        )}

        <Title level={4} style={{ marginTop: 24 }}>
          Lịch sử làm bài
        </Title>

        {submissions.length === 0 ? (
          <Alert
            message="Bạn chưa có lần làm nào."
            type="info"
            showIcon
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Table
            dataSource={submissions}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        )}
      </Space>
    </Card>
  );
};

export default AssignmentDetail;
