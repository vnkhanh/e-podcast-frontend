import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Alert, Card, Typography } from "antd";
import { useParams } from "react-router-dom";
import { fetchAssignmentSubmissions } from "../../../services/api_assignment";
import dayjs from "dayjs";

const { Title } = Typography;

const AssignmentSubmissionsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchAssignmentSubmissions(id);
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const columns = [
    { title: "Người nộp", dataIndex: ["user", "full_name"], key: "user" },
    { title: "Email", dataIndex: ["user", "email"], key: "email" },
    { title: "Lần", dataIndex: "attempt_num", key: "attempt_num", width: 70 },
    {
      title: "Điểm",
      render: (row) => `${row.score}/${row.max_score}`,
      key: "score",
      width: 100,
    },
    {
      title: "Trạng thái",
      render: (row) =>
        row.is_passed ? (
          <Tag color="green">Đạt</Tag>
        ) : (
          <Tag color="red">Chưa đạt</Tag>
        ),
      key: "status",
      width: 120,
    },
    {
      title: "Thời gian nộp",
      dataIndex: "submitted_at",
      key: "submitted_at",
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
    },
  ];

  if (loading) return <Spin size="large" />;

  if (!submissions.length)
    return <Alert message="Chưa có bài nộp nào" type="info" showIcon />;

  return (
    <Card>
      <Title level={3}>Danh sách bài nộp</Title>
      <Table
        dataSource={submissions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default AssignmentSubmissionsPage;
