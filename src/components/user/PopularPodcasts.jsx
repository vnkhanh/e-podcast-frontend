import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Spin,
  Empty,
} from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { formatTime } from "../../utils/helpers";
import { getFeaturedPodcasts } from "../../services/api_podcast";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const PopularPodcasts = ({ playerState }) => {
  const { currentPodcast, isPlaying, handlePlay } = playerState;
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const data = await getFeaturedPodcasts();
        setPodcasts(data);
      } catch (err) {
        console.error("Lỗi khi tải podcast nổi bật:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );

  const PodcastCard = ({ podcast }) => {
    const isCurrentlyPlaying = currentPodcast?.id === podcast.id && isPlaying;

    return (
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card
          hoverable
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
            transition: "all 0.3s ease",
            height: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
          bodyStyle={{ padding: "14px 16px" }}
          cover={
            <div
              style={{
                position: "relative",
                height: 180,
                overflow: "hidden",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <img
                alt={podcast.title}
                src={podcast.cover_image}
                onError={(e) => (e.target.src = "/images/podcasts/default.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                }}
              ></div>

              {/* Duration badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                }}
              >
                <Tag
                  color="geekblue"
                  style={{
                    margin: 0,
                    border: "none",
                    fontSize: 12,
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {formatTime(podcast.duration_sec)}
                </Tag>
              </div>

              {/* Play button overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  transition: "all 0.3s ease",
                  opacity: 0,
                }}
                className="play-overlay"
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={
                    isCurrentlyPlaying ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )
                  }
                  size="large"
                  onClick={() => handlePlay(podcast)}
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    transform: "scale(1.05)",
                    border: "none",
                  }}
                />
              </div>
            </div>
          }
        >
          <Meta
            title={
              <Text strong ellipsis={{ tooltip: podcast.title }}>
                {podcast.title}
              </Text>
            }
            description={
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%", marginTop: 6 }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {podcast.chapter?.subject?.name || "Chưa có môn học"}
                </Text>
                <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 13 }}>
                  {podcast.description || "Không có mô tả"}
                </Paragraph>
                <Space size="small" wrap>
                  {podcast.categories?.slice(0, 2).map((c) => (
                    <Tag key={c.id} color="blue">
                      {c.name}
                    </Tag>
                  ))}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    👁️ {podcast.view_count}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ❤️ {podcast.like_count}
                  </Text>
                </Space>
              </Space>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <section
      style={{
        padding: "60px 20px 80px",
        background: "#f9fafb",
        borderRadius: 16,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ marginBottom: 8, fontWeight: 700 }}>
          Phổ biến nhất
        </Title>
        <Text type="secondary">
          Khám phá những podcast được yêu thích nhất trong tuần
        </Text>
      </div>

      {podcasts.length === 0 ? (
        <Empty description="Chưa có podcast nổi bật nào" />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </Row>
      )}
    </section>
  );
};

export default PopularPodcasts;
