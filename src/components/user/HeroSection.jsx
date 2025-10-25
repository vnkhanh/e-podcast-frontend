import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Space,
  Carousel,
  Spin,
  message,
} from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import FeaturedPodcastCard from "./FeaturedPodcasts";
import { getFeaturedPodcasts } from "../../services/api_podcast";

const { Title, Paragraph, Text } = Typography;

const HeroSection = ({ playerState }) => {
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedPodcasts();
        setFeaturedPodcasts(data);
      } catch (error) {
        message.error("Không thể tải podcast nổi bật.");
        console.error("Lỗi: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const isMobile = window.innerWidth <= 768;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" tip="Đang tải podcast nổi bật..." />
      </div>
    );
  }

  if (featuredPodcasts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 0",
        }}
      >
        <Title level={3}>
          Chưa có podcast nổi bật nào trong 7 ngày gần đây
        </Title>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "40px 16px" : "100px 32px",
        textAlign: isMobile ? "center" : "left",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Background gradient với blur overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #3b82f6 100%)",
          filter: "blur(80px)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />
      <Row
        gutter={[48, 48]}
        align="middle"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large">
            <Title
              level={1}
              style={{
                fontSize: isMobile ? 32 : 48,
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#1e293b",
              }}
            >
              Học tập qua{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #6366f1, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Podcast
              </span>
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#475569",
                maxWidth: 480,
              }}
            >
              Khám phá nội dung học tập hấp dẫn từ các chuyên gia hàng đầu — học
              mọi lúc, mọi nơi.
            </Paragraph>
            <Space wrap>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                style={{
                  borderRadius: 30,
                  padding: "0 28px",
                  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                  boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
                }}
              >
                Bắt đầu nghe
              </Button>
              <Button
                size="large"
                style={{
                  borderRadius: 30,
                  borderColor: "#64748b",
                  color: "#334155",
                }}
              >
                Khám phá thêm
              </Button>
            </Space>
          </Space>
        </Col>

        <Col xs={24} lg={12}>
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: "white",
            }}
          >
            <Carousel autoplay arrows>
              {featuredPodcasts.map((podcast) => (
                <div key={podcast.id}>
                  <FeaturedPodcastCard
                    podcast={podcast}
                    playerState={playerState}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;
