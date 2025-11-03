import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, Spin, message, Row, Col, Tag } from "antd";
import { UserOutlined, MailOutlined, CrownOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.warning("Vui lòng đăng nhập để truy cập trang quản trị!");
        window.location.href = "/auth/login";
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data.user);
      } catch (err) {
        console.error("Lỗi lấy thông tin admin:", err);
        message.error(
          err.response?.data?.error || "Không thể tải thông tin quản trị viên!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải thông tin quản trị viên..." />
      </div>
    );

  if (!admin)
    return (
      <div className="text-center mt-20">
        <Text type="secondary">
          Không tìm thấy thông tin tài khoản quản trị.
        </Text>
      </div>
    );

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <Card
        title="Thông tin Quản trị viên"
        style={{
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <Row gutter={24} align="middle">
          <Col span={6} style={{ textAlign: "center" }}>
            <Avatar
              size={120}
              src={admin.avatar_url}
              icon={<UserOutlined />}
              style={{
                border: "2px solid #1890ff",
                background: "#f0f2f5",
              }}
            />
            <Tag
              color={admin.status ? "green" : "red"}
              style={{ marginTop: 10 }}
            >
              {admin.status ? "Đang hoạt động" : "Tạm khóa"}
            </Tag>
          </Col>

          <Col span={18}>
            <Title level={4} style={{ marginBottom: 8 }}>
              {admin.full_name || "Chưa cập nhật tên"}
            </Title>
            <p>
              <MailOutlined /> <b>Email:</b> {admin.email}
            </p>
            <p>
              <CrownOutlined /> <b>Vai trò:</b>{" "}
              <Tag color="gold">{admin.role?.toUpperCase()}</Tag>
            </p>
            <p>
              <b>Ngày tạo tài khoản:</b>{" "}
              {new Date(admin.created_at).toLocaleString("vi-VN")}
            </p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminProfile;
