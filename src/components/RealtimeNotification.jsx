import React, { useEffect, useState } from "react";
import { Badge, notification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import {
  getUnreadNotifications,
  markAllAsRead,
} from "../services/api_notifications";
import { connectUserWebSocket } from "../services/ws_user";

const RealtimeNotification = ({ navigate }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setWsConn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Lấy số lượng chưa đọc ban đầu
    getUnreadNotifications(token).then(setUnreadCount);

    // Kết nối WebSocket
    let ws = connectUserWebSocket(token, (data) => {
      if (!data?.type) return;

      if (
        data.type === "favorite_notification" ||
        data.type === "comment_notification" ||
        data.type === "reply_notification"
      ) {
        notification.open({
          message: data.title,
          description: data.message,
          placement: "bottomRight",
          onClick: () => {
            if (data.podcast_id) {
              navigate(
                `/podcast/${data.podcast_id}#comment-${data.comment_id}`
              );
            }
          },
        });
      }

      if (data.type === "badge_update") {
        setUnreadCount(data.unread_count);
      }
    });

    setWsConn(ws);

    // Nếu socket bị ngắt, tự reconnect sau 5s
    ws.onclose = () => {
      console.warn("WebSocket disconnected, retrying in 5s...");
      setTimeout(() => {
        ws = connectUserWebSocket(token, (data) => {
          if (!data?.type) return;
          if (
            data.type === "favorite_notification" ||
            data.type === "comment_notification" ||
            data.type === "reply_notification"
          ) {
            notification.open({
              message: data.title,
              description: data.message,
              placement: "bottomRight",
            });
          }
          if (data.type === "badge_update") {
            setUnreadCount(data.unread_count);
          }
        });
        setWsConn(ws);
      }, 5000);
    };

    return () => ws?.close();
  }, [navigate]);

  // Mở trang thông báo và đánh dấu đã đọc
  const handleOpenNotifications = async () => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    // Chuyển hướng theo role
    let path = "/notifications";
    if (user?.role === "admin") path = "/admin/notifications";
    else if (user?.role === "teacher") path = "/teacher/notifications";
    else if (user?.role === "student") path = "/notifications";

    navigate(path);

    const token = localStorage.getItem("token");
    const ok = await markAllAsRead(token);
    if (ok) setUnreadCount(0);
  };

  return (
    <Badge count={unreadCount} size="small">
      <BellOutlined
        style={{ fontSize: 20, cursor: "pointer" }}
        onClick={handleOpenNotifications}
      />
    </Badge>
  );
};

export default RealtimeNotification;
