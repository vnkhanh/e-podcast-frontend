import React, { useEffect, useState } from "react";
import { List, Typography, Spin, Empty } from "antd";
import axios from "axios";

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setList(res.data))
      .catch((err) => console.error("Load notifications failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;

  return (
    <List
      header={<Typography.Title level={5}>Thông báo</Typography.Title>}
      dataSource={list}
      locale={{ emptyText: <Empty description="Không có thông báo" /> }}
      renderItem={(item) => (
        <List.Item
          style={{
            background: item.is_read ? "#fff" : "#f6faff",
            padding: "12px 16px",
            borderBottom: "1px solid #f0f0f0",
          }}
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
  );
};

export default NotificationsPage;
