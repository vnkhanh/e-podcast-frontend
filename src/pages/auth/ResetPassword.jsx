import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/api_auth";
import { jwtDecode } from "jwt-decode";

const { Title, Text, Link } = Typography;

// Hàm format giây -> MM:SS
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      message.error("Token không hợp lệ!");
      navigate("/auth/forgot-password");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        message.error(
          "Token đã hết hạn, vui lòng gửi yêu cầu quên mật khẩu mới."
        );
        navigate("/auth/forgot-password");
        return;
      }

      setTimeLeft(Math.floor(decoded.exp - now));

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            message.error(
              "Token đã hết hạn, vui lòng gửi yêu cầu quên mật khẩu mới."
            );
            navigate("/auth/forgot-password");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } catch (err) {
      message.error("Token không hợp lệ!");
      console.error("JWT Decode error:", err);
      navigate("/auth/forgot-password");
    }
  }, [token, navigate]);

  const onFinish = async ({ newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, newPassword);
      message.success(data?.message || "Đổi mật khẩu thành công!");
      navigate("/auth/login");
    } catch (err) {
      message.error(err?.error || "Token đã hết hạn hoặc có lỗi xảy ra!");
      navigate("/auth/forgot-password");
      console.error("ResetPassword error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3}>Đặt lại mật khẩu</Title>
        <Text type="secondary">Nhập mật khẩu mới cho tài khoản của bạn.</Text>
        {timeLeft !== null && timeLeft > 0 && (
          <Text
            type="warning"
            style={{ display: "block", marginTop: 8, fontWeight: 500 }}
          >
            Token còn hiệu lực: {formatTime(timeLeft)}
          </Text>
        )}
      </div>

      <Form
        name="reset-password"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải từ 6 ký tự trở lên" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            disabled={timeLeft === 0}
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password
            placeholder="Xác nhận mật khẩu"
            disabled={timeLeft === 0}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={timeLeft === 0}
          >
            Đổi mật khẩu
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

export default ResetPassword;
