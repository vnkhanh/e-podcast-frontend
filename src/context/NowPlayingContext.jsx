import React, { createContext, useState, useContext, useEffect } from "react";

const NowPlayingContext = createContext();

export const useNowPlaying = () => useContext(NowPlayingContext);

export const NowPlayingProvider = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedPodcasts, setLikedPodcasts] = useState([]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentPodcast) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 100 / (currentPodcast.duration_sec / 10);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentPodcast]);

  const playPodcast = (podcast) => {
    if (currentPodcast?.id === podcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const toggleLike = (podcastId) => {
    setLikedPodcasts((prev) =>
      prev.includes(podcastId)
        ? prev.filter((id) => id !== podcastId)
        : [...prev, podcastId]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <NowPlayingContext.Provider
      value={{
        currentPodcast,
        isPlaying,
        progress,
        likedPodcasts,
        playPodcast,
        toggleLike,
        setIsPlaying,
        formatTime,
      }}
    >
      {children}
    </NowPlayingContext.Provider>
  );
};
