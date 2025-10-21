import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Button,
  Popconfirm,
  Tag,
  Progress,
  Tooltip,
  List,
  Row,
  Col,
  Space,
  message,
  Empty,
} from "antd";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getAllListeningHistory,
  deletePodcastHistory,
  clearAllHistory,
} from "../../services/api_history";

const { Title, Text } = Typography;

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
      console.error("Lỗi:", err);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (current, total = 300) =>
    Math.min((current / total) * 100, 100);

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <PlayCircleOutlined style={{ fontSize: 16 }} />
            <Title level={5} style={{ margin: 0 }}>
              Lịch sử nghe podcast
            </Title>
          </div>
          <Tag color="blue" style={{ fontSize: 11, padding: "2px 6px" }}>
            {histories.length} bài nghe
          </Tag>
        </div>
      }
      extra={
        <Space>
          <Tooltip title="Làm mới">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchHistory}
              type="primary"
              ghost
              shape="circle"
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa toàn bộ lịch sử?"
            description="Bạn có chắc chắn muốn xóa toàn bộ lịch sử nghe?"
            onConfirm={handleClearAll}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      }
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
      }}
    >
      <Spin spinning={loading} size="small">
        {histories.length === 0 ? (
          <Empty
            description="Chưa có lịch sử nghe"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "20px 0" }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={histories}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Xóa lịch sử này?"
                    onConfirm={() => handleDelete(item.podcast_id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: 4 }}
                    />
                  </Popconfirm>,
                ]}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        borderRadius: 16,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={item.podcast?.cover_image}
                        alt={item.podcast?.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <PlayCircleOutlined
                        style={{
                          position: "absolute",
                          fontSize: 20,
                          color: "white",
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  }
                  title={
                    <Text
                      strong
                      style={{
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        maxWidth: 220,
                      }}
                    >
                      {item.podcast?.title || "Podcast không tồn tại"}
                    </Text>
                  }
                  description={
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <Row gutter={[12, 4]} align="middle">
                        <Col>
                          <Tag
                            color={item.completed ? "green" : "orange"}
                            icon={
                              item.completed ? (
                                <CheckCircleOutlined />
                              ) : (
                                <ClockCircleOutlined />
                              )
                            }
                            style={{ fontSize: 11, padding: "1px 6px" }}
                          >
                            {item.completed ? "Đã hoàn thành" : "Đang nghe"}
                          </Tag>
                        </Col>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            Vị trí: {formatTime(item.last_position)}
                          </Text>
                        </Col>
                      </Row>

                      <div style={{ marginTop: 4 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 2,
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Tiến độ
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {Math.round(
                              getProgressPercentage(item.last_position)
                            )}
                            %
                          </Text>
                        </div>
                        <Progress
                          percent={getProgressPercentage(item.last_position)}
                          size="small"
                          strokeColor={{
                            "0%": "#36d1dc",
                            "100%": "#5b86e5",
                          }}
                          showInfo={false}
                          style={{ margin: 0 }}
                        />
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Spin>
    </Card>
  );
};

export default UserListeningHistory;
