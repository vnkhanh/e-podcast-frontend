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
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  FileTextOutlined,
  HeartOutlined,
  EditOutlined,
  BookOutlined,
} from "@ant-design/icons";
import UserListeningHistory from "./UserListeningHistory";
import { getUserProfile } from "../../services/api_auth";
const { Title, Text } = Typography;

// Component UserProfile chính
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "50px auto" }}>
        <Alert type="error" message="Lỗi" description={error} />
      </div>
    );
  }

  if (!user) return null;

  // Badge màu theo role
  const roleColor = {
    admin: "red",
    teacher: "blue",
    student: "green",
    user: "purple",
  };

  const roleIcons = {
    admin: <SafetyCertificateOutlined />,
    teacher: <TeamOutlined />,
    student: <UserOutlined />,
    user: <UserOutlined />,
  };

  const stats = [
    {
      icon: <FileTextOutlined />,
      label: "Tài liệu",
      value: user.documents?.length || 0,
      color: "#1890ff",
    },
    {
      icon: <HeartOutlined />,
      label: "Yêu thích",
      value: user.favorites?.length || 0,
      color: "#eb2f96",
    },
    {
      icon: <EditOutlined />,
      label: "Ghi chú",
      value: user.notes?.length || 0,
      color: "#52c41a",
    },
    {
      icon: <BookOutlined />,
      label: "Flashcards",
      value: user.flashcards?.length || 0,
      color: "#fa8c16",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
      <Row gutter={[24, 24]}>
        {/* Cột thông tin user */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              border: "none",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              />
              <div style={{ marginLeft: 20, flex: 1 }}>
                <Title level={2} style={{ margin: 0, color: "#1a1a1a" }}>
                  {user.full_name}
                </Title>
                <Badge
                  color={roleColor[user.role] || "blue"}
                  text={
                    <Space style={{ marginTop: 4 }}>
                      {roleIcons[user.role]}
                      <Text strong style={{ textTransform: "capitalize" }}>
                        {user.role}
                      </Text>
                    </Space>
                  }
                />
              </div>
            </div>

            <Divider style={{ margin: "20px 0" }} />

            {/* Thông tin cá nhân */}
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MailOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Email
                  </Text>
                  <br />
                  <Text strong>{user.email}</Text>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <SafetyCertificateOutlined
                  style={{ color: "#52c41a", fontSize: 16 }}
                />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Trạng thái
                  </Text>
                  <br />
                  <Tag color={user.status ? "success" : "error"}>
                    {user.status ? "Đã kích hoạt" : "Tạm khóa"}
                  </Tag>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CalendarOutlined style={{ color: "#fa8c16", fontSize: 16 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tham gia từ
                  </Text>
                  <br />
                  <Text strong>
                    {new Date(user.created_at).toLocaleDateString("vi-VI")}
                  </Text>
                </div>
              </div>
            </Space>

            <Divider style={{ margin: "24px 0" }} />

            {/* Thống kê */}
            <Title level={5} style={{ marginBottom: 16 }}>
              Thống kê hoạt động
            </Title>
            <Row gutter={[16, 16]}>
              {stats.map((stat, index) => (
                <Col xs={12} key={index}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: 8,
                      textAlign: "center",
                      border: `1px solid ${stat.color}20`,
                    }}
                  >
                    <div
                      style={{
                        color: stat.color,
                        fontSize: 20,
                        marginBottom: 4,
                      }}
                    >
                      {stat.icon}
                    </div>
                    <Text strong style={{ fontSize: 18, color: stat.color }}>
                      {stat.value}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {stat.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Cột lịch sử nghe */}
        <Col xs={24} lg={12}>
          <UserListeningHistory />
        </Col>
      </Row>
    </div>
  );
}
