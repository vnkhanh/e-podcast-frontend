import React, { useState, useEffect } from "react";
import { List, Badge, Button, message, Empty, Spin } from "antd";
import { BellOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
} from "../services/api_notifications";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

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
        return <span style={iconStyle}>💬</span>;
      case "reply_notification":
        return <span style={iconStyle}>↩️</span>;
      case "favorite":
        return <span style={iconStyle}>❤️</span>;
      default:
        return <BellOutlined style={iconStyle} />;
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>
          Thông báo <Badge count={unreadCount} style={{ marginLeft: 8 }} />
        </h2>
        <div>
          <Button
            icon={<CheckOutlined />}
            onClick={handleMarkAllRead}
            style={{ marginRight: 8 }}
            disabled={unreadCount === 0}
          >
            Đọc tất cả
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleDeleteRead} danger>
            Xóa đã đọc
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Empty description="Không có thông báo" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleNotificationClick(item)}
              style={{
                cursor: "pointer",
                padding: 16,
                backgroundColor: item.is_read ? "#fff" : "#f0f8ff",
                borderRadius: 8,
                marginBottom: 8,
                border: "1px solid #eee",
                transition: "all 0.3s",
              }}
              actions={[
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleDelete(item.id, e)}
                  size="small"
                >
                  Xóa
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(item.type)}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{ fontWeight: item.is_read ? "normal" : "bold" }}
                    >
                      {item.title}
                    </span>
                    {!item.is_read && (
                      <Badge status="processing" style={{ marginLeft: 8 }} />
                    )}
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 4 }}>{item.message}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      {new Date(item.created_at).toLocaleString("vi-VN")}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationList;
