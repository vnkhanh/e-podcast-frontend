import React, { useEffect, useState, useCallback } from "react";
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
import { formatTime } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const UserListeningHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
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
  }, [token]);

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

  const getProgressPercentage = (current, total = 300) =>
    Math.min((current / total) * 100, 100);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <Card
      title={
        <Space align="center">
          <PlayCircleOutlined
            style={{
              fontSize: 20,
              color: "#667eea",
              background: "rgba(102,126,234,0.1)",
              padding: 8,
              borderRadius: 8,
            }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Lịch sử nghe Podcast
          </Title>
          <Tag
            color="purple"
            style={{
              fontSize: 11,
              borderRadius: 6,
              padding: "2px 6px",
              background: "rgba(102,126,234,0.1)",
            }}
          >
            {histories.length} bài
          </Tag>
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="Làm mới">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchHistory}
              shape="circle"
              size="small"
              style={{
                color: "#667eea",
                borderColor: "#667eea",
              }}
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
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{
                borderRadius: 6,
              }}
            >
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      }
      style={{
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        border: "none",
      }}
      styles={{
        body: { padding: "20px 16px" },
      }}
    >
      <Spin spinning={loading} tip="Đang tải lịch sử..." size="small">
        {histories.length === 0 ? (
          <Empty
            description="Chưa có lịch sử nghe"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "30px 0" }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={histories}
            renderItem={(item) => (
              <List.Item
                onClick={() =>
                  navigate(
                    `/podcast/${item.podcast_id}?t=${item.last_position}`
                  )
                }
                actions={[
                  <Popconfirm
                    title="Xóa lịch sử này?"
                    onConfirm={(e) => {
                      e?.stopPropagation(); // chặn click lan lên List.Item
                      handleDelete(item.podcast_id);
                    }}
                    onCancel={(e) => e?.stopPropagation()} // chặn luôn cancel
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: 6 }}
                      onClick={(e) => e.stopPropagation()} // chặn luôn khi click nút
                    />
                  </Popconfirm>,
                ]}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #f0f0f0",
                  transition: "background 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                        }}
                      ></div>
                      <PlayCircleOutlined
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          fontSize: 20,
                          color: "white",
                          opacity: 0.9,
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                        }}
                      />
                    </div>
                  }
                  title={
                    <Text
                      strong
                      style={{
                        fontSize: 15,
                        maxWidth: 240,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                            icon={
                              item.completed ? (
                                <CheckCircleOutlined />
                              ) : (
                                <ClockCircleOutlined />
                              )
                            }
                            color={item.completed ? "success" : "warning"}
                            style={{
                              fontSize: 11,
                              borderRadius: 6,
                              padding: "2px 6px",
                            }}
                          >
                            {item.completed ? "Hoàn thành" : "Đang nghe"}
                          </Tag>
                        </Col>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined
                              style={{ marginRight: 4, color: "#667eea" }}
                            />
                            {formatTime(item.last_position)}
                          </Text>
                        </Col>
                      </Row>

                      {/* Tiến độ */}
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
                            "0%": "#667eea",
                            "100%": "#764ba2",
                          }}
                          showInfo={false}
                          style={{
                            margin: 0,
                            height: 6,
                            borderRadius: 6,
                          }}
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
