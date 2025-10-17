import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Spin,
  message,
  Input,
  Select,
  Pagination,
  Space,
  Tag,
  Tooltip,
  Button,
  Empty,
} from "antd";
import axios from "axios";
import {
  ClockCircleOutlined,
  FireOutlined,
  EyeOutlined,
  SearchOutlined,
  HeartOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CategoryPodcastsPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/user/categories/${slug}/podcasts`,
          {
            params: { page, limit, sort, search },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategory(res.data.category);
        setPodcasts(res.data.podcasts);
        setTotal(res.data.pagination.total); // ✅ lấy tổng số podcast
      } catch (err) {
        console.error(err);
        message.error("Không thể tải danh sách podcast");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [slug, page, sort, search, limit]); // ✅ page thay đổi → fetch dữ liệu mới

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0 giây";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes === 0) return `${remainingSeconds} giây`;
    if (remainingSeconds === 0) return `${minutes} phút`;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" tip="Đang tải danh sách podcast..." />
      </div>
    );

  return (
    <div
      style={{
        padding: "60px 40px",
        minHeight: "100vh",
      }}
    >
      {/* ====== HEADER ====== */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title
          level={2}
          style={{
            marginBottom: 8,
            WebkitBackgroundClip: "text",
          }}
        >
          {category?.name || "Danh mục Podcast"}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {category?.description || "Khám phá những podcast thú vị nhất."}
        </Text>
      </div>

      {/* ====== FILTER BAR ====== */}
      <div
        style={{
          padding: "20px 28px",
          borderRadius: 14,
          marginBottom: 32,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Search
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm podcast..."
          onSearch={(value) => setSearch(value.trim())}
          allowClear
          enterButton="Tìm"
          style={{ width: 340, maxWidth: "100%" }}
        />

        <Select
          value={sort}
          onChange={(value) => setSort(value)}
          style={{ width: 220 }}
          size="middle"
        >
          <Option value="latest">
            <ClockCircleOutlined /> Mới nhất
          </Option>
          <Option value="popular">
            <FireOutlined /> Phổ biến nhất
          </Option>
          <Option value="duration">⏱ Thời lượng dài nhất</Option>
        </Select>
      </div>

      {/* ====== PODCAST GRID ====== */}
      {!podcasts || podcasts.length === 0 ? (
        <Empty
          description="Chưa có podcast nào trong danh mục này."
          style={{ marginTop: 80 }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {podcasts.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                bordered={false}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                }}
                bodyStyle={{ padding: 16 }}
                cover={
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderTopLeftRadius: 14,
                      borderTopRightRadius: 14,
                    }}
                  >
                    <img
                      alt={p.title}
                      src={p.cover_image || "/default-cover.jpg"}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    >
                      {formatDuration(p.duration_sec)}
                    </div>
                  </div>
                }
              >
                <Tooltip title={p.title}>
                  <Title
                    level={5}
                    ellipsis={{ rows: 1 }}
                    style={{ marginBottom: 6 }}
                  >
                    {p.title}
                  </Title>
                </Tooltip>

                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ fontSize: 13, marginBottom: 12 }}
                >
                  {p.description || "Không có mô tả."}
                </Paragraph>

                <Space size={[8, 8]} wrap>
                  <Tag icon={<EyeOutlined />} color="blue">
                    {p.view_count || 0} xem
                  </Tag>
                  <Tag icon={<HeartOutlined />} color="red">
                    {p.like_count ?? 0} yêu thích
                  </Tag>
                </Space>

                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => navigate(`/podcast/${p.id}`)}
                  block
                  style={{
                    marginTop: 12,
                    borderRadius: 8,
                    background: "#1677ff",
                  }}
                >
                  Nghe ngay
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ====== PAGINATION ====== */}
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={(p) => setPage(p)} // click số trang → setPage → trigger useEffect
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default CategoryPodcastsPage;
