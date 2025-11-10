import React, { useContext } from "react";
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
  MoonOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import RealtimeNotification from "../../components/RealtimeNotification";
import { ThemeContext } from "../../context/useTheme";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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
      <Menu.Item
        key="theme"
        icon={isDarkMode ? <BulbOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
      >
        {isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
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
      icon: <PaperClipOutlined />,
      label: "Tài liệu",
      link: user?.role === "admin" ? "/admin/document" : "/teacher/document",
    },
    {
      key: "podcast",
      icon: <CustomerServiceOutlined />,
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
    menuItems.push({
      key: "user",
      icon: <UserOutlined />,
      label: "Người dùng",
      link: "/admin/user",
    });
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: isDarkMode ? "#141414" : "#f0f2f5",
        color: isDarkMode ? "#fff" : "#000",
      }}
    >
      <Sider theme={isDarkMode ? "dark" : "light"} collapsible>
        <div
          style={{
            height: 40,
            margin: 16,
            background: isDarkMode ? "rgba(255,255,255,0.2)" : "#1890ff20",
            color: isDarkMode ? "#fff" : "#000",
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: "bold",
          }}
        >
          {user?.role === "admin" ? "Admin" : "Teacher"}
        </div>
        <Menu
          theme={isDarkMode ? "dark" : "light"}
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
            background: isDarkMode ? "#1f1f1f" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          <h3 style={{ margin: 0, color: isDarkMode ? "#fff" : "#000" }}>
            Hệ thống quản trị
          </h3>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              overlay={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: isDarkMode ? "#fff" : "#000",
                }}
              >
                <span>Xin chào, {user?.full_name || "Admin"}!</span>
                &nbsp;&nbsp;&nbsp;
                <Avatar
                  style={{ backgroundColor: "#87d068", marginRight: 8 }}
                  icon={<UserOutlined />}
                />
              </div>
            </Dropdown>
            <RealtimeNotification navigate={navigate} />
          </div>
        </Header>

        <Content
          style={{
            margin: "16px",
            background: isDarkMode ? "#141414" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          <div style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
