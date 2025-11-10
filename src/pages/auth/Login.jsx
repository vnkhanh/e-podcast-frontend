import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Modal,
  Space,
  Divider,
  Card,
} from "antd";
import { login } from "../../services/api_auth";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  RocketOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await login(values.email, values.password);

      if (data?.token) {
        message.success("Đăng nhập thành công!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);
        const role = data.user.role?.toLowerCase();

        // Hiển thị thông báo chuyển hướng
        message.loading({
          content: `Đang chuyển hướng đến ${
            role === "admin"
              ? "trang quản trị"
              : role === "teacher"
              ? "trang giảng viên"
              : "trang chủ"
          }...`,
          key: "redirect",
          duration: 1.5,
        });

        setTimeout(() => {
          if (role === "admin") navigate("/admin");
          else if (role === "teacher") navigate("/teacher");
          else navigate("/");
        }, 1500);
      } else {
        const errMsg = data?.error || data?.message || "Đăng nhập thất bại!";

        if (
          errMsg.toLowerCase().includes("tạm khóa") ||
          errMsg.toLowerCase().includes("vô hiệu")
        ) {
          Modal.error({
            title: "Tài khoản bị vô hiệu hóa",
            content: (
              <div style={{ padding: "8px 0" }}>
                <Text>{errMsg}</Text>
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    Vui lòng liên hệ quản trị viên để được hỗ trợ.
                  </Text>
                </div>
              </div>
            ),
            centered: true,
            okButtonProps: {
              style: {
                background: "#ff4d4f",
                border: "none",
                borderRadius: 8,
              },
            },
          });
        } else {
          message.error({
            content: (
              <Space>
                <span style={{ color: "#ff4d4f" }}>❌</span>
                {errMsg}
              </Space>
            ),
            duration: 3,
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error({
        content: (
          <Space>
            <span style={{ color: "#ff4d4f" }}>🌐</span>
            Không thể kết nối đến máy chủ!
          </Space>
        ),
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 8 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Space direction="vertical" size={8}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            Đăng nhập
          </Title>
          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
        </Space>
      </div>

      {/* Login Form */}
      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Email Field */}
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
            placeholder="Nhập địa chỉ email của bạn"
            prefix={<MailOutlined style={{ color: "#667eea" }} />}
            size="large"
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 16,
            }}
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label={
            <Text strong style={{ fontSize: 14 }}>
              Mật khẩu
            </Text>
          }
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu của bạn"
            prefix={<LockOutlined style={{ color: "#667eea" }} />}
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 16,
            }}
          />
        </Form.Item>

        {/* Forgot Password */}
        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <Link
            onClick={() => navigate("/auth/forgot-password")}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#667eea",
            }}
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login Button */}
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
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>

      {/* Divider */}
      <Divider style={{ margin: "24px 0", color: "#d9d9d9" }}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Hoặc tiếp tục với
        </Text>
      </Divider>

      {/* Google Login */}
      <div style={{ marginBottom: 24 }}>
        <GoogleLoginButton />
      </div>

      {/* Register Link */}
      <div
        style={{
          textAlign: "center",
          padding: "16px",
          borderRadius: 12,
        }}
      >
        <Space>
          <Text style={{ fontSize: 14, color: "#666" }}>
            Chưa có tài khoản?
          </Text>
          <Link
            onClick={() => navigate("/auth/register")}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#667eea",
            }}
          >
            Đăng ký ngay
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default Login;
