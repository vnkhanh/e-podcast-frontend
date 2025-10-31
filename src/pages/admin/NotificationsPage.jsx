import React, { useEffect, useState } from "react";
import {
  List,
  Typography,
  Spin,
  Empty,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  getNotifications,
  deleteNotification,
  deleteReadNotifications,
  deleteAllNotifications,
  markAllAsRead,
} from "../../services/api_notifications";

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  // Load danh sách thông báo
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setList(data);
    } catch (err) {
      console.error("Load notifications failed:", err);
      message.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Xóa 1 thông báo
  const handleDeleteOne = async (id) => {
    try {
      await deleteNotification(id);
      message.success("Đã xóa thông báo");
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      message.error("Không thể xóa thông báo");
      console.error("Delete notification failed:", err);
    }
  };

  // Xóa tất cả đã đọc
  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
      message.success("Đã xóa tất cả thông báo đã đọc");
      setList((prev) => prev.filter((item) => !item.is_read));
    } catch (err) {
      message.error("Không thể xóa thông báo đã đọc");
      console.error("Delete read notifications failed:", err);
    }
  };

  // Xóa tất cả
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      message.success("Đã xóa tất cả thông báo");
      setList([]);
    } catch (err) {
      message.error("Không thể xóa tất cả thông báo");
      console.error("Delete all notifications failed:", err);
    }
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      message.success("Đã đánh dấu tất cả là đã đọc");
      setList((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
        }))
      );
    } catch (err) {
      message.error("Không thể đánh dấu tất cả đã đọc");
      console.error("Mark all as read failed:", err);
    }
  };

  if (loading) return <Spin />;

  return (
    <>
      {/* Thanh tiêu đề + hành động */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Thông báo
        </Typography.Title>

        <Space>
          <Button
            icon={<ReadOutlined />}
            size="small"
            onClick={handleMarkAllAsRead}
          >
            Đánh dấu tất cả đã đọc
          </Button>

          <Popconfirm
            title="Xóa tất cả đã đọc?"
            onConfirm={handleDeleteRead}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<CheckCircleOutlined />} size="small">
              Xóa đã đọc
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Xóa tất cả thông báo?"
            onConfirm={handleDeleteAll}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<ClearOutlined />} size="small">
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* Danh sách thông báo */}
      <List
        dataSource={list}
        locale={{ emptyText: <Empty description="Không có thông báo" /> }}
        renderItem={(item) => (
          <List.Item
            style={{
              background: item.is_read ? "#fff" : "#f6faff",
              padding: "12px 16px",
              borderBottom: "1px solid #f0f0f0",
            }}
            actions={[
              <Popconfirm
                title="Xóa thông báo này?"
                onConfirm={() => handleDeleteOne(item.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={<b>{item.title}</b>}
              description={item.message}
            />
            <span style={{ fontSize: 12, color: "#888" }}>
              {new Date(item.created_at).toLocaleString("vi-VN")}
            </span>
          </List.Item>
        )}
      />
    </>
  );
};

export default NotificationsPage;
