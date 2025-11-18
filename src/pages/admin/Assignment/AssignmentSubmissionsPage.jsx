import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Spin,
  Alert,
  Card,
  Typography,
  Descriptions,
  Row,
  Select,
  Input,
  Col,
  Button,
  Divider,
  Statistic,
  Space,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAssignmentSubmissions,
  fetchAssignmentDetail,
} from "../../../services/api_assignment";
import dayjs from "dayjs";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  NumberOutlined,
  TeamOutlined,
  ExportOutlined,
} from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const AssignmentSubmissionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // passed | failed | ""
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadAssignment() {
      try {
        setLoading(true);
        const res = await fetchAssignmentDetail(id);
        setAssignment(res?.assignment || res?.data?.assignment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAssignment();
  }, [id]);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        // chỉ bật loading nếu KHÔNG phải search hoặc filter
        if (!search && !status) {
          setLoading(true);
        }

        const res = await fetchAssignmentSubmissions(id, {
          search,
          status,
          page,
          limit,
        });

        const submissionsData =
          res?.submissions || res?.data?.submissions || [];

        setSubmissions(submissionsData);
        setTotal(res.total || res.data?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [id, search, status, page, limit]);

  const handleExportSubmissions = () => {
    // Logic export submissions
    console.log("Export submissions data");
  };

  const columns = [
    {
      title: "Người nộp",
      dataIndex: ["user", "full_name"],
      key: "user",
      sorter: (a, b) => (a.score ?? 0) - (b.score ?? 0),
      render: (text) => (
        <Space>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (text) => <Space>{text}</Space>,
    },
    {
      title: "Lần nộp",
      dataIndex: "attempt_num",
      key: "attempt_num",
      width: 100,
      align: "center",
      render: (text) => (
        <Tag style={{ margin: 0, minWidth: 50 }}>
          <NumberOutlined style={{ marginRight: 4 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: "Điểm số",
      key: "score",
      width: 120,
      sorter: (a, b) => (a.score ?? 0) - (b.score ?? 0),
      align: "center",
      render: (_, row) => (
        <div>
          <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
            {row.score ?? 0}
          </Text>
          <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
            /{row.max_score ?? 0}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      align: "center",
      render: (row) =>
        row.is_passed ? (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            style={{ margin: 0, border: "none" }}
          >
            Đạt
          </Tag>
        ) : (
          <Tag
            icon={<CloseCircleOutlined />}
            color="error"
            style={{ margin: 0, border: "none" }}
          >
            Chưa đạt
          </Tag>
        ),
    },
    {
      title: "Thời gian nộp",
      dataIndex: "submitted_at",
      sorter: (a, b) => (a.score ?? 0) - (b.score ?? 0),
      key: "submitted_at",
      width: 180,
      render: (value) => (
        <Space>
          <CalendarOutlined style={{ color: "#8c8c8c" }} />
          <Text type="secondary">
            {value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/submissions/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ padding: 0 }}
          >
            Quay lại
          </Button>
          <Divider type="vertical" />
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExportSubmissions}
          >
            Xuất báo cáo
          </Button>
        </Space>
      </div>

      {/* Thông tin assignment */}
      {assignment && (
        <Card
          variant="borderless"
          style={{
            marginBottom: 24,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
          }}
          styles={{ body: { padding: 24 } }}
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={2} style={{ margin: 0 }}>
              {assignment.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {assignment.description || "Không có mô tả"}
            </Text>
          </div>

          <Row gutter={[32, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Số lần làm tối đa"
                value={assignment.max_attempts ?? 0}
                prefix={<NumberOutlined />}
                valueStyle={{ fontSize: 24 }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Điểm đạt"
                value={assignment.pass_score ?? 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ fontSize: 24 }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Bài đã nộp"
                value={submissions.length}
                prefix={<TeamOutlined />}
                valueStyle={{ fontSize: 24 }}
              />
            </Col>
          </Row>

          <Divider style={{ margin: "16px 0" }} />

          <Descriptions
            column={{ xs: 1, sm: 2, md: 3 }}
            size="middle"
            style={{ marginBottom: 16 }}
          >
            <Descriptions.Item label="Podcast">
              <Text strong>{assignment.podcast?.title || "-"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Chương">
              {assignment.podcast?.Chapter?.title || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Môn học">
              {assignment.podcast?.Chapter?.Subject?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <CalendarOutlined />
                  Hạn nộp
                </Space>
              }
            >
              <Text
                type={
                  dayjs(assignment.due_date).isBefore(dayjs())
                    ? "danger"
                    : "secondary"
                }
              >
                {assignment.due_date
                  ? dayjs(assignment.due_date).format("DD/MM/YYYY HH:mm")
                  : "Không có hạn"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined />
                  Giới hạn thời gian
                </Space>
              }
            >
              {assignment.time_limit > 0
                ? `${assignment.time_limit} phút`
                : "Không giới hạn"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={assignment.is_published ? "green" : "orange"}
                style={{ margin: 0 }}
              >
                {assignment.is_published ? "Đã công bố" : "Chưa công bố"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Danh sách bài nộp */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>Danh sách bài nộp</span>
            <Tag style={{ margin: 0 }}>{submissions.length}</Tag>
          </Space>
        }
        variant="borderless"
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: 16 }}>
          <Space size="large">
            <Search
              placeholder="Tìm theo tên người nộp"
              enterButton
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => setPage(1)}
              style={{ width: 260 }}
            />

            <Select
              value={status}
              onChange={(value) => {
                setPage(1);
                setStatus(value);
              }}
              style={{ width: 180 }}
              allowClear
              placeholder="Tất cả"
            >
              <Option value="">Tất cả</Option>
              <Option value="passed">Đạt</Option>
              <Option value="failed">Chưa đạt</Option>
            </Select>
          </Space>
        </div>

        {submissions.length === 0 ? (
          <div style={{ padding: 40 }}>
            <Alert
              message="Chưa có bài nộp nào"
              description="Hiện tại chưa có học viên nào nộp bài cho assignment này."
              type="info"
              showIcon
            />
          </div>
        ) : (
          <Table
            dataSource={submissions}
            columns={columns}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: total,
              showSizeChanger: true,
              onChange: (p, pageSize) => {
                setPage(p);
                setLimit(pageSize);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} bài nộp`,
              style: { marginRight: 24 },
            }}
            scroll={{ x: 1000 }}
            style={{ border: "none" }}
          />
        )}
      </Card>
    </div>
  );
};

export default AssignmentSubmissionsPage;
