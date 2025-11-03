import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, notification } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  GroupOutlined,
  LogoutOutlined,
  BlockOutlined,
  DockerOutlined,
  BellOutlined,
  ContainerFilled,
} from "@ant-design/icons";
import {
  getUnreadNotifications,
  markAllNotificationsRead,
} from "../../services/api_notifications";
import { connectUserWebSocket } from "../../services/ws_user";
const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [wsConn, setWsConn] = useState(null);

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
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Gọi API ban đầu
    getUnreadNotifications(token).then(setUnreadCount);

    // Kết nối WebSocket
    const ws = connectUserWebSocket(token, (data) => {
      switch (data.type) {
        case "favorite_notification":
          notification.open({
            message: data.title,
            description: data.message,
            placement: "bottomRight",
          });
          setUnreadCount((prev) => prev + 1);
          break;
        case "badge_update":
          setUnreadCount(data.unread_count);
          break;
        default:
          console.log("WS:", data);
      }
    });
    setWsConn(ws);

    return () => ws?.close();
  }, []);

  const menuItems = [
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
  if (user?.role === "admin") {
    menuItems.push({
      key: "page",
      icon: <ContainerFilled />,
      label: "Trang",
      link: "/admin/page",
    });
  }

  const handleOpenNotifications = async () => {
    navigate("/teacher/notifications");
    const token = localStorage.getItem("token");
    const ok = await markAllNotificationsRead(token);
    if (ok) setUnreadCount(0);
  };

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
          selectedKeys={[location.pathname]}
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
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Hệ thống quản trị</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Badge count={unreadCount} size="small">
              <BellOutlined
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={handleOpenNotifications}
              />
            </Badge>

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
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
