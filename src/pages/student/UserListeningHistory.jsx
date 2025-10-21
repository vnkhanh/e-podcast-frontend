import React, { useEffect, useState } from "react";
import { List, Card, Spin, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  getAllListeningHistory,
  deletePodcastHistory,
  clearAllHistory,
} from "../../services/api_history";

const UserListeningHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getAllListeningHistory(token);
      setHistories(res.data || []);
    } catch (err) {
      message.error("Không thể tải lịch sử nghe");
      console.log("Lỗi: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePodcastHistory(token, id);
      message.success("Đã xóa lịch sử nghe");
      fetchHistory();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllHistory(token);
      message.success("Đã xóa toàn bộ lịch sử");
      fetchHistory();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Card
      title="Lịch sử nghe podcast"
      extra={
        <Popconfirm
          title="Xóa toàn bộ lịch sử?"
          onConfirm={handleClearAll}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa tất cả
          </Button>
        </Popconfirm>
      }
    >
      <Spin spinning={loading}>
        <List
          dataSource={histories}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Xóa lịch sử này?"
                  onConfirm={() => handleDelete(item.podcast_id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={item.Podcast?.title || "Podcast không tồn tại"}
                description={`Vị trí nghe cuối: ${
                  item.last_position
                }s — Hoàn thành: ${item.completed ? "✅" : "❌"}`}
              />
            </List.Item>
          )}
        />
      </Spin>
    </Card>
  );
};

export default UserListeningHistory;
