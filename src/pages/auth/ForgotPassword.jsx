import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/api_auth";

const { Title, Text, Link } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      // Hiển thị thông báo chung từ backend
      message.success(
        data?.message || "Vui lòng kiểm tra email để đặt lại mật khẩu."
      );
      navigate("/auth/login");
    } catch (err) {
      // Hiển thị lỗi nếu có
      message.error(err?.error || "Có lỗi xảy ra!");
      console.error("ForgotPassword error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      {/* Tiêu đề */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Space direction="vertical" size={8}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            Quên mật khẩu
          </Title>
          <Text type="secondary">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </Text>
        </Space>
      </div>

      {/* Form */}
      <Form
        name="forgot-password"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={
            <Text strong style={{ fontSize: 14 }}>
              Email
            </Text>
          }
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            placeholder="Nhập email"
            size="large"
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 16,
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: 12,
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 16px rgba(102, 126, 234, 0.3)";
            }}
          >
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Link
            onClick={() => navigate("/auth/login")}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#667eea",
            }}
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
