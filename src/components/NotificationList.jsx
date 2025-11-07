import React, { useState, useEffect, useContext } from "react";
import {
  List,
  Badge,
  Button,
  message,
  Empty,
  Spin,
  Typography,
  Space,
} from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  CheckOutlined,
  CommentOutlined,
  HeartOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
} from "../services/api_notifications";
import { ThemeContext } from "../context/useTheme";

const { Title, Text } = Typography;

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  // Lấy danh sách thông báo
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data || []);
      const unread = (data || []).filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      message.error("Không thể tải thông báo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Click thông báo
  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.is_read) {
        await markNotificationRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      // Điều hướng tùy theo loại
      if (notif.podcast_id) {
        if (
          notif.comment_id &&
          (notif.type === "comment_notification" ||
            notif.type === "reply_notification")
        ) {
          navigate(`/podcast/${notif.podcast_id}`, {
            state: { scrollToComment: notif.comment_id },
          });
        } else {
          navigate(`/podcast/${notif.podcast_id}`);
        }
      } else if (notif.related_url) {
        navigate(notif.related_url);
      }
    } catch (error) {
      message.error("Không thể xử lý thông báo");
      console.error(error);
    }
  };

  // Đọc tất cả
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      message.success("Đã đánh dấu tất cả là đã đọc");
    } catch {
      message.error("Không thể cập nhật");
    }
  };

  // Xóa 1 thông báo
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      message.success("Đã xóa thông báo");
    } catch {
      message.error("Không thể xóa");
    }
  };

  // Xóa tất cả đã đọc
  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
      message.success("Đã xóa thông báo đã đọc");
    } catch {
      message.error("Không thể xóa");
    }
  };

  // Icon theo type
  const getNotificationIcon = (type) => {
    const iconStyle = { fontSize: 24 };
    switch (type) {
      case "comment_notification":
        return <CommentOutlined style={iconStyle} />;
      case "reply_notification":
        return <RetweetOutlined style={iconStyle} />;
      case "favorite":
        return <HeartOutlined style={iconStyle} />;
      default:
        return <BellOutlined style={iconStyle} />;
    }
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: 100,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDarkMode ? "#111827" : "#fff",
        }}
      >
        <Spin size="large" tip="Đang tải thông báo..." />
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Title
            level={3}
            style={{ color: isDarkMode ? "#e5e7eb" : "#000", margin: 0 }}
          >
            Thông báo{" "}
            <Badge
              count={unreadCount}
              style={{
                backgroundColor: isDarkMode ? "#6366f1" : "#1890ff",
                marginLeft: 8,
              }}
            />
          </Title>

          <Space>
            <Button
              icon={<CheckOutlined />}
              onClick={handleMarkAllRead}
              style={{
                background: isDarkMode ? "#374151" : "#f0f0f0",
                color: isDarkMode ? "#e5e7eb" : "#000",
                border: "none",
              }}
              disabled={unreadCount === 0}
            >
              Đọc tất cả
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDeleteRead}
              danger
              style={{
                background: isDarkMode ? "#7f1d1d" : undefined,
              }}
            >
              Xóa đã đọc
            </Button>
          </Space>
        </div>

        {notifications.length === 0 ? (
          <div
            style={{
              borderRadius: 16,
              padding: 40,
            }}
          >
            <Empty
              description="Không có thông báo"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ color: isDarkMode ? "#e5e7eb" : undefined }}
            />
          </div>
        ) : (
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              padding: 8,
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    cursor: "pointer",
                    padding: 16,
                    marginBottom: 8,
                    borderRadius: 12,
                    border: isDarkMode
                      ? "1px solid #374151"
                      : "1px solid #f0f0f0",
                    backgroundColor: item.is_read
                      ? isDarkMode
                        ? "#111827"
                        : "#fff"
                      : isDarkMode
                      ? "#312e81"
                      : "#f0f8ff",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.background = isDarkMode
                      ? "linear-gradient(135deg, #1e293b 0%, #111827 100%)"
                      : "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0px)";
                    e.currentTarget.style.backgroundColor = item.is_read
                      ? isDarkMode
                        ? "#111827"
                        : "#fff"
                      : isDarkMode
                      ? "#312e81"
                      : "#f0f8ff";
                  }}
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleDelete(item.id, e)}
                      size="small"
                      style={{
                        color: isDarkMode ? "#fca5a5" : undefined,
                      }}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={getNotificationIcon(item.type)}
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: isDarkMode ? "#f3f4f6" : "#000",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: item.is_read ? "normal" : "bold",
                          }}
                        >
                          {item.title}
                        </span>
                        {!item.is_read && (
                          <Badge
                            status="processing"
                            style={{ marginLeft: 8 }}
                            color={isDarkMode ? "#818cf8" : "#1890ff"}
                          />
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <div
                          style={{
                            marginBottom: 4,
                            color: isDarkMode ? "#d1d5db" : "#555",
                          }}
                        >
                          {item.message}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: isDarkMode ? "#9ca3af" : "#999",
                          }}
                        >
                          {new Date(item.created_at).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
