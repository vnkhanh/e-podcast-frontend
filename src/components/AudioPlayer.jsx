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
import { saveListeningHistory } from "../services/api_history";
import { formatTime } from "../utils/helpers";
const { Text } = Typography;

const CustomAudioPlayer = ({
  src,
  style,
  size = "default",
  podcastId,
  userToken,
  startTime = 0,
  externalPlaying, // thêm prop
  onPlayStateChange, // callback để sync lên trên
}) => {
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

  const sizes = {
    small: { icon: 20, spacing: 8 },
    default: { icon: 24, spacing: 12 },
    large: { icon: 32, spacing: 16 },
  };

  const { icon: iconSize, spacing } = sizes[size];

  // --- Update time & duration ---
  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => !isDragging && setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      // Khi nghe hết
      if (podcastId && userToken) {
        saveListeningHistory(
          podcastId,
          audio.duration,
          true,
          userToken,
          audio.duration
        );
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [isDragging, podcastId, userToken]);

  // --- Khi nghe đủ 30s -> tăng lượt nghe ---
  useEffect(() => {
    if (currentTime >= 30 && !hasCounted && podcastId) {
      increaseListenCount(podcastId, audioRef.current?.currentTime);
      setHasCounted(true);
    }
  }, [currentTime, podcastId, hasCounted]);

  // --- Cập nhật lịch sử nghe realtime mỗi 15 giây ---
  useEffect(() => {
    if (!podcastId || !userToken) return;

    const interval = setInterval(() => {
      if (isPlaying && audioRef.current && duration > 0) {
        const pos = Math.floor(audioRef.current.currentTime);
        const dur = Math.floor(audioRef.current.duration || 0);
        saveListeningHistory(podcastId, pos, false, userToken, dur);
        console.log("Đã lưu lịch sử nghe:", pos, "/", dur);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, podcastId, userToken]);

  // --- Khi có startTime được truyền vào ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !startTime) return;

    const seekToPosition = () => {
      audio.currentTime = startTime;
      console.log("Tua đến giây:", startTime);
    };

    // Nếu metadata chưa load thì chờ loadedmetadata
    if (audio.readyState >= 1) {
      seekToPosition();
    } else {
      audio.addEventListener("loadedmetadata", seekToPosition, { once: true });
    }

    return () => {
      audio.removeEventListener("loadedmetadata", seekToPosition);
    };
  }, [startTime]);

  // --- Đồng bộ trạng thái phát từ bên ngoài ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (externalPlaying) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [externalPlaying]);

  // --- Giao diện điều khiển ---
  const handleRateChange = (value) => {
    setPlaybackRate(value);
    if (audioRef.current) audioRef.current.playbackRate = value;
  };

  const handleProgressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
    const handleMove = (ev) => handleProgressClick(ev);
    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const handleVolumeClick = (e) => {
    const rect = volumeSliderRef.current.getBoundingClientRect();
    const percent = (rect.bottom - e.clientY) / rect.height;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const handleVolumeMouseDown = (e) => {
    handleVolumeClick(e);
    const handleMove = (ev) => handleVolumeClick(ev);
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    const newState = !isPlaying;
    if (newState) audio.play();
    else audio.pause();
    setIsPlaying(newState);
    onPlayStateChange && onPlayStateChange(newState); // báo lên trên
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime += seconds;
    setCurrentTime(audio.currentTime);
  };
  const reset = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) audio.play();
  };

  // --- Giao diện ProgressBar + Volume ---
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
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
          }}
        />
      </div>
    </div>
  );

  const speedMenu = (
    <Menu
      onClick={({ key }) => handleRateChange(parseFloat(key))}
      items={[
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
            icon={<StepBackwardFilled />}
            onClick={() => skip(-10)}
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
            icon={<StepForwardFilled />}
            onClick={() => skip(10)}
          />
          <Button type="text" icon={<ReloadOutlined />} onClick={reset} />
        </Space>

        <Dropdown overlay={speedMenu} trigger={["click"]}>
          <Button
            type="text"
            icon={
              <ThunderboltOutlined
                style={{ fontSize: iconSize - 6, color: "#666" }}
              />
            }
          >
            {playbackRate}x
          </Button>
        </Dropdown>

        <Popover content={<VolumeSlider />} trigger="click" placement="top">
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
