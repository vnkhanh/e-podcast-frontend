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
  BarChartOutlined,
  LineChartOutlined,
  TableOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
import {
  getOverviewStats,
  getDailyListens,
  getMonthlyListens,
  getNewUsers,
  getSubjectBreakdown,
} from "../../services/api_dashboard";
const { Title } = Typography;

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [dailyListens, setDailyListens] = useState([]);
  const [monthlyListens, setMonthlyListens] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [ov, daily, monthly, users, subjects] = await Promise.all([
          getOverviewStats(),
          getDailyListens(
            dateRange[0].format("YYYY-MM-DD"),
            dateRange[1].format("YYYY-MM-DD")
          ),
          getMonthlyListens(),
          getNewUsers(),
          getSubjectBreakdown(),
        ]);

        setOverview(ov || {});
        setDailyListens(daily || []);
        setMonthlyListens(monthly || []);
        setNewUsers(users || []);
        setSubjectData(subjects || []);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [dateRange]);

  const handleDateRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    }
  };

  const handleFilterClick = async () => {
    try {
      const from = dateRange[0].format("YYYY-MM-DD");
      const to = dateRange[1].format("YYYY-MM-DD");
      const data = await getDailyListens(from, to);
      setDailyListens(data || []);
      message.success("Đã cập nhật dữ liệu");
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  const COLORS = [
    "#70a7dbff",
    "#5cccccff",
    "#e7bb64ff",
    "#e06369ff",
    "#a470ecff",
    "#81da55ff",
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
            <span>
              <LineChartOutlined /> Lượt nghe theo ngày
            </span>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
            />
            <Button type="primary" onClick={handleFilterClick}>
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
                tickFormatter={(d) => dayjs(d).format("DD/MM")}
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
      <Card
        title={
          <Space>
            <LineChartOutlined />
            <span>Lượt nghe theo tháng</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
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
      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>Người dùng mới (30 ngày)</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {newUsers?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newUsers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => dayjs(d).format("DD/MM")}
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
      <Card
        title={
          <Space>
            <TableOutlined />
            <span>Top Podcast</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          dataSource={overview?.top_podcasts || []}
          columns={columns}
          rowKey="podcast_id"
          pagination={false}
        />
      </Card>

      {/* Phân bố theo môn học */}
      <Card
        title={
          <Space>
            <PieChartOutlined />
            <span>Phân bố lượt nghe theo môn học (lượt nghe)</span>
          </Space>
        }
      >
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
