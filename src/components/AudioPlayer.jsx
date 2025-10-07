import React, { useRef, useState, useEffect } from "react";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  ForwardOutlined,
  StepBackwardOutlined,
  SoundOutlined,
  MutedOutlined,
} from "@ant-design/icons";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const seek = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration);
    setProgress(audio.currentTime);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setProgress(e.target.value);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fafafa",
        borderRadius: 6,
        padding: "8px 10px",
      }}
    >
      <audio ref={audioRef} src={src} style={{ display: "none" }} />

      {/* Control buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <StepBackwardOutlined
          onClick={() => seek(-15)}
          style={{ fontSize: 18, cursor: "pointer" }}
        />
        <button
          onClick={togglePlay}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 26,
          }}
        >
          {isPlaying ? (
            <PauseCircleFilled style={{ fontSize: 28, color: "#000" }} />
          ) : (
            <PlayCircleFilled style={{ fontSize: 28, color: "#000" }} />
          )}
        </button>
        <ForwardOutlined
          onClick={() => seek(15)}
          style={{ fontSize: 18, cursor: "pointer" }}
        />
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 11, width: 30, textAlign: "right" }}>
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          style={{
            flex: 1,
            accentColor: "#1890ff",
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: 11, width: 30 }}>{formatTime(duration)}</span>
        <button
          onClick={toggleMute}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          {isMuted ? <MutedOutlined /> : <SoundOutlined />}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
