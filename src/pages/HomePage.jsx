import React from "react";
import { Layout } from "antd";
import HeroSection from "../components/user/HeroSection";
import CategoriesSection from "../components/user/CategorySection";
import SubjectsSection from "../components/user/SubjectsSection";
import PodcastList from "../components/user/PodcastList";
import PopularPodcasts from "../components/user/PopularPodcasts";
import "../styles/HomePage.css";
import { usePlayer } from "../context/usePlayer"; // dùng context

const { Content } = Layout;

const HomePage = () => {
  const playerState = usePlayer(); // lấy state và hàm từ context toàn cục

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        {/* HeroSection, PodcastList... chỉ cần nhận playerState */}
        <HeroSection playerState={playerState} />

        <div className="main-content">
          <CategoriesSection />
          <SubjectsSection />
          <PodcastList playerState={playerState} title="Podcast mới nhất" />
          <PopularPodcasts playerState={playerState} />
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;
