import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
// 👉 sau này bạn có thể viết API forgotPassword trong services/api.js
// import { forgotPassword } from "../../services/api";

const { Title, Text, Link } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // gọi API quên mật khẩu ở đây
      // const data = await forgotPassword(values.email);
      // if (data?.success) {
      //   message.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      //   navigate("/auth/login");
      // } else {
      //   message.error(data?.error || "Yêu cầu thất bại!");
      // }

      // 👉 Tạm thời mock kết quả
      setTimeout(() => {
        message.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
        navigate("/auth/login");
      }, 1000);
    } catch (err) {
      message.error("Có lỗi xảy ra!");
      console.error("ForgotPassword error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
    </>
  );
};

export default ForgotPassword;
