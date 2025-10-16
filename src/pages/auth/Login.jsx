import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { login } from "../../services/api_auth";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await login(values.email, values.password);
      if (data?.token) {
        message.success("Đăng nhập thành công!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const role = data.user.role?.toLowerCase();
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "teacher") {
          navigate("/teacher"); // sửa lại
        } else {
          navigate("/dashboard"); // student
        }
      } else {
        message.error(data?.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      message.error("Có lỗi xảy ra!");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tiêu đề */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3}>Đăng nhập</Title>
      </div>

      {/* Form */}
      <Form
        name="login"
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

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        {/* Quên mật khẩu */}
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Link onClick={() => navigate("/auth/forgot-password")}>
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>

        {/* Đăng ký */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Text>Chưa có tài khoản? </Text>
          <Link onClick={() => navigate("/auth/register")}>Đăng ký</Link>
        </div>

        {/* Google Login */}
        <GoogleLoginButton />
      </Form>
    </>
  );
};

export default Login;
