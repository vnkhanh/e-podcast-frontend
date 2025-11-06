import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  ClockCircleOutlined,
  FireOutlined,
  EyeOutlined,
  SearchOutlined,
  HeartOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { getCategoryPodcasts } from "../../../services/api_podcast";
import { formatTime } from "../../../utils/helpers";
import { getAllListeningHistory } from "../../../services/api_history";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CategoryPodcastsPage() {
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
  const [progressMap, setProgressMap] = useState({});
  const token = localStorage.getItem("token");

  const fetchPodcasts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoryPodcasts({
        slug,
        page,
        limit,
        sort,
        search,
      });
      setCategory(data.category);
      setPodcasts(data.podcasts);
      setTotal(data.pagination.total);
    } catch (err) {
      message.error("Không thể tải danh sách podcast");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [slug, page, limit, sort, search]);

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);
  useEffect(() => {
    const fetchProgress = async () => {
      if (!token) return;
      try {
        const res = await getAllListeningHistory(token);
        // Tạo map để dễ truy cập
        const map = {};
        res.data?.forEach((h) => {
          if (h.podcast_id)
            map[h.podcast_id] = {
              pos: h.last_position || 0,
              dur: h.duration || 1,
              completed: h.completed || false,
            };
        });
        setProgressMap(map);
      } catch (err) {
        console.error("Lỗi tải tiến trình nghe:", err);
      }
    };
    fetchProgress();
  }, [token]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" tip="Đang tải danh sách podcast..." />
      </div>
    );

  return (
    <div style={{ padding: "60px 40px", minHeight: "100vh" }}>
      {/* ===== HEADER ===== */}
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <Title
          level={2}
          style={{
            marginBottom: 10,
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          }}
        >
          {category?.name || "Danh mục Podcast"}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {category?.description || "Khám phá những podcast thú vị nhất."}
        </Text>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: 14,
          marginBottom: 36,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          backdropFilter: "blur(8px)",
        }}
      >
        <Search
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm podcast..."
          onSearch={(v) => setSearch(v.trim())}
          allowClear
          enterButton="Tìm"
          style={{ width: 340, maxWidth: "100%" }}
        />

        <Select value={sort} onChange={setSort} style={{ width: 220 }}>
          <Option value="latest">
            <ClockCircleOutlined /> Mới nhất
          </Option>
          <Option value="popular">
            <FireOutlined /> Phổ biến
          </Option>
          <Option value="duration">⏱ Thời lượng dài nhất</Option>
        </Select>
      </div>

      {/* ===== PODCAST GRID ===== */}
      {!podcasts.length ? (
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
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.35s ease",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const progress = progressMap[p.id];
                  const lastPos = progress?.last_position || progress?.pos || 0;
                  if (progress && lastPos > 10 && !progress.completed) {
                    navigate(`/podcast/${p.id}?t=${Math.floor(lastPos)}`);
                  } else {
                    navigate(`/podcast/${p.id}`);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(102,126,234,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.06)";
                }}
                cover={
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    <img
                      alt={p.title}
                      src={p.cover_image || "/default-cover.jpg"}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        transition: "transform 0.35s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.08)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />

                    {/* Overlay gradient + hover effect */}
                    <div
                      className="overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
                        transition: "background 0.3s ease",
                      }}
                    />

                    {/* Play Button */}
                    <Button
                      shape="circle"
                      icon={<PlayCircleOutlined />}
                      size="large"
                      onClick={(e) => {
                        e.stopPropagation();
                        const progress = progressMap[p.id];
                        const lastPos =
                          progress?.last_position || progress?.pos || 0;
                        if (progress && lastPos > 10 && !progress.completed) {
                          navigate(`/podcast/${p.id}?t=${Math.floor(lastPos)}`);
                        } else {
                          navigate(`/podcast/${p.id}`);
                        }
                      }}
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        background: "rgba(255,255,255,0.9)",
                        color: "#667eea",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.2)";
                        e.currentTarget.style.boxShadow =
                          "0 0 12px rgba(118,75,162,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />

                    {/* Duration tag */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 14,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    >
                      {formatTime(p.duration_sec)}
                    </div>

                    {/* Listening progress bar */}
                    {progressMap[p.id] && progressMap[p.id].dur > 0 && (
                      <Tooltip
                        title={`${formatTime(
                          progressMap[p.id].pos
                        )} / ${formatTime(progressMap[p.id].dur)}`}
                      >
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: 4,
                            width: `${Math.min(
                              (progressMap[p.id].pos / progressMap[p.id].dur) *
                                100,
                              100
                            )}%`,
                            background: progressMap[p.id].completed
                              ? "#52c41a"
                              : "linear-gradient(90deg, #667eea, #764ba2)",
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: progressMap[p.id].completed
                              ? 16
                              : 0,
                            boxShadow: "0 0 8px rgba(118,75,162,0.5)",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                }
              >
                <Tooltip title={p.title}>
                  <Title
                    level={5}
                    ellipsis={{ rows: 1 }}
                    style={{
                      marginBottom: 6,
                      fontWeight: 600,
                      color: "#1f1f1f",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#764ba2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#1f1f1f")
                    }
                  >
                    {p.title}
                  </Title>
                </Tooltip>

                <Paragraph
                  ellipsis={{ rows: 1 }}
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 10,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#4f46e5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6b7280")
                  }
                >
                  {p.description || "Không có mô tả."}
                </Paragraph>

                <Space size={[8, 8]} wrap>
                  <Tag icon={<EyeOutlined />} color="geekblue">
                    {p.view_count || 0} lượt xem
                  </Tag>
                  <Tag icon={<HeartOutlined />} color="magenta">
                    {p.like_count ?? 0} yêu thích
                  </Tag>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ===== PAGINATION ===== */}
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
          style={{
            padding: "8px 20px",
            background: "white",
            borderRadius: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
}
