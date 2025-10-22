import React, { useState } from "react";
import { Card, Avatar, Space, Tag, Typography, Button, Progress } from "antd";
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

const { Text, Paragraph, Title } = Typography;

const FeaturedPodcastCard = ({ podcast, playerState }) => {
  const { currentPodcast, isPlaying, handlePlay, progress } = playerState;
  const isCurrentlyPlaying = currentPodcast?.id === podcast.id && isPlaying;

  // State để xử lý hover hiệu ứng
  const [hovered, setHovered] = useState(false);

  // Tính toán progress nếu đang phát
  const progressPercent = currentPodcast?.id === podcast.id ? progress : 0;

  return (
    <Card
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "none",
        backgroundImage: `linear-gradient(rgba(146, 146, 146, 0.4), rgba(151, 151, 151, 0.8)), url(${podcast.cover_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: hovered
          ? "0 12px 40px rgba(139, 139, 139, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)"
          : "0 6px 20px rgba(0, 0, 0, 0.25)",
        transition: "all 0.3s ease",
        position: "relative",
        cursor: "pointer",
        height: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      bodyStyle={{
        padding: 0,
        background: "transparent",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Progress Bar khi đang phát */}
      {isCurrentlyPlaying && (
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}
        >
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{
              "0%": "#3b82f6",
              "100%": "#60a5fa",
            }}
            strokeWidth={3}
            trailColor="transparent"
          />
        </div>
      )}

      {/* Gradient Overlay để chữ dễ đọc */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(15, 28, 63, 0.1) 30%, rgba(15, 28, 63, 0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Top Actions */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 3,
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}
      >
        <Space>
          <Button
            type="text"
            shape="circle"
            icon={<HeartOutlined style={{ color: "#fff", fontSize: 16 }} />}
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              border: "none",
            }}
          />
          <Button
            type="text"
            shape="circle"
            icon={<ShareAltOutlined style={{ color: "#fff", fontSize: 16 }} />}
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              border: "none",
            }}
          />
        </Space>
      </div>

      {/* Play Button */}
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
            width: 60,
            height: 60,
            background: isCurrentlyPlaying
              ? "rgba(255, 255, 255, 0.95)"
              : "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
            border: "none",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          }}
          icon={
            isCurrentlyPlaying ? (
              <PauseCircleOutlined style={{ fontSize: 28, color: "#1e40af" }} />
            ) : (
              <PlayCircleOutlined style={{ fontSize: 28, color: "#fff" }} />
            )
          }
          onClick={(e) => {
            e.stopPropagation();
            handlePlay(podcast);
          }}
        />
      </div>

      {/* Featured Badge */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 3,
        }}
      >
        <Tag
          color="#f59e0b"
          style={{
            border: "none",
            background: "rgba(245, 158, 11, 0.9)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
            fontSize: 11,
            margin: 0,
          }}
        >
          NỔI BẬT
        </Tag>
      </div>

      {/* Content Section - Hiển thị ở dưới */}
      <div
        style={{
          padding: 20,
          position: "relative",
          zIndex: 2,
          background: "transparent",
        }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {/* Category Tag */}
          <div>
            <Tag
              icon={<BookOutlined />}
              style={{
                border: "none",
                background: "rgba(59, 130, 246, 0.3)",
                color: "#93c5fd",
                fontWeight: 600,
                borderRadius: 10,
                margin: 0,
                fontSize: 11,
                backdropFilter: "blur(10px)",
              }}
            >
              {podcast.categories[0]?.name}
            </Tag>
          </div>

          {/* Title */}
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.3,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
            ellipsis={{ rows: 1 }}
          >
            {podcast.title}
          </Title>

          {/* Description */}
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.5,
              color: "#e2e8f0",
              fontWeight: 400,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {podcast.description}
          </Paragraph>

          {/* Meta Info */}
          <Space
            size={16}
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Space size={12}>
              {/* Instructor */}
              <Space size={6}>
                <UserOutlined style={{ color: "#93c5fd", fontSize: 14 }} />
                <Text
                  style={{
                    color: "#93c5fd",
                    fontSize: 12,
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {podcast.instructor || "Giảng viên"}
                </Text>
              </Space>

              {/* Duration */}
              <Space size={6}>
                <ClockCircleOutlined
                  style={{ color: "#cbd5e1", fontSize: 12 }}
                />
                <Text
                  style={{
                    color: "#cbd5e1",
                    fontSize: 12,
                    fontWeight: 500,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {formatTime(podcast.duration_sec)}
                </Text>
              </Space>
            </Space>

            {/* Stats */}
            <Space size={12}>
              <Space size={4}>
                <Text
                  style={{
                    color: "#f59e0b",
                    fontSize: 12,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <EyeOutlined />
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {podcast.view_count || "0"}
                </Text>
              </Space>
              <Space size={4}>
                <Text
                  style={{
                    color: "#60a5fa",
                    fontSize: 12,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <HeartOutlined />
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {podcast.like_count || "0"}
                </Text>
              </Space>
            </Space>
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default FeaturedPodcastCard;
