import React, { useState } from "react";
import { Layout, Button } from "antd";
import { Outlet } from "react-router-dom";
import {
  UpOutlined,
  DownOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import AppHeader from "../../components/user/Header";
import AppFooter from "../../components/user/Footer";
import { PlayerProvider } from "../../context/PlayerProvider";
import { usePlayer } from "../../context/usePlayer";
import NowPlayingBar from "../../components/user/NowPlayingBar";
const { Content } = Layout;

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
  const [showPlayerBar, setShowPlayerBar] = useState(true);

  return (
    <Layout>
      <AppHeader />
      <Content style={{ minHeight: "100vh" }}>
        <Outlet />
      </Content>

      {/* Nút bật/tắt thanh nghe */}
      {playerState.currentPodcast && (
        <div
          style={{
            position: "fixed",
            bottom: showPlayerBar ? 80 : 20,
            right: 30,
            zIndex: 1100,
          }}
        >
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={
              showPlayerBar ? <DownOutlined /> : <CustomerServiceOutlined />
            }
            onClick={() => setShowPlayerBar(!showPlayerBar)}
          />
        </div>
      )}

      {/* Thanh nghe hiển thị/ẩn */}
      {playerState.currentPodcast && showPlayerBar && (
        <NowPlayingBar playerState={playerState} userToken={userToken} />
      )}

      <AppFooter />
    </Layout>
  );
}

export default UserLayout;
