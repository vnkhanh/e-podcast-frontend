import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../../components/user/Header";
import AppFooter from "../../components/user/Footer";

const { Content } = Layout;

function UserLayout() {
  return (
    <Layout>
      <AppHeader />
      <Content style={{ minHeight: "100vh" }}>
        <Outlet /> {/* nơi hiển thị các trang con */}
      </Content>
      <AppFooter />
    </Layout>
  );
}

export default UserLayout;
