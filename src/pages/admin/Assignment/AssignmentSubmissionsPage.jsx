import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Typography,
  message,
  Row,
  Col,
  Card,
  Statistic,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAssignmentSubmissions,
  fetchAssignmentDetail,
  exportAssignmentSubmissions,
} from "../../../services/api_assignment";

const { Title, Text } = Typography;
const { Option } = Select;

const AssignmentSubmissionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Statistics
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    passed: 0,
    failed: 0,
    avgScore: 0,
  });

  useEffect(() => {
    loadAssignmentDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, search, statusFilter, page, limit]);

  const loadAssignmentDetail = async () => {
    try {
      const res = await fetchAssignmentDetail(id);
      setAssignment(res.assignment);
    } catch (err) {
      message.error("Không thể tải thông tin bài tập");
      console.error(err);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetchAssignmentSubmissions(id, {
        search,
        status: statusFilter,
        page,
        limit,
      });

      setSubmissions(res.submissions || []);
      setTotal(res.total || 0);

      // Calculate statistics
      const totalSubs = res.submissions?.length || 0;
      const passedCount =
        res.submissions?.filter((s) => s.is_passed).length || 0;
      const failedCount = totalSubs - passedCount;
      const avgScore =
        totalSubs > 0
          ? res.submissions.reduce((sum, s) => sum + s.score, 0) / totalSubs
          : 0;

      setStats({
        totalSubmissions: totalSubs,
        passed: passedCount,
        failed: failedCount,
        avgScore: avgScore.toFixed(2),
      });
    } catch (err) {
      message.error("Không thể tải danh sách bài nộp");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // EXPORT EXCEL
  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      await exportAssignmentSubmissions(id);
      message.success("Xuất file Excel thành công!");
    } catch (err) {
      message.error("Không thể xuất file Excel");
      console.error(err);
    } finally {
      setExportLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Sinh viên",
      key: "user",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.user?.full_name || "N/A"}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.user?.email || "N/A"}
          </Text>
        </div>
      ),
    },
    {
      title: "Lần làm",
      dataIndex: "attempt_num",
      key: "attempt_num",
      width: 100,
      align: "center",
    },
    {
      title: "Điểm",
      key: "score",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div>
          <Text
            strong
            style={{
              color: record.is_passed ? "#52c41a" : "#ff4d4f",
              fontSize: 16,
            }}
          >
            {record.score?.toFixed(2) || 0}
          </Text>
          <Text type="secondary"> / {record.max_score || 10}</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "is_passed",
      width: 120,
      align: "center",
      render: (_, record) =>
        record.is_passed ? (
          <Tag color="success">Đạt</Tag>
        ) : (
          <Tag color="error">Chưa đạt</Tag>
        ),
    },
    {
      title: "Thời gian nộp",
      dataIndex: "submitted_at",
      key: "submitted_at",
      width: 180,
      render: (date) =>
        date ? new Date(date).toLocaleString("vi-VN") : "Chưa nộp",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/teacher/submissions/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  if (!assignment) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space direction="vertical" size={0}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              type="text"
            >
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Danh sách bài nộp
            </Title>
            <Text type="secondary">{assignment.title}</Text>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            loading={exportLoading}
            size="large"
            style={{
              background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              border: "none",
            }}
          >
            Xuất Excel
          </Button>
        </Col>
      </Row>

      {/* Assignment Details Card */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
        }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Tiêu đề bài tập</Text>
              <Title level={4} style={{ margin: 0 }}>
                {assignment.title}
              </Title>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Mô tả</Text>
              <Text>{assignment.description || "Không có mô tả"}</Text>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Số lượt làm tối đa</Text>
              <Text strong>{assignment.max_attempts} lượt</Text>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Thời gian làm bài</Text>
              <Text strong>
                {assignment.time_limit > 0
                  ? `${assignment.time_limit} phút`
                  : "Không giới hạn"}
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Điểm đạt</Text>
              <Text strong style={{ color: "#52c41a" }}>
                {assignment.pass_score} / 10
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Hạn nộp</Text>
              <Text strong>
                {assignment.due_date
                  ? new Date(assignment.due_date).toLocaleString("vi-VN")
                  : "Không có hạn"}
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Trạng thái</Text>
              <Space>
                <Tag color={assignment.is_published ? "success" : "warning"}>
                  {assignment.is_published ? "Đã công bố" : "Bản nháp"}
                </Tag>
                {assignment.has_password && (
                  <Tag icon={<LockOutlined />} color="orange">
                    Có mật khẩu
                  </Tag>
                )}
                <Tag color={assignment.allow_review ? "blue" : "default"}>
                  {assignment.allow_review
                    ? "Cho phép xem đáp án"
                    : "Không cho xem đáp án"}
                </Tag>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={8}>
              <Text type="secondary">Podcast liên kết</Text>
              <Text strong>{assignment.podcast?.title || "N/A"}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số bài nộp"
              value={stats.totalSubmissions}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số bài đạt"
              value={stats.passed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số bài không đạt"
              value={stats.failed}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Điểm trung bình"
              value={stats.avgScore}
              suffix="/ 10"
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Tìm theo tên sinh viên..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "")}
          >
            <Option value="passed">Đạt</Option>
            <Option value="failed">Chưa đạt</Option>
          </Select>
        </Col>
      </Row>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={submissions}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bài nộp`,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
    </div>
  );
};

export default AssignmentSubmissionsPage;
