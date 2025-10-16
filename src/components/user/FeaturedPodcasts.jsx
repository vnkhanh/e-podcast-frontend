import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Typography, Rate, Spin } from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { getFeaturedPodcasts } from "../../services/api_podcast";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const FeaturedPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedPodcasts();
        setPodcasts(data);
      } catch (err) {
        console.error("Lỗi lấy podcast nổi bật:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "60px 40px",
        background: "#f9f9f9",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        Podcast nổi bật
      </Title>

      <Row gutter={[24, 24]} justify="center">
        {podcasts.map((podcast) => (
          <Col xs={24} sm={12} lg={6} key={podcast.id}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
              cover={
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    alt={podcast.title}
                    src={
                      podcast.cover_image ||
                      "https://placehold.co/300x200?text=Podcast"
                    }
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.4)",
                      opacity: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "opacity 0.3s ease",
                    }}
                    className="play-overlay"
                  >
                    <PlayCircleOutlined
                      style={{
                        fontSize: 48,
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>
              }
              className="podcast-card"
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                const overlay = e.currentTarget.querySelector(".play-overlay");
                if (img) img.style.transform = "scale(1.05)";
                if (overlay) overlay.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                const overlay = e.currentTarget.querySelector(".play-overlay");
                if (img) img.style.transform = "scale(1)";
                if (overlay) overlay.style.opacity = 0;
              }}
            >
              <div style={{ padding: "8px 0" }}>
                <Title level={4} style={{ marginBottom: 4 }}>
                  {podcast.title}
                </Title>
                <Text type="secondary">
                  {podcast.chapter?.name
                    ? `Chương: ${podcast.chapter.name}`
                    : "Podcast"}
                </Text>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#888",
                    fontSize: 13,
                  }}
                >
                  <span>
                    <ClockCircleOutlined />{" "}
                    {Math.round(podcast.duration_sec / 60) || 0} phút
                  </span>
                  <span>{podcast.view_count} lượt nghe</span>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <HeartOutlined style={{ color: "#ff4d4f" }} />
                  <Text>{podcast.like_count || 0}</Text>
                </div>

                <Button
                  type="primary"
                  block
                  icon={<PlayCircleOutlined />}
                  style={{
                    marginTop: 16,
                    borderRadius: 8,
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    navigate(`/podcast/${podcast.id}`);
                  }}
                >
                  Nghe ngay
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturedPodcasts;
