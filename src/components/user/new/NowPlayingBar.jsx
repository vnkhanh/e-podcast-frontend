import React from "react";
import { Row, Col, Avatar, Button, Space, Typography } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import CustomAudioPlayer from "../../AudioPlayer";
import "./NowPlayingBar.css";

const { Text } = Typography;

const NowPlayingBar = ({ playerState, userToken }) => {
  const { currentPodcast, likedPodcasts, handleLike } = playerState;

  if (!currentPodcast) return null;

  return (
    <div className="now-playing-bar">
      <Row align="middle" gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Space>
            <Avatar
              shape="square"
              size={40}
              src={currentPodcast?.cover_image}
            />
            <Space direction="vertical" size={0}>
              <Text strong>{currentPodcast?.title || "Không có tiêu đề"}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
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

        {/* Phần player thực */}
        <Col xs={24} md={8}>
          <CustomAudioPlayer
            src={currentPodcast?.audio_url}
            podcastId={currentPodcast?.id}
            userToken={userToken}
            size="default"
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} md={8}>
          <Space className="player-actions">
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
