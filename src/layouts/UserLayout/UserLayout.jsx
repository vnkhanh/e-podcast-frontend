import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  StarOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const UserLayout = () => {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#001529",
          padding: "0 20px",
        }}
      >
        {/* Logo / Title */}
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}>
          🎧 E-Podcast
        </div>

        {/* Navigation */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/dashboard">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="study" icon={<BookOutlined />}>
            <Link to="/study">Học tập</Link>
          </Menu.Item>
          <Menu.Item key="favorites" icon={<StarOutlined />}>
            <Link to="/favorites">Yêu thích</Link>
          </Menu.Item>
        </Menu>

        {/* User dropdown */}
        <Dropdown overlay={userMenu} placement="bottomRight">
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Avatar
              style={{ backgroundColor: "#1890ff", marginRight: 8 }}
              icon={<UserOutlined />}
            />
            <span style={{ color: "#fff" }}>{user?.ho_ten || "User"}</span>
          </div>
        </Dropdown>
      </Header>

      {/* Nội dung */}
      <Content style={{ margin: "20px" }}>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <Outlet />
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} E-Podcast | Powered by Ant Design
      </Footer>
    </Layout>
  );
};

export default UserLayout;
