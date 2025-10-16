import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  GroupOutlined,
  LogoutOutlined,
  BlockOutlined,
  DockerOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

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
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Menu items tùy theo role
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      link: user?.role === "admin" ? "/admin/dashboard" : "/teacher",
    },
    {
      key: "subject",
      icon: <BookOutlined />,
      label: "Môn học",
      link: user?.role === "admin" ? "/admin/subject" : "/teacher/subject",
    },
    {
      key: "topic",
      icon: <GroupOutlined />,
      label: "Chủ đề",
      link: user?.role === "admin" ? "/admin/topic" : "/teacher/topic",
    },
    {
      key: "category",
      icon: <BlockOutlined />,
      label: "Danh mục",
      link: user?.role === "admin" ? "/admin/category" : "/teacher/category",
    },
    {
      key: "document",
      icon: <DockerOutlined />,
      label: "Tài liệu",
      link: user?.role === "admin" ? "/admin/document" : "/teacher/document",
    },
    {
      key: "podcast",
      icon: <BookOutlined />,
      label: "Podcast",
      link: user?.role === "admin" ? "/admin/podcast" : "/teacher/podcast",
    },
  ];

  // Admin mới thêm menu User
  if (user?.role === "admin") {
    menuItems.push({
      key: "user",
      icon: <UserOutlined />,
      label: "Người dùng",
      link: "/admin/user",
    });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          style={{
            height: 40,
            margin: 16,
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: "bold",
          }}
        >
          {user?.role === "admin" ? "Admin" : "Teacher"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems.map((i) => ({
            key: i.key,
            icon: i.icon,
            label: <Link to={i.link}>{i.label}</Link>,
          }))}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Hệ thống quản trị</h3>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>Xin chào, {user?.full_name || "Admin"}!</span>{" "}
              &nbsp;&nbsp;&nbsp;
              <Avatar
                style={{ backgroundColor: "#87d068", marginRight: 8 }}
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
