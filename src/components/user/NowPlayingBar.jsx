import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Avatar, Button, Space, Typography } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
  UpOutlined,
  DownOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";
import CustomAudioPlayer from "../AudioPlayer";

const { Text } = Typography;

const NowPlayingBar = ({ playerState, userToken }) => {
  const { currentPodcast, likedPodcasts, handleLike, isPlaying, setIsPlaying } =
    playerState;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  // Cập nhật thanh tiến trình realtime
  useEffect(() => {
    // nếu chưa có podcast hoặc audioRef chưa sẵn sàng thì bỏ qua
    if (!currentPodcast || !audioRef.current) return;

    const audio = audioRef.current.querySelector("audio");
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentPodcast]);

  if (!currentPodcast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255, 255, 255, 0.95)",
        borderTop: "1px solid #f0f0f0",
        padding: isCollapsed
          ? "6px 16px"
          : isMobile
          ? "12px 16px"
          : "16px 24px",
        zIndex: 1000,
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      {/* --- Player thật (luôn tồn tại để không dừng nhạc) --- */}
      <div
        ref={audioRef}
        style={{
          display: isCollapsed ? "none" : "block",
          width: "100%",
        }}
      >
        <Row align="middle" gutter={[16, 16]}>
          {/* Thông tin podcast + nút like */}
          <Col xs={24} md={8}>
            <Space>
              <Avatar
                shape="square"
                size={40}
                src={currentPodcast?.cover_image}
              />
              <Space direction="vertical" size={0}>
                <Text strong>
                  {currentPodcast?.title || "Không có tiêu đề"}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {currentPodcast?.chapter?.subject?.name || "Chưa có chủ đề"}
                </Text>
              </Space>
              <Button
                type="text"
                icon={
                  likedPodcasts.includes(currentPodcast?.id) ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={() => handleLike(currentPodcast?.id)}
              />
            </Space>
          </Col>

          {/* Player */}
          <Col xs={24} md={8}>
            <CustomAudioPlayer
              src={currentPodcast?.audio_url}
              podcastId={currentPodcast?.id}
              userToken={userToken}
              size="default"
              style={{ width: "100%" }}
              externalPlaying={isPlaying}
              onPlayStateChange={setIsPlaying}
            />
          </Col>

          {/* Nút thao tác */}
          <Col xs={24} md={8}>
            <Space
              style={{
                float: isMobile ? "left" : "right",
              }}
            >
              <Button type="text" icon={<ShareAltOutlined />} />
              <Button type="text" icon={<DownloadOutlined />} />
              <Button type="text" icon={<UnorderedListOutlined />} />
              <Button
                type="text"
                icon={<DownOutlined />}
                onClick={() => setIsCollapsed(true)}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* --- Mini player khi thu gọn --- */}
      {isCollapsed && (
        <>
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 4 }}
          >
            <Col>
              <Space>
                <Avatar size={36} src={currentPodcast?.cover_image} />
                <Space direction="vertical" size={0}>
                  <Text strong style={{ fontSize: 13 }}>
                    {currentPodcast?.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {currentPodcast?.chapter?.subject?.name || "Chưa có chủ đề"}
                  </Text>
                </Space>
              </Space>
            </Col>

            <Col>
              <Space>
                <Button
                  type="text"
                  icon={
                    isPlaying ? (
                      <PauseCircleFilled
                        style={{ fontSize: 22, color: "#1890ff" }}
                      />
                    ) : (
                      <PlayCircleFilled
                        style={{ fontSize: 22, color: "#1890ff" }}
                      />
                    )
                  }
                  onClick={() => setIsPlaying(!isPlaying)}
                />
                <Button
                  type="text"
                  icon={<UpOutlined />}
                  onClick={() => setIsCollapsed(false)}
                />
              </Space>
            </Col>
          </Row>

          {/* Thanh tiến trình nhỏ bên dưới */}
          <div
            style={{
              width: "100%",
              height: 4,
              borderRadius: 2,
              background: "#e0e0e0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#1890ff",
                transition: "width 0.2s linear",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NowPlayingBar;
