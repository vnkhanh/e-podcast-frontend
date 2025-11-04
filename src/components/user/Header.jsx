import React, { useEffect, useContext, useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Avatar,
  Dropdown,
  Typography,
  message,
  AutoComplete,
  Space,
  notification,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  SearchOutlined,
  LogoutOutlined,
  BulbOutlined,
  MoonOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/useTheme";
import { jwtDecode } from "jwt-decode";
import { searchAutocomplete } from "../../services/api_search"; // <-- import API
import { connectUserWebSocket } from "../../services/ws_user";
import RealtimeNotification from "../RealtimeNotification";
const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);

  // Gọi API autocomplete
  const handleSearchChange = async (value) => {
    setSearchText(value);
    if (!value.trim()) {
      setOptions([]);
      return;
    }
    try {
      const data = await searchAutocomplete(value, 10);
      setOptions(
        data.map((item) => ({
          value: item.type === "podcast" ? item.title : item.name,
          label: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.type === "podcast" ? "🎧" : "📚"} {item.title || item.name}
            </div>
          ),
          id: item.id,
          type: item.type,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Khi chọn 1 gợi ý
  const handleSelect = (value, option) => {
    if (option?.type && option?.id) {
      if (option.type === "podcast") navigate(`/podcast/${option.id}`);
      else navigate(`/subjects/${option.slug}`);
    }
  };

  // Khi nhấn Enter
  const handleSearchEnter = () => {
    if (!searchText.trim()) {
      message.warning("Vui lòng nhập từ khóa!");
      return;
    }
    navigate("/search", { state: { query: searchText } });
  };

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
      } catch {
        message.error("Phiên đăng nhập không hợp lệ!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login", { replace: true });
      }
    }
  }, [token, navigate]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = connectUserWebSocket(token, (data) => {
      if (data.type === "reply_notification") {
        notification.open({
          message: data.title,
          description: data.message,
          placement: "bottomRight",
          onClick: () => {
            navigate(`/podcast/${data.podcast_id}#comment-${data.comment_id}`);
          },
        });
      }
    });

    return () => ws?.close();
  }, [navigate]);

  const menuItems = [
    { key: "home", label: "Trang chủ" },
    { key: "courses", label: "Khóa học" },
    { key: "podcasts", label: "Podcast" },
    { key: "blog", label: "Blog" },
    { key: "about", label: "Về chúng tôi" },
  ];

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
    { key: "my-courses", icon: <BookOutlined />, label: "Khóa học của tôi" },
    {
      key: "theme",
      icon: isDarkMode ? <BulbOutlined /> : <MoonOutlined />,
      label: isDarkMode ? "Chế độ sáng" : "Chế độ tối",
    },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
    { key: "settings", icon: <SettingOutlined />, label: "Quản lý" },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === "profile") navigate("/profile");
    else if (key === "settings") {
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "teacher") navigate("/teacher");
      else navigate("/me");
    } else if (key === "my-courses") navigate("/my-courses");
    else if (key === "theme") toggleTheme();
    else if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      message.success("Đã đăng xuất!");
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <Header
      style={{
        backdropFilter: "blur(10px)",
        background: isDarkMode
          ? "rgba(24, 24, 27, 0.9)"
          : "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 32px",
        transition: "all 0.3s ease",
        height: 72,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1300,
          margin: "0 auto",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Left Section */}
        <Space size={40} align="center">
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={() => navigate("/")}
          >
            <Title
              level={3}
              style={{
                margin: 0,
                background: "linear-gradient(90deg, #6366f1, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                letterSpacing: -0.5,
              }}
            >
              E-Podcast
            </Title>
          </div>

          <Menu
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={menuItems}
            theme={isDarkMode ? "dark" : "light"}
            style={{
              background: "transparent",
              borderBottom: "none",
              fontWeight: 500,
              fontSize: 15,
            }}
          />
        </Space>

        {/* Right Section */}
        <Space align="center" size={20}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 40,
            }}
          >
            <AutoComplete
              options={options}
              style={{ width: 280 }}
              value={searchText}
              onChange={handleSearchChange}
              onSelect={handleSelect}
              dropdownMatchSelectWidth={300}
              dropdownRender={(menu) => (
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {menu}
                  {options.length > 0 && (
                    <div
                      style={{
                        padding: "4px 12px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                      onMouseDown={handleSearchEnter}
                    >
                      Tìm tất cả kết quả cho "{searchText}"
                    </div>
                  )}
                </div>
              )}
            >
              <Input.Search
                placeholder="Tìm podcast hoặc môn học..."
                enterButton={<SearchOutlined />}
                onSearch={handleSearchEnter}
              />
            </AutoComplete>
          </div>

          {token && user ? (
            <div>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="bottomRight"
                trigger={["click"]}
                arrow
              >
                <Avatar
                  size={40}
                  src={user?.avatar_url}
                  icon={<UserOutlined />}
                  style={{
                    cursor: "pointer",
                    border: isDarkMode
                      ? "2px solid #3b82f6"
                      : "2px solid #6366f1",
                    transition: "all 0.3s ease",
                  }}
                />
              </Dropdown>

              <RealtimeNotification navigate={navigate} />
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => navigate("/auth/login")}
              style={{
                borderRadius: 20,
                background: "linear-gradient(90deg, #6366f1, #3b82f6)",
                fontWeight: 600,
                height: 38,
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
