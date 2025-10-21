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
import { formatTime } from "../../../utils/helpers";
import { getFeaturedPodcasts } from "../../../services/api_podcast";

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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  const PodcastCard = ({ podcast }) => {
    const isCurrentlyPlaying = currentPodcast?.id === podcast.id && isPlaying;

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={podcast.id}>
        <Card
          hoverable
          style={{
            borderRadius: 16,
            overflow: "hidden",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: "14px 16px" }}
          cover={
            <div
              style={{
                position: "relative",
                borderRadius: "16px 16px 0 0",
                overflow: "hidden",
              }}
            >
              <img
                alt={podcast.title}
                src={podcast.cover_image}
                onError={(e) => (e.target.src = "/images/podcasts/default.jpg")}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                className="overlay"
              ></div>

              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                }}
              >
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  style={{
                    backgroundColor: "#1677ff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                    border: "none",
                  }}
                  icon={
                    isCurrentlyPlaying ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )
                  }
                  onClick={() => handlePlay(podcast)}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 12,
                  padding: "2px 8px",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {formatTime(podcast.duration_sec)}
                </Text>
              </div>
            </div>
          }
        >
          <Meta
            title={
              <Text
                strong
                ellipsis={{ tooltip: podcast.title }}
                style={{ fontSize: 15 }}
              >
                {podcast.title}
              </Text>
            }
            description={
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%", marginTop: 6 }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {podcast.chapter?.subject?.name || "Chưa có môn học"}
                </Text>
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#555",
                    lineHeight: "1.4",
                  }}
                >
                  {podcast.description || "Không có mô tả"}
                </Paragraph>
                <Space size="small" wrap>
                  {podcast.categories?.length > 0 && (
                    <Tag color="blue">{podcast.categories[0].name}</Tag>
                  )}
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    👁️ {podcast.view_count}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
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
        padding: "40px 20px 60px",
        background: "#f9fafb",
        borderRadius: 16,
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
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
