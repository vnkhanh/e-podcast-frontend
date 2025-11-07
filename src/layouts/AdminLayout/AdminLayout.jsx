import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  GroupOutlined,
  LogoutOutlined,
  BlockOutlined,
  DockerOutlined,
  HomeOutlined,
  ContainerFilled,
} from "@ant-design/icons";
import RealtimeNotification from "../../components/RealtimeNotification";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => {
          if (user?.role === "admin") navigate("/admin/me");
          else if (user?.role === "teacher") navigate("/teacher/me");
          else navigate("/me");
        }}
      >
        Hồ sơ
      </Menu.Item>
      <Menu.Item
        key="homepage"
        icon={<HomeOutlined />}
        onClick={() => navigate("/")}
      >
        E-Podcast
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: "subject",
      icon: <BookOutlined />,
      label: "Môn học",
      link: user?.role === "admin" ? "/admin/subject" : "/teacher/subject",
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
  if (user?.role === "admin") {
    menuItems.unshift({
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      link: "/admin/dashboard",
    });
  }
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
          selectedKeys={[
            menuItems.find((item) => location.pathname.startsWith(item.link))
              ?.link || location.pathname,
          ]}
          items={menuItems.map((i) => ({
            key: i.link,
            icon: i.icon,
            label: <Link to={i.link}>{i.label}</Link>,
          }))}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "white",
          }}
        >
          <h3 style={{ margin: 0 }}>Hệ thống quản trị</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <RealtimeNotification navigate={navigate} />

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
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
