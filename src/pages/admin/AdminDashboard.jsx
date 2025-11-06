import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Spin,
  DatePicker,
  Button,
  Space,
  Table,
  message,
} from "antd";
import {
  UserOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [dailyListens, setDailyListens] = useState([]);
  const [monthlyListens, setMonthlyListens] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().subtract(7, "days"),
    moment(),
  ]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const init = async () => {
      try {
        const [ov, daily, monthly, users, subjects] = await Promise.all([
          axios.get(`${API}/admin/stats/overview`, { headers }),
          axios.get(
            `${API}/admin/stats/daily-listens?from=${dateRange[0].format(
              "YYYY-MM-DD"
            )}&to=${dateRange[1].format("YYYY-MM-DD")}`,
            { headers }
          ),
          axios.get(
            `${API}/admin/stats/monthly-listens?year=${new Date().getFullYear()}`,
            { headers }
          ),
          axios.get(`${API}/admin/stats/new-users?days=30`, { headers }),
          axios.get(`${API}/admin/stats/subject-breakdown`, { headers }),
        ]);

        setOverview(ov.data || {});
        setDailyListens(daily.data || []);
        setMonthlyListens(monthly.data || []);
        setNewUsers(users.data || []);
        setSubjectData(subjects.data || []);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  const COLORS = [
    "#1890ff",
    "#13c2c2",
    "#faad14",
    "#f5222d",
    "#722ed1",
    "#52c41a",
  ];

  const columns = [
    { title: "Tên Podcast", dataIndex: "title", key: "title" },
    { title: "Lượt nghe", dataIndex: "total_plays", key: "total_plays" },
    { title: "Lượt thích", dataIndex: "like_count", key: "like_count" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Bảng điều khiển</Title>

      {/* Tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={overview.total_users || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Podcast"
              value={overview.total_podcasts || 0}
              prefix={<CustomerServiceOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt nghe (30 ngày)"
              value={overview.total_listens_30d || 0}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={Number(overview.completion_rate || 0).toFixed(1)}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Lượt nghe theo ngày */}
      <Card
        title={
          <Space>
            <span>Lượt nghe theo ngày</span>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
            />
            <Button
              type="primary"
              onClick={async () => {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const from = dateRange[0].format("YYYY-MM-DD");
                const to = dateRange[1].format("YYYY-MM-DD");
                const resp = await axios.get(
                  `${API}/admin/stats/daily-listens?from=${from}&to=${to}`,
                  { headers }
                );
                setDailyListens(resp.data || []);
              }}
            >
              Lọc
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {dailyListens?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyListens || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => moment(d).format("DD/MM")}
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#52c41a" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>Không có dữ liệu</p>
        )}
      </Card>

      {/* Lượt nghe theo tháng */}
      <Card title="Lượt nghe theo tháng" style={{ marginBottom: 24 }}>
        {monthlyListens?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyListens || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#1890ff" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>Không có dữ liệu</p>
        )}
      </Card>

      {/* Người dùng mới */}
      <Card title="Người dùng mới (30 ngày)" style={{ marginBottom: 24 }}>
        {newUsers?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newUsers || []}>
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
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>Không có dữ liệu</p>
        )}
      </Card>

      {/* Top podcast */}
      <Card title="Top Podcast" style={{ marginBottom: 24 }}>
        <Table
          dataSource={overview?.top_podcasts || []}
          columns={columns}
          rowKey="podcast_id"
          pagination={false}
        />
      </Card>

      {/* Phân bố theo môn học */}
      <Card title="Phân bố lượt nghe theo môn học">
        {subjectData?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData || []}
                dataKey="plays"
                nameKey="subject"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {subjectData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>Không có dữ liệu</p>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
