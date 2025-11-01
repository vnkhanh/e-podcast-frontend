import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../../components/user/Header";
import AppFooter from "../../components/user/Footer";
import { PlayerProvider } from "../../context/PlayerProvider";
import { usePlayer } from "../../context/usePlayer";
import NowPlayingBar from "../../components/user/NowPlayingBar";

const { Content } = Layout;

// Bọc layout trong provider
function UserLayout() {
  return (
    <PlayerProvider>
      <UserLayoutContent />
    </PlayerProvider>
  );
}
function UserLayoutContent() {
  const playerState = usePlayer();
  const userToken = localStorage.getItem("token");

  return (
    <Layout>
      <AppHeader />
      <Content style={{ minHeight: "100vh" }}>
        <Outlet /> {/* nơi hiển thị các trang con */}
      </Content>

      <NowPlayingBar playerState={playerState} userToken={userToken} />

      <AppFooter />
    </Layout>
  );
}

export default UserLayout;
