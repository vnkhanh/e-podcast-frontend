import React, { useState, useEffect, useContext } from "react";
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
  Card,
  Tooltip,
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
import { ThemeContext } from "../../context/useTheme";
import { useNavigate } from "react-router-dom";
import { getLatestPodcasts } from "../../services/api_podcast";
const { Text, Paragraph, Title } = Typography;

const PodcastList = ({ playerState, title = "Podcast Mới Nhất" }) => {
  const { currentPodcast, isPlaying, likedPodcasts, handlePlay, handleLike } =
    playerState;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext); // lấy trạng thái theme

  const fetchLatestPodcasts = async () => {
    setLoading(true);
    try {
      const data = await await getLatestPodcasts();
      setPodcasts(data);
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

  const PodcastListItem = ({ podcast, index }) => {
    const isHovered = hoveredIndex === index;
    const isPlayingNow = isPlaying && currentPodcast?.id === podcast.id;

    return (
      <Card
        key={podcast.id}
        onClick={() => navigate(`podcast/${podcast.id}`)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        hoverable
        style={{
          marginBottom: 16,
          borderRadius: 16,
          boxShadow: isHovered
            ? "0 8px 24px rgba(0,0,0,0.12)"
            : "0 4px 12px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          border: isPlayingNow
            ? "2px solid rgba(102,126,234,0.8)"
            : isDarkMode
            ? "1px solid #333"
            : "1px solid #f0f0f0",
          background: isDarkMode
            ? isHovered
              ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
              : "#18181b"
            : isHovered
            ? "linear-gradient(135deg, #f8f9ff 0%, #eef1ff 100%)"
            : "white",
          color: isDarkMode ? "#f9fafb" : "#111827",
        }}
      >
        <List.Item
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
          }}
          actions={[
            <Tooltip title={isPlayingNow ? "Tạm dừng" : "Phát"}>
              <Button
                type="text"
                icon={
                  isPlayingNow ? (
                    <PauseCircleOutlined style={{ fontSize: 22 }} />
                  ) : (
                    <PlayCircleOutlined
                      style={{
                        fontSize: 22,
                        color: "rgba(102,126,234,1)",
                      }}
                    />
                  )
                }
                onClick={() => handlePlay(podcast)}
              />
            </Tooltip>,
            <Tooltip title="Yêu thích">
              <Button
                type="text"
                icon={
                  likedPodcasts.includes(podcast.id) ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined
                      style={{
                        color: isDarkMode ? "#f9fafb" : "inherit",
                      }}
                    />
                  )
                }
                onClick={() => handleLike(podcast.id)}
              />
            </Tooltip>,
            <Tooltip title="Chia sẻ">
              <Button
                type="text"
                icon={
                  <ShareAltOutlined
                    style={{ color: isDarkMode ? "#f9fafb" : "inherit" }}
                  />
                }
              />
            </Tooltip>,
            <Tooltip title="Tải xuống">
              <Button
                type="text"
                icon={
                  <DownloadOutlined
                    style={{ color: isDarkMode ? "#f9fafb" : "inherit" }}
                  />
                }
              />
            </Tooltip>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Space>
                <Text
                  type="secondary"
                  style={{
                    width: 22,
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 20,
                  }}
                >
                  {index + 1}
                </Text>
                <Avatar
                  shape="square"
                  size={60}
                  src={podcast.cover_image}
                  style={{
                    cursor: "pointer",
                    borderRadius: 12,
                    border: isPlayingNow
                      ? "2px solid #667eea"
                      : "1px solid #ddd",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => handlePlay(podcast)}
                />
              </Space>
            }
            title={
              <div style={{ width: "100%" }}>
                <Text
                  strong
                  style={{
                    fontSize: 15,
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
                  }}
                >
                  {podcast.title}
                </Text>
                <div>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      color: isDarkMode ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    {podcast.subject} • {podcast.chapter}
                  </Text>
                </div>
              </div>
            }
            description={
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: isDarkMode ? "#d1d5db" : "#4b5563",
                    maxWidth: "90%",
                  }}
                >
                  {podcast.summary || "Không có mô tả"}
                </Paragraph>
                <Space size="small" wrap>
                  <Tag
                    icon={<EyeOutlined />}
                    color={isDarkMode ? "geekblue" : "default"}
                  >
                    {podcast.view_count}
                  </Tag>
                  <Tag
                    icon={<LikeOutlined />}
                    color={isDarkMode ? "geekblue" : "default"}
                  >
                    {podcast.like_count}
                  </Tag>
                  <Tag
                    icon={<ClockCircleOutlined />}
                    color={isDarkMode ? "geekblue" : "default"}
                  >
                    {formatTime(podcast.duration_sec)}
                  </Tag>
                  {podcast.categories?.map((category) => (
                    <Tag
                      key={category}
                      color={isDarkMode ? "blue" : "blue"}
                      style={{
                        borderRadius: 6,
                        background: isDarkMode
                          ? "rgba(96,165,250,0.2)"
                          : "rgba(102,126,234,0.1)",
                        color: "#667eea",
                      }}
                    >
                      {category}
                    </Tag>
                  ))}
                </Space>
              </Space>
            }
          />
        </List.Item>
      </Card>
    );
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" tip="Đang tải podcast..." />
      </div>
    );

  return (
    <section
      style={{
        width: "100%",
        margin: "48px 0",
        borderRadius: 24,
        padding: "40px 32px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title
          level={2}
          style={{
            fontWeight: 800,
            background: "linear-gradient(90deg, #6366f1, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 4,
          }}
        >
          {title}
        </Title>
        <Text
          type="secondary"
          style={{
            fontSize: 15,
            color: isDarkMode ? "#9ca3af" : "#6b7280",
          }}
        >
          Nghe lại những podcast mới nhất do hệ thống tổng hợp
        </Text>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={podcasts}
        renderItem={(item, index) => (
          <PodcastListItem podcast={item} index={index} />
        )}
      />

      <Divider style={{ marginTop: 24 }} />
    </section>
  );
};

export default PodcastList;
