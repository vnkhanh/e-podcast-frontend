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
        padding: isMobile ? "40px 16px" : "80px 24px",
        textAlign: isMobile ? "center" : "left",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Row gutter={[24, 24]} align="middle">
        {/* Phần mô tả bên trái */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large">
            <Title
              level={1}
              style={{
                marginBottom: 16,
              }}
            >
              Học tập qua Podcast
              <br />
              <Text type="secondary">Kết hợp kiến thức và giải trí</Text>
            </Title>
            <Paragraph
              style={{
                fontSize: 16,
                maxWidth: 500,
                margin: isMobile ? "0 auto" : 0,
              }}
            >
              Khám phá podcast nổi bật nhất trong tuần này — học mọi lúc, mọi
              nơi cùng các chuyên gia hàng đầu.
            </Paragraph>
            <Space
              style={{
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                Bắt đầu nghe
              </Button>
              <Button size="large">Khám phá thêm</Button>
            </Space>
          </Space>
        </Col>

        {/* Phần carousel bên phải */}
        <Col xs={24} lg={12}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Carousel arrows autoplay infinite={false}>
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
