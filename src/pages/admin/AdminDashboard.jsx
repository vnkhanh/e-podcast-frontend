import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Space,
  Divider,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";

const { Title } = Typography;

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [monthlyListens, setMonthlyListens] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // hoặc jwtToken, tùy backend bạn đặt

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [ov, ml, nu, sb] = await Promise.all([
          axios.get(`${API_BASE}/admin/stats/overview`, { headers }),
          axios.get(
            `${API_BASE}/admin/stats/monthly-listens?year=${new Date().getFullYear()}`,
            { headers }
          ),
          axios.get(`${API_BASE}/admin/stats/new-users?days=30`, {
            headers,
          }),
          axios.get(`${API_BASE}/admin/stats/subject-breakdown`, {
            headers,
          }),
        ]);

        setOverview(ov.data);
        setMonthlyListens(ml.data);
        setNewUsers(nu.data);
        setSubjectData(sb.data);
      } catch (err) {
        message.error("Lỗi tải dữ liệu thống kê");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  const COLORS = [
    "#1890ff",
    "#13c2c2",
    "#faad14",
    "#f5222d",
    "#722ed1",
    "#52c41a",
  ];

  const columns = [
    {
      title: "Tên Podcast",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Lượt nghe",
      dataIndex: "total_plays",
      key: "total_plays",
      sorter: (a, b) => a.total_plays - b.total_plays,
    },
    {
      title: "Lượt thích",
      dataIndex: "like_count",
      key: "like_count",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Bảng điều khiển thống kê</Title>

      {/* Tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Tổng người dùng"
              value={overview?.total_users || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Podcast"
              value={overview?.total_podcasts || 0}
              prefix={<CustomerServiceOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Lượt nghe 30 ngày"
              value={overview?.total_listens_30d || 0}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Tỉ lệ hoàn thành"
              value={overview?.completion_rate?.toFixed(1) || 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Biểu đồ lượt nghe theo tháng */}
      <Card title="Lượt nghe theo tháng" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyListens}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1890ff"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Biểu đồ người dùng mới */}
      <Card title="Người dùng mới 30 ngày qua" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={newUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => moment(d).format("DD/MM")}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#13c2c2" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top podcast */}
      <Card title="Top Podcast" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={overview?.top_podcasts || []}
          pagination={false}
          rowKey="podcast_id"
        />
      </Card>

      {/* Biểu đồ theo môn học */}
      <Card title="Phân bố lượt nghe theo môn học">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={subjectData}
              dataKey="plays"
              nameKey="subject"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {subjectData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminDashboard;
