import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Avatar,
  Badge,
  Divider,
  List,
} from "antd";
import axios from "axios";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // JWT token đã lưu

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy thông tin user
        const resUser = await axios.get(
          "http://localhost:8080/api/user/account/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(resUser.data.user);

        // Lấy lịch sử nghe
        const resHistory = await axios.get(
          "http://localhost:8080/api/user/account/me/history",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(resHistory.data.history);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert type="error" message="Lỗi" description={error} />
      </div>
    );
  }

  if (!user) return null;

  // Badge màu theo role
  const roleColor = {
    admin: "red",
    teacher: "blue",
    student: "green",
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <Card>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
        >
          <Avatar size={80} icon={<UserOutlined />} />
          <div style={{ marginLeft: 20 }}>
            <Title level={2}>{user.full_name}</Title>
            <Badge
              color={roleColor[user.role]}
              text={user.role.toUpperCase()}
            />
          </div>
        </div>

        <Divider />

        <Text strong>Email: </Text>
        <Text>{user.email}</Text>
        <br />
        <Text strong>Trạng thái: </Text>
        <Text>{user.status ? "Kích hoạt" : "Tạm khóa"}</Text>
        <br />
        <Text strong>Tham gia: </Text>
        <Text>{new Date(user.created_at).toLocaleDateString()}</Text>

        <Divider />

        <Title level={4}>Thông tin khác</Title>
        <Text>Documents: {user.documents?.length || 0}</Text>
        <br />
        <Text>Favorites: {user.favorites?.length || 0}</Text>
        <br />
        <Text>Notes: {user.notes?.length || 0}</Text>
        <br />
        <Text>Flashcards: {user.flashcards?.length || 0}</Text>

        <Divider />

        <Title level={4}>Lịch sử nghe</Title>
        {history.length === 0 ? (
          <Text>Chưa có lịch sử nghe nào.</Text>
        ) : (
          <List
            dataSource={history}
            renderItem={(item) => (
              <List.Item>
                <Card size="small" style={{ width: "100%" }}>
                  <Text strong>{item.podcast.title}</Text>
                  <br />
                  <Text>Đã nghe: {item.seconds} giây</Text>
                  <br />
                  <Text>
                    Ngày nghe gần nhất:{" "}
                    {new Date(item.updated_at).toLocaleString()}
                  </Text>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
