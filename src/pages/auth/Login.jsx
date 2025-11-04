import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Modal } from "antd";
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

      // Nếu login trả về token -> đăng nhập thành công
      if (data?.token) {
        message.success("Đăng nhập thành công!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);
        const role = data.user.role?.toLowerCase();
        if (role === "admin") navigate("/admin");
        else if (role === "teacher") navigate("/teacher");
        else navigate("/");
      } else {
        // Nếu không có token => là lỗi từ backend
        const errMsg = data?.error || data?.message || "Đăng nhập thất bại!";

        if (
          errMsg.toLowerCase().includes("tạm khóa") ||
          errMsg.toLowerCase().includes("vô hiệu")
        ) {
          Modal.error({
            title: "Tài khoản bị vô hiệu hóa",
            content: errMsg,
            centered: true,
          });
        } else {
          message.error(errMsg);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3}>Đăng nhập</Title>
      </div>

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

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Text>Chưa có tài khoản? </Text>
          <Link onClick={() => navigate("/auth/register")}>Đăng ký</Link>
        </div>

        <GoogleLoginButton />
      </Form>
    </>
  );
};

export default Login;
