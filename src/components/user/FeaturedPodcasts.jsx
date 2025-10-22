import React, { useState } from "react";
import { Card, Avatar, Space, Tag, Typography, Button } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { formatTime } from "../../utils/helpers";

const { Text, Paragraph } = Typography;
const { Meta } = Card;

const FeaturedPodcastCard = ({ podcast, playerState }) => {
  const { currentPodcast, isPlaying, handlePlay } = playerState;
  const isCurrentlyPlaying = currentPodcast?.id === podcast.id && isPlaying;

  // State để xử lý hover hiệu ứng
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "none",
        backdropFilter: "blur(10px)",
      }}
      cover={
        <div
          style={{
            position: "relative",
            height: 200,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            alt={podcast.title}
            src={podcast.cover_image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <Button
              type="primary"
              shape="circle"
              size="large"
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
        </div>
      }
    >
      <Meta
        avatar={<Avatar size="large" src={podcast.cover_image} />}
        title={
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>{podcast.title}</Text>
          </Space>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.4,
                color: "#555",
              }}
            >
              {podcast.description}
            </Paragraph>
            <Space>
              <Tag color="blue">{podcast.categories[0]?.name}</Tag>
              <Tag color="green">{formatTime(podcast.duration_sec)}</Tag>
            </Space>
          </Space>
        }
      />
    </Card>
  );
};

export default FeaturedPodcastCard;
