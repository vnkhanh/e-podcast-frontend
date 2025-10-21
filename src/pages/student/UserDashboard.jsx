// src/components/HomePage/HomePage.js
import React, { useState } from "react";
import { Layout } from "antd";
import HeroSection from "../../components/user/new/HeroSection";
import NowPlayingBar from "../../components/user/new/NowPlayingBar";
import CategoriesSection from "../../components/user/new/CategorySection";
import SubjectsSection from "../../components/user/new/SubjectsSection";
import PodcastList from "../../components/user/new/PodcastList";
import PopularPodcasts from "../../components/user/new/PopularPodcasts";
import { mockPodcasts } from "../../utils/mockData";
import "../HomePage.css";

const { Content } = Layout;

const UserDashboard = () => {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedPodcasts, setLikedPodcasts] = useState([]);

  const handlePlay = (podcast) => {
    if (currentPodcast?.id === podcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
      setProgress(0);
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
    isPlaying,
    progress,
    likedPodcasts,
    setProgress,
    setIsPlaying,
    handlePlay,
    handleLike,
  };

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        <HeroSection playerState={playerState} />

        {currentPodcast && <NowPlayingBar playerState={playerState} />}

        <div className="main-content">
          <CategoriesSection />
          <SubjectsSection />
          <PodcastList
            podcasts={mockPodcasts}
            playerState={playerState}
            title="Podcast mới nhất"
          />
          <PopularPodcasts podcasts={mockPodcasts} playerState={playerState} />
        </div>
      </Content>
    </Layout>
  );
};

export default UserDashboard;
