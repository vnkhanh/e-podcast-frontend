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
  Select,
  Pagination,
  Space,
  message,
  Empty,
  Button,
} from "antd";
import {
  HeartFilled,
  PlayCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { getUserFavorites } from "../../services/api_favorite";

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getUserFavorites(token, {
        page,
        limit,
        time: timeFilter,
        sort: sortOrder,
      });

      if (Array.isArray(res)) {
        setFavorites(res);
        setTotal(res.length);
      } else if (res?.data && Array.isArray(res.data)) {
        setFavorites(res.data);
        setTotal(res.pagination?.total || res.data.length);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Lỗi tải yêu thích:", err);
      setError(
        err.response?.data?.error || "Không thể tải danh sách yêu thích"
      );
      message.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, timeFilter, sortOrder]);

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

  return (
    <Card
      title={
        <Space align="center">
          <HeartFilled
            style={{
              color: "#eb2f96",
              background: "rgba(235,47,150,0.1)",
              padding: 8,
              borderRadius: 8,
              fontSize: 18,
            }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Podcast yêu thích
          </Title>
        </Space>
      }
      extra={
        <Space>
          <Select
            size="small"
            value={timeFilter}
            onChange={setTimeFilter}
            style={{ width: 140 }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả thời gian</Option>
            <Option value="today">Hôm nay</Option>
            <Option value="week">7 ngày</Option>
            <Option value="month">30 ngày</Option>
            <Option value="year">365 ngày</Option>
          </Select>
          <Select
            size="small"
            value={sortOrder}
            onChange={setSortOrder}
            style={{ width: 120 }}
            suffixIcon={
              sortOrder === "asc" ? (
                <SortAscendingOutlined />
              ) : (
                <SortDescendingOutlined />
              )
            }
          >
            <Option value="desc">Mới nhất</Option>
            <Option value="asc">Cũ nhất</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={fetchFavorites}
            style={{
              borderColor: "#eb2f96",
              color: "#eb2f96",
            }}
          />
        </Space>
      }
      style={{
        borderRadius: 16,
        border: "none",
      }}
    >
      {favorites.length === 0 ? (
        <Empty
          description="Chưa có podcast yêu thích"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "30px 0" }}
        />
      ) : (
        <>
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
                    padding: "14px 8px",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(235,47,150,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={72}
                        src={p.cover_image}
                        alt={p.title}
                      />
                    }
                    title={
                      <Tooltip title={p.title}>
                        <Text strong style={{ fontSize: 15 }}>
                          {p.title}
                        </Text>
                      </Tooltip>
                    }
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined
                            style={{ marginRight: 4, color: "#eb2f96" }}
                          />
                          {new Date(fav.created_at).toLocaleDateString("vi-VN")}
                        </Text>
                        <Tag
                          color="magenta"
                          style={{
                            fontSize: 11,
                            borderRadius: 6,
                            padding: "2px 6px",
                          }}
                        >
                          Yêu thích
                        </Tag>
                      </Space>
                    }
                  />
                  <PlayCircleOutlined
                    style={{
                      fontSize: 26,
                      color: "#eb2f96",
                      cursor: "pointer",
                    }}
                    onClick={() => (window.location.href = `/podcast/${p.id}`)}
                  />
                </List.Item>
              );
            }}
          />

          {total > limit && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Pagination
                current={page}
                total={total}
                pageSize={limit}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
