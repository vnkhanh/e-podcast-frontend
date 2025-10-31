import React, { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Alert,
  List,
  Avatar,
  Typography,
  Tag,
  Tooltip,
} from "antd";
import {
  HeartFilled,
  PlayCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getUserFavorites } from "../../services/api_favorite";

const { Title, Text } = Typography;

export default function UserFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await getUserFavorites(token);
        setFavorites(res);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" tip="Đang tải danh sách yêu thích..." />
      </div>
    );

  if (error)
    return (
      <div style={{ maxWidth: 800, margin: "40px auto" }}>
        <Alert type="error" message="Lỗi tải dữ liệu" description={error} />
      </div>
    );

  if (favorites.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <HeartFilled style={{ color: "#eb2f96", fontSize: 40 }} />
        <Title level={4} style={{ marginTop: 16 }}>
          Bạn chưa yêu thích podcast nào
        </Title>
        <Text type="secondary">
          Hãy khám phá và thêm vào danh sách yêu thích nhé!
        </Text>
      </div>
    );

  return (
    <Card
      title={<Title level={4}>🎧 Podcast yêu thích</Title>}
      style={{
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        border: "none",
        marginTop: 24,
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={favorites}
        renderItem={(fav) => {
          const p = fav.podcast;
          if (!p) return null;

          return (
            <List.Item
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "16px 8px",
              }}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size={64} src={p.cover_image} />}
                title={
                  <Tooltip title={p.title}>
                    <Text strong style={{ fontSize: 16 }}>
                      {p.title}
                    </Text>
                  </Tooltip>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      <ClockCircleOutlined />{" "}
                      {new Date(fav.created_at).toLocaleDateString("vi-VN")}
                    </Text>
                  </div>
                }
              />
              <PlayCircleOutlined
                style={{
                  fontSize: 24,
                  color: "#1677ff",
                  cursor: "pointer",
                }}
                onClick={() => (window.location.href = `/podcast/${p.id}`)}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
