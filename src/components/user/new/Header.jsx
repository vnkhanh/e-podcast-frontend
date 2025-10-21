import React, { useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Avatar,
  Dropdown,
  Typography,
  message,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  SearchOutlined,
  LogoutOutlined,
  BulbOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../utils/useTheme";
import { jwtDecode } from "jwt-decode";

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

const AppHeader = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;
  const navigate = useNavigate();

  // ===================== JWT CHECK =====================
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          message.warning(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/auth/login", { replace: true });
        }
      } catch (err) {
        console.error("JWT decode error:", err);
        message.error("Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login", { replace: true });
      }
    }
  }, [token, navigate]);

  // ===================== MENU =====================
  const menuItems = [
    { key: "home", label: "Trang chủ" },
    { key: "courses", label: "Khóa học" },
    { key: "podcasts", label: "Podcasts" },
    { key: "blog", label: "Blog" },
    { key: "about", label: "Về chúng tôi" },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    {
      key: "my-courses",
      icon: <BookOutlined />,
      label: "Khóa học của tôi",
    },
    {
      key: "theme",
      icon: isDarkMode ? <BulbOutlined /> : <MoonOutlined />,
      label: isDarkMode ? "Chế độ sáng" : "Chế độ tối",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === "profile") navigate("/profile");
    else if (key === "my-courses") navigate("/my-courses");
    else if (key === "theme") toggleTheme();
    else if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      message.success("Đã đăng xuất!");
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <Header
      style={{
        background: isDarkMode ? "#1f1f1f" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{ marginRight: 40, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Title
              level={3}
              style={{ color: "#1890ff", margin: 0, cursor: "pointer" }}
            >
              E-Podcast
            </Title>
          </div>

          <Menu
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={menuItems}
            theme={isDarkMode ? "dark" : "light"} // 🌟 đổi theme menu
            style={{ border: "none", background: "transparent" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Search
            placeholder="Tìm kiếm khóa học, podcast..."
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300 }}
          />

          {token && user ? (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
                theme: isDarkMode ? "dark" : "light", // 🌟 dropdown theme
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate("/auth/login")}>
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
