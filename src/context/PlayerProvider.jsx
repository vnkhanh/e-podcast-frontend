// PlayerProvider.jsx
import React, { useState } from "react";
import { PlayerContext } from "./PlayerContext";

export const PlayerProvider = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedPodcasts, setLikedPodcasts] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlay = (podcast, startTime = 0) => {
    // Nếu đang phát cùng podcast -> chỉ toggle play/pause
    if (currentPodcast?.id === podcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      // Nếu đổi podcast mới
      setCurrentPodcast(podcast);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      // Khi audio sẵn sàng, nhảy đến vị trí startTime (nếu có)
      setTimeout(() => {
        const audio = document.querySelector("audio");
        if (audio && startTime > 0) {
          audio.currentTime = startTime;
        }
      }, 700); // delay nhẹ để audio kịp mount
    }
  };

  const handleLike = (podcastId) => {
    setLikedPodcasts((prev) =>
      prev.includes(podcastId)
        ? prev.filter((id) => id !== podcastId)
        : [...prev, podcastId]
    );
  };

  const playerState = {
    currentPodcast,
    setCurrentPodcast,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    likedPodcasts,
    handlePlay,
    handleLike,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
  };

  return (
    <PlayerContext.Provider value={playerState}>
      {children}
    </PlayerContext.Provider>
  );
};
