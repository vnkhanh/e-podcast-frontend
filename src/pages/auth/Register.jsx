import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Space } from "antd";
import { register } from "../../services/api_auth";
import { useNavigate } from "react-router-dom";

const { Title, Text, Link } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gửi request đăng ký
      await register(values.email, values.password, values.full_name);

      // Thành công
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth/login");
    } catch (err) {
      // Lỗi từ backend hoặc network
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      } else {
        message.error("Có lỗi xảy ra!");
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            Đăng ký tài khoản
          </Title>
          <Text type="secondary">Tạo tài khoản để bắt đầu học tập</Text>
        </Space>
      </div>

      {/* Form */}
      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={
            <Text strong style={{ fontSize: 14 }}>
              Họ tên
            </Text>
          }
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input
            placeholder="Nhập họ tên"
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 16,
            }}
          />
        </Form.Item>

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
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 16,
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <Text strong style={{ fontSize: 14 }}>
              Mật khẩu
            </Text>
          }
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 16,
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <Text strong style={{ fontSize: 14 }}>
              Xác nhận mật khẩu
            </Text>
          }
          name="confirm_password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu"
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
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </Form.Item>

        {/* Link chuyển hướng */}
        <div style={{ textAlign: "center" }}>
          <Text>Đã có tài khoản? </Text>
          <Link
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#667eea",
            }}
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </Link>
        </div>
      </Form>
    </>
  );
};

export default Register;
