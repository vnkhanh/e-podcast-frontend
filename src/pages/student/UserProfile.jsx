import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Avatar,
  Badge,
  Divider,
  Row,
  Col,
  Space,
  Tag,
  Tabs,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserListeningHistory from "./UserListeningHistory";
import { getUserProfile } from "../../services/api_auth";
import UserFavorites from "../../components/user/UserFavorites";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getUserProfile(token);
        setUser(res.user);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" tip="Đang tải thông tin người dùng..." />
      </div>
    );

  if (error)
    return (
      <div style={{ maxWidth: 800, margin: "60px auto" }}>
        <Alert type="error" message="Lỗi tải dữ liệu" description={error} />
      </div>
    );

  if (!user) return null;

  const roleColor = {
    admin: "#ff4d4f",
    teacher: "#1890ff",
    student: "#52c41a",
    user: "#764ba2",
  };

  const roleIcons = {
    admin: <SafetyCertificateOutlined />,
    teacher: <TeamOutlined />,
    student: <UserOutlined />,
    user: <UserOutlined />,
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      {/* Thông tin người dùng */}
      <Card
        style={{
          border: "none",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          marginBottom: 32,
        }}
      >
        {/* Banner */}
        <div
          style={{
            height: 180,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "relative",
          }}
        >
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={user.avatar_url}
            style={{
              position: "absolute",
              bottom: -50,
              left: 40,
              border: "4px solid white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          />
        </div>

        {/* Info section */}
        <div style={{ marginTop: 70, padding: "0 24px 24px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ marginBottom: 0 }}>
                {user.full_name}
              </Title>
              <Badge
                color={roleColor[user.role]}
                text={
                  <Space>
                    {roleIcons[user.role]}
                    <Text
                      strong
                      style={{
                        textTransform: "capitalize",
                        color: roleColor[user.role],
                      }}
                    >
                      {user.role}
                    </Text>
                  </Space>
                }
              />
            </Col>
            <Col>
              <Tag
                color={user.status ? "success" : "error"}
                style={{
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                {user.status ? "Đã kích hoạt" : "Tạm khóa"}
              </Tag>
            </Col>
          </Row>

          <Divider style={{ margin: "20px 0" }} />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Space align="start">
                <MailOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Email
                  </Text>
                  <br />
                  <Text strong>{user.email}</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space align="start">
                <CalendarOutlined style={{ color: "#fa8c16", fontSize: 16 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tham gia từ
                  </Text>
                  <br />
                  <Text strong>
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space align="start">
                <SafetyCertificateOutlined
                  style={{ color: "#52c41a", fontSize: 16 }}
                />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Bảo mật
                  </Text>
                  <br />
                  <Text strong>Mức cao</Text>
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Tabs hoạt động người dùng */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "none",
        }}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <Space>
                  <HeartOutlined style={{ color: "#eb2f96" }} />
                  <Text strong>Podcast yêu thích</Text>
                </Space>
              ),
              children: <UserFavorites />,
            },
            {
              key: "2",
              label: (
                <Space>
                  <BookOutlined style={{ color: "#667eea" }} />
                  <Text strong>Lịch sử nghe</Text>
                </Space>
              ),
              children: <UserListeningHistory />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
