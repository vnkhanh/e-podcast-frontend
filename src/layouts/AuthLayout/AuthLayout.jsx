import { Outlet } from "react-router-dom";
import { Layout, Card, Typography, Space, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutlined, RocketOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AuthLayout() {
  const navigate = useNavigate();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorations */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at top right, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at bottom left, rgba(118, 75, 162, 0.2), transparent 50%)",
        }}
      />

      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 440,
            borderRadius: 24,
            // border: "1px solid white",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            position: "relative",
            // backgroundColor: "transparent",
          }}
          styles={{ body: { padding: 40 } }}
        >
          {/* Header with Logo */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 32,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <Space direction="vertical" size={16}>
              {/* Title and Subtitle */}
              <div>
                <Title
                  level={1}
                  style={{
                    margin: 0,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  E-Podcast
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 16,
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  <RocketOutlined />
                  Học tập mọi lúc, mọi nơi
                </Text>
              </div>
            </Space>
          </div>

          {/* Dynamic Content (Login / Register / ForgotPassword) */}
          <div
            style={{
              borderRadius: 16,
              padding: 8,
            }}
          >
            <Outlet />
          </div>
        </Card>
      </Content>

      {/* Floating Elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(10px)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "12%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
          backdropFilter: "blur(10px)",
          animation: "float 8s ease-in-out infinite 1s",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "20%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
          backdropFilter: "blur(10px)",
          animation: "float 5s ease-in-out infinite 0.5s",
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
      `}</style>
    </Layout>
  );
}
