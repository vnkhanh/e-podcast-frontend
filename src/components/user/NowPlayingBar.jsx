import React from "react";
import { Row, Col, Avatar, Button, Space, Typography } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import CustomAudioPlayer from "../AudioPlayer";

const { Text } = Typography;

const NowPlayingBar = ({ playerState, userToken }) => {
  const { currentPodcast, likedPodcasts, handleLike } = playerState;

  if (!currentPodcast) return null;

  // Responsive: kiểm tra thiết bị nhỏ
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255, 255, 255, 0.95)",
        borderTop: "1px solid #f0f0f0",
        padding: isMobile ? "12px 16px" : "16px 24px",
        zIndex: 1000,
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
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
              <Text strong>{currentPodcast?.title || "Không có tiêu đề"}</Text>
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
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default NowPlayingBar;
