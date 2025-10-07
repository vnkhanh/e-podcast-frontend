import { Outlet } from "react-router-dom";
import { Layout, Card, Typography } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AuthLayout() {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo hoặc tên hệ thống */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ color: "#1677ff", marginBottom: 0 }}>
              E-Podcast
            </Title>
            <Text type="secondary">Học tập mọi lúc, mọi nơi</Text>
          </div>

          {/* Nội dung động (Login / Register / ForgotPassword) */}
          <Outlet />
        </Card>
      </Content>
    </Layout>
  );
}
