import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../../services/api_auth";
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
  const [status, setStatus] = useState("checking"); // 👈 checking | valid | used | expired | invalid
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // =======================
  // Kiểm tra token hợp lệ
  // =======================
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    verifyResetToken(token)
      .then(() => setStatus("valid"))
      .catch((err) => {
        const msg = err?.error?.toLowerCase?.() || "";
        if (msg.includes("hết hạn")) setStatus("expired");
        else if (msg.includes("được sử dụng")) setStatus("used");
        else setStatus("invalid");
      });

    // Decode JWT để tính đếm ngược
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        setStatus("expired");
        return;
      }
      setTimeLeft(Math.floor(decoded.exp - now));
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } catch (err) {
      console.error("JWT Decode error:", err);
      setStatus("invalid");
    }
  }, [token]);

  // =======================
  // Xử lý đổi mật khẩu
  // =======================
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
      setStatus("expired");
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // Giao diện theo trạng thái
  // =======================

  if (status === "checking") {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Đang kiểm tra liên kết đặt lại mật khẩu...
        </Text>
      </div>
    );
  }

  if (status === "expired" || status === "used" || status === "invalid") {
    return (
      <Result
        status="404"
        title="Không khả dụng"
        subTitle="Liên kết này đã được sử dụng hoặc đã hết hạn. Vui lòng yêu cầu gửi lại liên kết mới."
        extra={
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => navigate("/auth/forgot-password")}
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
            }}
          >
            Yêu cầu lại liên kết
          </Button>
        }
      />
    );
  }

  // Giao diện đổi mật khẩu hợp lệ
  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>
          Đặt lại mật khẩu
        </Title>
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

      <Form name="reset-password" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={
            <Text strong style={{ fontSize: 14 }}>
              Mật khẩu mới
            </Text>
          }
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải từ 6 ký tự trở lên" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
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
          name="confirmPassword"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password
            placeholder="Xác nhận mật khẩu"
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
            }}
          >
            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Link
            onClick={() => navigate("/auth/login")}
            style={{
              fontSize: 14,
              fontWeight: 600,
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

export default ResetPassword;
