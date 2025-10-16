import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
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
        <Title level={3}>Quên mật khẩu</Title>
        <Text type="secondary">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </Text>
      </div>

      {/* Form */}
      <Form
        name="forgot-password"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Gửi yêu cầu
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Link onClick={() => navigate("/auth/login")}>
            Quay lại đăng nhập
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
