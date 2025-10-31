import React, { useState } from "react";
import { Card, Space, Tag, Typography, Button, Progress } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../utils/helpers";
import PodcastFavoriteButton from "./PodcastFavoriteButton";
const { Text, Paragraph, Title } = Typography;

const FeaturedPodcastCard = ({ podcast, playerState }) => {
  const { currentPodcast, isPlaying, handlePlay, progress } = playerState;
  const isCurrentlyPlaying = currentPodcast?.id === podcast.id && isPlaying;

  const [hovered, setHovered] = useState(false);
  const progressPercent = currentPodcast?.id === podcast.id ? progress : 0;

  return (
    <Card
      style={{
        borderRadius: 20,
        overflow: "hidden",
        border: "none",
        backgroundImage: `url(${podcast.cover_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.4s ease",
        boxShadow: hovered
          ? "0 12px 40px rgba(99,102,241,0.35)"
          : "0 6px 20px rgba(0,0,0,0.25)",
        position: "relative",
        cursor: "pointer",
        height: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Progress bar */}
      {isCurrentlyPlaying && (
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}
        >
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{ "0%": "#60a5fa", "100%": "#6366f1" }}
            strokeWidth={3}
            trailColor="transparent"
          />
        </div>
      )}

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(17,24,39,0.9) 100%)",
          zIndex: 1,
        }}
      />

      {/* Featured Tag */}
      <Tag
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 3,
          border: "none",
          background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
          color: "white",
          fontWeight: 700,
          borderRadius: 8,
          fontSize: 11,
          padding: "4px 10px",
        }}
      >
        NỔI BẬT
      </Tag>

      {/* Top right icons */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 3,
          opacity: hovered ? 1 : 0.6,
          transition: "opacity 0.3s ease",
        }}
      >
        <Space>
          <PodcastFavoriteButton podcastId={podcast.id} />
          <Button
            type="text"
            shape="circle"
            icon={<ShareAltOutlined style={{ color: "#fff" }} />}
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "none",
            }}
          />
        </Space>
      </div>

      {/* Play button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: hovered || isCurrentlyPlaying ? 1 : 0,
          transition: "all 0.3s ease",
          zIndex: 2,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{
            width: 68,
            height: 68,
            background: isCurrentlyPlaying
              ? "rgba(255,255,255,0.95)"
              : "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
            border: "none",
            boxShadow: "0 0 25px rgba(99,102,241,0.6)",
          }}
          icon={
            isCurrentlyPlaying ? (
              <PauseCircleOutlined style={{ fontSize: 30, color: "#1e40af" }} />
            ) : (
              <PlayCircleOutlined style={{ fontSize: 30, color: "#fff" }} />
            )
          }
          onClick={(e) => {
            e.stopPropagation();
            handlePlay(podcast);
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: 20,
          position: "relative",
          zIndex: 2,
          background: "transparent",
        }}
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <Tag
            icon={<BookOutlined />}
            style={{
              border: "none",
              background: "rgba(96,165,250,0.25)",
              color: "#bfdbfe",
              fontWeight: 600,
              borderRadius: 10,
              margin: 0,
              fontSize: 11,
              backdropFilter: "blur(8px)",
            }}
          >
            {podcast.categories[0]?.name || "Chủ đề"}
          </Tag>

          <Title
            level={3}
            style={{
              margin: 0,
              color: hovered ? "#93c5fd" : "#fff",
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.3,
              transition: "color 0.3s ease",
            }}
            ellipsis={{ rows: 1 }}
          >
            {podcast.title}
          </Title>

          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{
              margin: 0,
              fontSize: 13,
              color: "#e2e8f0",
              fontWeight: 400,
            }}
          >
            {podcast.description}
          </Paragraph>

          <Space
            size={16}
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            {/* Meta */}
            <Space size={12}>
              <Space size={6}>
                <UserOutlined style={{ color: "#93c5fd", fontSize: 14 }} />
                <Text
                  style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600 }}
                >
                  {podcast.instructor || "Giảng viên"}
                </Text>
              </Space>
              <Space size={6}>
                <ClockCircleOutlined
                  style={{ color: "#cbd5e1", fontSize: 12 }}
                />
                <Text style={{ color: "#cbd5e1", fontSize: 12 }}>
                  {formatTime(podcast.duration_sec)}
                </Text>
              </Space>
            </Space>

            {/* Stats */}
            <Space size={10}>
              <Text style={{ color: "#facc15", fontSize: 12 }}>
                <EyeOutlined /> {podcast.view_count || 0}
              </Text>
              <Text style={{ color: "#60a5fa", fontSize: 12 }}>
                <HeartOutlined /> {podcast.like_count || 0}
              </Text>
            </Space>
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default FeaturedPodcastCard;
