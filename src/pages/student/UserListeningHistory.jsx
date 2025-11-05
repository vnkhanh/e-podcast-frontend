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
  Select,
  Pagination,
} from "antd";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import {
  getAllListeningHistory,
  deletePodcastHistory,
  clearAllHistory,
} from "../../services/api_history";
import { formatTime } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const UserListeningHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    total_pages: 1,
  });
  const [filters, setFilters] = useState({
    time: "all",
    completed: "all",
    sort: "desc",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllListeningHistory({
        token,
        page: pagination.page,
        limit: pagination.limit,
        time: filters.time,
        completed: filters.completed === "all" ? "" : filters.completed,
        sort: filters.sort,
      });
      if (res) {
        setHistories(res.data || []);
        setPagination(res.pagination || {});
      }
    } catch (err) {
      message.error("Không thể tải lịch sử nghe");
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  }, [token, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset về trang đầu
  };

  const getProgressPercentage = (current, total) => {
    if (!total || total <= 0) return 0;
    return Math.min((current / total) * 100, 100);
  };

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
              style={{ color: "#667eea", borderColor: "#667eea" }}
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
        borderRadius: 16,
        border: "none",
      }}
      styles={{ body: { padding: "20px 16px" } }}
    >
      {/* Bộ lọc */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Space>
            <FilterOutlined />
            <Text>Thời gian:</Text>
            <Select
              value={filters.time}
              onChange={(v) => handleFilterChange("time", v)}
              style={{ width: 160 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="today">Hôm nay</Option>
              <Option value="week">Tuần này</Option>
              <Option value="month">Tháng này</Option>
              <Option value="year">Năm nay</Option>
            </Select>
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Space>
            <CheckCircleOutlined />
            <Text>Trạng thái:</Text>
            <Select
              value={filters.completed}
              onChange={(v) => handleFilterChange("completed", v)}
              style={{ width: 160 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="true">Đã hoàn thành</Option>
              <Option value="false">Đang nghe</Option>
            </Select>
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Space>
            {filters.sort === "desc" ? (
              <SortDescendingOutlined />
            ) : (
              <SortAscendingOutlined />
            )}
            <Text>Sắp xếp:</Text>
            <Select
              value={filters.sort}
              onChange={(v) => handleFilterChange("sort", v)}
              style={{ width: 160 }}
            >
              <Option value="desc">Mới nhất trước</Option>
              <Option value="asc">Cũ nhất trước</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {/* Danh sách */}
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
                      e?.stopPropagation();
                      handleDelete(item.podcast_id);
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>,
                ]}
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
                      />
                      <PlayCircleOutlined
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          fontSize: 20,
                          color: "white",
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  }
                  title={
                    <Text strong style={{ fontSize: 15 }}>
                      {item.podcast?.title || "Podcast không tồn tại"}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={8}>
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
                          >
                            {item.completed ? "Hoàn thành" : "Đang nghe"}
                          </Tag>
                        </Col>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <CalendarOutlined
                              style={{ marginRight: 4, color: "#667eea" }}
                            />
                            {new Date(item.last_listened_at).toLocaleString(
                              "vi-VN"
                            )}
                          </Text>
                        </Col>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined
                              style={{ marginRight: 4, color: "#667eea" }}
                            />
                            {formatTime(item.last_position)} /{" "}
                            {formatTime(
                              item.podcast?.duration_sec || item.duration
                            )}
                          </Text>
                        </Col>
                      </Row>

                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Tiến độ:{" "}
                          {Math.round(
                            getProgressPercentage(
                              item.last_position,
                              item.podcast?.duration_sec || item.duration
                            )
                          )}
                          %
                        </Text>
                        <Progress
                          percent={getProgressPercentage(
                            item.last_position,
                            item.podcast?.duration_sec || item.duration
                          )}
                          size="small"
                          strokeColor={{
                            "0%": "#667eea",
                            "100%": "#764ba2",
                          }}
                          showInfo={false}
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

      {/* Phân trang */}
      {pagination.total > pagination.limit && (
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      )}
    </Card>
  );
};

export default UserListeningHistory;
