import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
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
        <Title level={3}>Đăng ký tài khoản</Title>
        <Text type="secondary">Tạo tài khoản để bắt đầu học tập</Text>
      </div>

      {/* Form */}
      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

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

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
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
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>

        {/* Link chuyển hướng */}
        <div style={{ textAlign: "center" }}>
          <Text>Đã có tài khoản? </Text>
          <Link onClick={() => navigate("/auth/login")}>Đăng nhập</Link>
        </div>
      </Form>
    </>
  );
};

export default Register;
