import React, { useEffect, useState, useRef } from "react";
import { Card, Button, Typography, Spin, Empty, Tooltip } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  HeartOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getFeaturedPodcasts } from "../../services/api_podcast";
import { formatTime } from "../../utils/helpers";
import TagScroller from "./TagScroller";

const { Title, Text, Paragraph } = Typography;

const PopularPodcasts = ({ playerState }) => {
  const { currentPodcast, isPlaying, handlePlay } = playerState;
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const data = await getFeaturedPodcasts();
        setPodcasts(data || []);
      } catch (err) {
        console.error("Lỗi khi tải podcast nổi bật:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const newPos =
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: newPos, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Đang tải podcast nổi bật..." />
      </div>
    );

  if (podcasts.length === 0)
    return (
      <Empty
        description="Chưa có podcast nổi bật nào"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: "80px 0" }}
      />
    );

  return (
    <section
      style={{
        padding: "60px 24px",
        position: "relative",
        width: "85%",
        margin: "0 auto",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Title
            level={2}
            style={{
              marginBottom: 8,
              fontWeight: 800,
              background: "linear-gradient(90deg, #6366f1, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Podcast nổi bật
          </Title>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            Khám phá những podcast được yêu thích nhất trong tuần
          </Text>
        </div>

        {/* Scroll buttons */}
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            border: "none",
            width: 44,
            height: 44,
            background: "white",
            color: "#667eea",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "#667eea";
          }}
        />
        <Button
          shape="circle"
          icon={<RightOutlined />}
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            border: "none",
            width: 44,
            height: 44,
            background: "white",
            color: "#667eea",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "#667eea";
          }}
        />

        {/* Podcast Carousel */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: 8,
          }}
        >
          {podcasts.map((podcast) => {
            const isPlayingNow = currentPodcast?.id === podcast.id && isPlaying;

            return (
              <Card
                key={podcast.id}
                hoverable
                onClick={() => navigate(`/podcast/${podcast.id}`)}
                style={{
                  minWidth: 260,
                  maxWidth: 260,
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.08)";
                }}
                cover={
                  <div
                    style={{
                      position: "relative",
                      height: 180,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={podcast.cover_image}
                      alt={podcast.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) =>
                        (e.target.src = "/images/podcasts/default.jpg")
                      }
                    />

                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                      }}
                    />

                    {/* Play Button */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                      }}
                    >
                      <Tooltip
                        title={isPlayingNow ? "Tạm dừng" : "Nghe ngay"}
                        placement="left"
                      >
                        <Button
                          shape="circle"
                          icon={
                            isPlayingNow ? (
                              <PauseCircleOutlined style={{ fontSize: 28 }} />
                            ) : (
                              <PlayCircleOutlined style={{ fontSize: 28 }} />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(podcast);
                          }}
                          style={{
                            width: 56,
                            height: 56,
                            border: "none",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                          }}
                        />
                      </Tooltip>
                    </div>

                    {/* Duration */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: 12,
                        color: "white",
                        fontSize: 11,
                        padding: "2px 8px",
                      }}
                    >
                      <SoundOutlined /> {formatTime(podcast.duration_sec)}
                    </div>
                  </div>
                }
              >
                <Title
                  level={5}
                  ellipsis
                  style={{ margin: 0, fontWeight: 600 }}
                >
                  {podcast.title}
                </Title>
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}
                >
                  {podcast.description || "Không có mô tả"}
                </Paragraph>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 10,
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  <span>
                    <EyeOutlined /> {podcast.view_count || 0}
                  </span>
                  <span>
                    <HeartOutlined /> {podcast.like_count || 0}
                  </span>
                </div>

                <TagScroller tags={podcast.tags} />
              </Card>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default PopularPodcasts;
