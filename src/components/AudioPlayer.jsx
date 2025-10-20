import React, { useState, useRef, useEffect } from "react";
import { Button, Space, Typography, Popover, Dropdown, Menu } from "antd";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepBackwardFilled,
  StepForwardFilled,
  SoundFilled,
  ThunderboltOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { increaseListenCount } from "../services/api_podcast";

const { Text } = Typography;

const CustomAudioPlayer = ({ src, style, size = "default", podcastId }) => {
  const audioRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [hasCounted, setHasCounted] = useState(false);

  const handleRateChange = (value) => {
    setPlaybackRate(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = value;
    }
  };

  const sizes = {
    small: { icon: 20, spacing: 8 },
    default: { icon: 24, spacing: 12 },
    large: { icon: 32, spacing: 16 },
  };

  const { icon: iconSize, spacing } = sizes[size];

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [isDragging]);

  // Khi nghe đủ 30s thì gửi API tăng lượt nghe
  useEffect(() => {
    if (currentTime >= 30 && !hasCounted && podcastId) {
      increaseListenCount(podcastId, audioRef.current?.currentTime);
      setHasCounted(true);
    }
  }, [currentTime]);

  const handleProgressClick = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);

    const handleMouseMove = (moveEvent) => handleProgressClick(moveEvent);
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleVolumeClick = (e) => {
    const volumeSlider = volumeSliderRef.current;
    const rect = volumeSlider.getBoundingClientRect();
    const percent = (rect.bottom - e.clientY) / rect.height;
    const newVolume = Math.max(0, Math.min(1, percent));

    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const handleVolumeMouseDown = (e) => {
    handleVolumeClick(e);
    const handleMouseMove = (moveEvent) => handleVolumeClick(moveEvent);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds) => {
    audioRef.current.currentTime += seconds;
    setCurrentTime(audioRef.current.currentTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const reset = () => {
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const ProgressBar = () => (
    <div style={{ marginBottom: spacing }}>
      <div
        ref={progressBarRef}
        style={{
          height: 6,
          borderRadius: 3,
          cursor: "pointer",
          position: "relative",
          backgroundColor: "#e7e7e7ff",
          marginBottom: 4,
        }}
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
      >
        <div
          style={{
            height: "100%",
            background: "#1890ff",
            borderRadius: 3,
            width: `${(currentTime / duration) * 100}%`,
            transition: isDragging ? "none" : "width 0.1s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${(currentTime / duration) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 12,
            height: 12,
            background: "#1890ff",
            borderRadius: "50%",
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: spacing / 2,
        }}
      >
        <Text type="secondary" style={{ fontSize: iconSize - 6 }}>
          {formatTime(currentTime)}
        </Text>
        <Text type="secondary" style={{ fontSize: iconSize - 6 }}>
          {formatTime(duration)}
        </Text>
      </div>
    </div>
  );

  const VolumeSlider = () => (
    <div
      ref={volumeSliderRef}
      style={{
        width: 24,
        height: 80,
        borderRadius: 12,
        padding: "8px 4px",
        border: "1px solid #d9d9d9",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={handleVolumeClick}
      onMouseDown={handleVolumeMouseDown}
    >
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4,
          height: `calc(100% - 16px)`,
          borderRadius: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `${volume * 100}%`,
            background: volume === 0 ? "#ff4d4f" : "#52c41a",
            borderRadius: 2,
            transition: "height 0.1s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: `${volume * 100}%`,
            left: "50%",
            transform: "translate(-50%, 50%)",
            width: 12,
            height: 12,
            background: volume === 0 ? "#ff4d4f" : "#52c41a",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );

  const volumeContent = (
    <div style={{ padding: "4px 0" }}>
      <VolumeSlider />
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {Math.round(volume * 100)}%
        </Text>
      </div>
    </div>
  );

  const speedMenu = (
    <Menu
      onClick={({ key }) => handleRateChange(parseFloat(key))}
      items={[
        { label: "0.5x", key: "0.5" },
        { label: "0.75x", key: "0.75" },
        { label: "1.0x", key: "1.0" },
        { label: "1.25x", key: "1.25" },
        { label: "1.5x", key: "1.5" },
        { label: "2.0x", key: "2.0" },
      ]}
    />
  );

  return (
    <div
      style={{
        borderRadius: 12,
        padding: spacing,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        ...style,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <ProgressBar />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space size={spacing / 2}>
          <Button
            type="text"
            icon={<StepBackwardFilled style={{ fontSize: iconSize - 4 }} />}
            onClick={() => skip(-10)}
            style={{ color: "#666" }}
          />

          <Button
            type="text"
            icon={
              isPlaying ? (
                <PauseCircleFilled
                  style={{ fontSize: iconSize + 4, color: "#1890ff" }}
                />
              ) : (
                <PlayCircleFilled
                  style={{ fontSize: iconSize + 4, color: "#1890ff" }}
                />
              )
            }
            onClick={togglePlay}
          />

          <Button
            type="text"
            icon={<StepForwardFilled style={{ fontSize: iconSize - 4 }} />}
            onClick={() => skip(10)}
            style={{ color: "#666" }}
          />

          <Button
            type="text"
            icon={<ReloadOutlined style={{ fontSize: iconSize - 4 }} />}
            onClick={reset}
            style={{ color: "#666" }}
          />
        </Space>

        <Dropdown overlay={speedMenu} placement="topCenter" trigger={["click"]}>
          <Button
            type="text"
            icon={
              <ThunderboltOutlined
                style={{ fontSize: iconSize - 6, color: "#666" }}
              />
            }
            style={{ fontWeight: 500 }}
          >
            {playbackRate}x
          </Button>
        </Dropdown>

        <Popover
          content={volumeContent}
          trigger="click"
          placement="top"
          overlayStyle={{ padding: 0 }}
        >
          <Button
            type="text"
            icon={
              <SoundFilled
                style={{
                  fontSize: iconSize - 4,
                  color: isMuted ? "#ff4d4f" : "#666",
                }}
              />
            }
          />
        </Popover>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
