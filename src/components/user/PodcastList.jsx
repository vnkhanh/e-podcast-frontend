import React, { useState, useEffect } from "react";
import {
  List,
  Avatar,
  Button,
  Space,
  Tag,
  Typography,
  Divider,
  Spin,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  DownloadOutlined,
  EyeOutlined,
  LikeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../utils/helpers";
import axios from "axios";

const { Text, Paragraph, Title } = Typography;

const PodcastList = ({ playerState, title = "Podcast Mới Nhất" }) => {
  const { currentPodcast, isPlaying, likedPodcasts, handlePlay, handleLike } =
    playerState;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchLatestPodcasts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/user/podcasts/latest`);
      setPodcasts(res.data.podcasts || []);
      console.log("Giây", res.data.podcasts.duration_sec);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải podcast mới nhất");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPodcasts();
  }, []);

  const isMobile = window.innerWidth <= 768;

  const PodcastListItem = ({ podcast, index }) => {
    const isHovered = hoveredIndex === index;
    return (
      <List.Item
        style={{
          padding: isMobile ? "12px 8px" : "16px",
          borderRadius: 8,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 8,
          backgroundColor: isHovered ? "#fafafa" : "transparent",
          boxShadow: isHovered
            ? "0 2px 8px rgba(0,0,0,0.1)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        actions={[
          <Button
            type="text"
            icon={
              isPlaying && currentPodcast?.id === podcast.id ? (
                <PauseCircleOutlined />
              ) : (
                <PlayCircleOutlined />
              )
            }
            onClick={() => handlePlay(podcast)}
          />,
          <Button
            type="text"
            icon={
              likedPodcasts.includes(podcast.id) ? (
                <HeartFilled style={{ color: "#ff4d4f" }} />
              ) : (
                <HeartOutlined />
              )
            }
            onClick={() => handleLike(podcast.id)}
          />,
          <Button type="text" icon={<ShareAltOutlined />} />,
          <Button type="text" icon={<DownloadOutlined />} />,
        ]}
      >
        <List.Item.Meta
          avatar={
            <Space>
              <Text type="secondary" style={{ width: 20, textAlign: "center" }}>
                {index + 1}
              </Text>
              <Avatar
                shape="square"
                size={48}
                src={podcast.cover_image}
                onClick={() => handlePlay(podcast)}
                style={{ cursor: "pointer" }}
              />
            </Space>
          }
          title={
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Text strong>{podcast.title}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {podcast.subject} • {podcast.chapter}
              </Text>
            </Space>
          }
          description={
            <Space direction="vertical" size="small">
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: 0, fontSize: 12 }}
              >
                {podcast.summary}
              </Paragraph>
              <Space size="small" wrap>
                <Tag icon={<EyeOutlined />} color="default">
                  {podcast.view_count}
                </Tag>
                <Tag icon={<LikeOutlined />} color="default">
                  {podcast.like_count}
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="default">
                  {formatTime(podcast.duration_sec)}
                </Tag>
                {podcast.categories.map((category) => (
                  <Tag key={category} color="blue">
                    {category}
                  </Tag>
                ))}
              </Space>
            </Space>
          }
        />
      </List.Item>
    );
  };

  if (loading) return <Spin style={{ margin: 32 }} />;

  return (
    <section style={{ width: "100%", marginTop: 32, marginBottom: 32 }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        {title}
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={podcasts}
        renderItem={(item, index) => (
          <PodcastListItem podcast={item} index={index} />
        )}
      />
      <Divider />
    </section>
  );
};

export default PodcastList;
