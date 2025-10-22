import React, { useEffect, useState, useRef } from "react";
import { Card, Button, Typography, Spin, Empty, Space, Tag } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../utils/helpers";
import { getFeaturedPodcasts } from "../../services/api_podcast";
import TagScroller from "./TagScroller";
import { useNavigate } from "react-router-dom";
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const PopularPodcasts = ({ playerState }) => {
  const { currentPodcast, isPlaying, handlePlay } = playerState;
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const VISIBLE_COUNT = 4;

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

  const next = () => {
    setStartIndex((prev) => (prev + 1) % podcasts.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + podcasts.length) % podcasts.length);
  };

  const getVisiblePodcasts = () => {
    if (podcasts.length <= VISIBLE_COUNT) return podcasts;
    const extended = [...podcasts, ...podcasts]; // nhân đôi để cuộn mượt
    return extended.slice(startIndex, startIndex + VISIBLE_COUNT);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );

  if (podcasts.length === 0)
    return (
      <Empty
        description="Chưa có podcast nổi bật nào"
        imageStyle={{ height: 120 }}
        style={{ margin: "60px 0" }}
      />
    );

  return (
    <section
      style={{
        padding: "60px 24px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Title level={2} style={{ marginBottom: 4, fontWeight: 700 }}>
          Podcast nổi bật
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Khám phá những podcast được yêu thích nhất
        </Text>
      </div>

      {/* Arrow buttons */}
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          border: "none",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          border: "none",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 24,
          overflow: "hidden",
          scrollBehavior: "smooth",
          justifyContent: "center",
          alignItems: "stretch",
          transition: "all 0.5s ease",
        }}
      >
        {getVisiblePodcasts().map((podcast, index) => {
          const isCurrentlyPlaying =
            currentPodcast?.id === podcast.id && isPlaying;

          return (
            <Card
              key={`${podcast.id}-${index}`}
              hoverable
              style={{
                flex: "0 0 260px",
                borderRadius: 16,
                overflow: "hidden",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
              cover={
                <div style={{ position: "relative", height: 180 }}>
                  <img
                    src={podcast.cover_image}
                    alt={podcast.title}
                    onError={(e) =>
                      (e.target.src = "/images/podcasts/default.jpg")
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "16px 16px 0 0",
                      transition: "transform 0.3s ease",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)",
                      borderRadius: "16px 16px 0 0",
                    }}
                  />

                  {/* Duration */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.75)",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 10px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {formatTime(podcast.duration_sec)}
                  </div>

                  {/* Play Button Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.4)",
                      borderRadius: "16px 16px 0 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "all 0.3s ease",
                    }}
                    className="play-overlay"
                  >
                    {/* Play Button */}
                    <Button
                      shape="circle"
                      icon={
                        isCurrentlyPlaying ? (
                          <PauseCircleOutlined style={{ fontSize: 24 }} />
                        ) : (
                          <PlayCircleOutlined style={{ fontSize: 24 }} />
                        )
                      }
                      onClick={() => handlePlay(podcast)}
                      style={{
                        width: 60,
                        height: 60,
                        border: "none",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                      className="play-button"
                    />
                  </div>
                </div>
              }
            >
              {/* Active playing indicator */}
              {isCurrentlyPlaying && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    animation: "pulse 2s infinite",
                    zIndex: 2,
                  }}
                />
              )}

              <div
                onClick={() => navigate(`/podcast/${podcast.id}`)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderRadius: 8,
                  padding: "4px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.fontStyle = "italic";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.fontStyle = "normal";
                }}
              >
                <Meta
                  title={
                    <Text
                      strong
                      ellipsis={{ rows: 1 }}
                      style={{
                        fontSize: 15,
                        lineHeight: 1.3,
                        color: "#1f2937",
                      }}
                    >
                      {podcast.title}
                    </Text>
                  }
                  description={
                    <Paragraph
                      ellipsis={{ rows: 1 }}
                      style={{
                        fontSize: 13,
                        margin: "8px 0",
                        lineHeight: 1.5,
                        color: "#6b7280",
                      }}
                    >
                      {podcast.description || "Không có mô tả"}
                    </Paragraph>
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#9ca3af",
                  fontSize: 12,
                  marginTop: 12,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <EyeOutlined />
                  {podcast.view_count || 0}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <HeartOutlined />
                  {podcast.like_count || 0}
                </span>
              </div>
              <TagScroller tags={podcast.tags} />
            </Card>
          );
        })}
      </div>

      <style jsx>{`
        .play-overlay:hover {
          opacity: 1 !important;
        }

        .play-button:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default PopularPodcasts;
