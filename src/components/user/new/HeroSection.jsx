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
import { getFeaturedPodcasts } from "../../../services/api_podcast";
import "./HeroSection.css";

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
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="hero-section loading">
        <Spin size="large" tip="Đang tải podcast nổi bật..." />
      </div>
    );
  }

  if (featuredPodcasts.length === 0) {
    return (
      <div className="hero-section empty">
        <Title level={3}>
          Chưa có podcast nổi bật nào trong 7 ngày gần đây
        </Title>
      </div>
    );
  }

  return (
    <div className="hero-section">
      <Row gutter={[24, 24]} align="middle">
        {/* Phần mô tả bên trái */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large">
            <Title level={1}>
              Học tập qua Podcast
              <br />
              <Text type="secondary">Kết hợp kiến thức và giải trí</Text>
            </Title>
            <Paragraph className="hero-description">
              Khám phá podcast nổi bật nhất trong tuần này — học mọi lúc, mọi
              nơi cùng các chuyên gia hàng đầu.
            </Paragraph>
            <Space>
              <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                Bắt đầu nghe
              </Button>
              <Button size="large">Khám phá thêm</Button>
            </Space>
          </Space>
        </Col>

        {/* Phần carousel bên phải */}
        <Col xs={24} lg={12}>
          <Carousel autoplay className="hero-carousel">
            {featuredPodcasts.map((podcast) => (
              <div key={podcast.id}>
                <FeaturedPodcastCard
                  podcast={podcast}
                  playerState={playerState}
                />
              </div>
            ))}
          </Carousel>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;
