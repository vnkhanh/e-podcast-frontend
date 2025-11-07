import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Tag,
  Card,
  Row,
  Col,
  Pagination,
  Space,
  Typography,
  Spin,
  Tooltip,
  Empty,
  message,
  Button,
  Avatar,
  Divider,
  Badge,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  FilterOutlined,
  BookOutlined,
  TagOutlined,
  AppstoreOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  getAllPublishedPodcasts,
  listAllTags,
  listAllCategories,
  listAllSubjects,
} from "../../services/api_podcast";
import { formatTime } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PodcastLibrary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm thực tế

  const [sort, setSort] = useState("az");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);

  useEffect(() => {
    fetchFilters();
  }, []);

  // Debounce cho search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500); // Đợi 500ms sau khi người dùng ngừng nhập

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page, selectedCategory, selectedTag, selectedSubject, searchTerm]);

  const fetchFilters = async () => {
    try {
      const [catRes, tagRes, subRes] = await Promise.all([
        listAllCategories(),
        listAllTags(),
        listAllSubjects(),
      ]);

      // Lọc chỉ lấy danh mục có status = true
      const activeCategories = (catRes || []).filter((c) => c.status === true);

      // Sắp xếp danh mục theo tên (A-Z)
      activeCategories.sort((a, b) =>
        a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
      );

      setCategories(activeCategories);
      setTags(tagRes || []);
      setSubjects(subRes || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải bộ lọc");
    }
  };

  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        sort,
        page,
        limit,
        category_id: selectedCategory || "",
        tag_id: selectedTag || "",
        subject_id: selectedSubject || "",
      };
      const res = await getAllPublishedPodcasts(params);
      setPodcasts(res.podcasts || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải podcast");
    }
    setLoading(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSelectedSubject(null);
    setSearch("");
    setSort("az");
    setPage(1);
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Spin size="large" tip="Đang tải thư viện podcast...">
          <div style={{ width: 200, height: 100 }} />{" "}
          {/* placeholder để Spin có vùng hiển thị */}
        </Spin>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER SECTION */}
        <Card
          style={{
            marginBottom: 32,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 20,
            color: "white",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "radial-gradient(circle at top right, rgba(120, 119, 198, 0.3), transparent 50%)",
            }}
          />

          <div style={{ padding: 32, position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Avatar
                size={64}
                icon={<PlayCircleOutlined />}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              />
              <div>
                <Title
                  level={1}
                  style={{ color: "white", margin: 0, fontSize: 28 }}
                >
                  Thư viện Podcast
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  {total} podcast đang chờ bạn khám phá
                </Text>
              </div>
            </div>

            <Space wrap>
              <Tag
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <PlayCircleOutlined style={{ marginRight: 4 }} />
                {total} podcast
              </Tag>
              <Tag
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                Trang {page}
              </Tag>
            </Space>
          </div>
        </Card>

        {/* FILTER SECTION */}
        <Card
          style={{
            marginBottom: 5,
            borderRadius: 20,
            border: "none",
            background: "inherit",
          }}
          styles={{ body: { padding: 24 } }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={12}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm podcast..."
                allowClear
                size="large"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={() => {
                  setPage(1);
                  fetchPodcasts();
                }}
                onClear={() => {
                  setSearch("");
                  setPage(1);
                  fetchPodcasts();
                }}
                style={{ borderRadius: 12 }}
              />
            </Col>
            <Col xs={24} md={12}>
              <Space size="middle">
                <FilterOutlined style={{ color: "#667eea" }} />
                <Text strong style={{ fontSize: 14 }}>
                  Sắp xếp:
                </Text>
                <Select
                  value={sort}
                  onChange={setSort}
                  size="large"
                  style={{ width: 200, borderRadius: 12 }}
                >
                  <Option value="az">Tên (A-Z)</Option>
                  <Option value="za">Tên (Z-A)</Option>
                  <Option value="duration_asc">Thời lượng tăng dần</Option>
                  <Option value="duration_desc">Thời lượng giảm dần</Option>
                  <Option value="date_desc">Mới nhất</Option>
                  <Option value="date_asc">Cũ nhất</Option>
                </Select>
              </Space>
            </Col>
          </Row>

          {(selectedCategory || selectedTag || selectedSubject || search) && (
            <div style={{ marginTop: 16 }}>
              <Space wrap>
                <Text strong style={{ fontSize: 14 }}>
                  Bộ lọc đang áp dụng:
                </Text>
                {selectedCategory && (
                  <Tag
                    closable
                    onClose={() => setSelectedCategory(null)}
                    style={{
                      background: "rgba(102, 126, 234, 0.1)",
                      color: "#667eea",
                      border: "none",
                      borderRadius: 12,
                    }}
                  >
                    <AppstoreOutlined />{" "}
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </Tag>
                )}
                {selectedSubject && (
                  <Tag
                    closable
                    onClose={() => setSelectedSubject(null)}
                    style={{
                      background: "rgba(255, 107, 53, 0.1)",
                      color: "#ff6b35",
                      border: "none",
                      borderRadius: 12,
                    }}
                  >
                    <BookOutlined />{" "}
                    {subjects.find((s) => s.id === selectedSubject)?.name}
                  </Tag>
                )}
                {selectedTag && (
                  <Tag
                    closable
                    onClose={() => setSelectedTag(null)}
                    style={{
                      background: "rgba(82, 196, 26, 0.1)",
                      color: "#52c41a",
                      border: "none",
                      borderRadius: 12,
                    }}
                  >
                    <TagOutlined />{" "}
                    {tags.find((t) => t.id === selectedTag)?.name}
                  </Tag>
                )}
                {search && (
                  <Tag
                    closable
                    onClose={() => setSearch("")}
                    style={{
                      background: "rgba(24, 144, 255, 0.1)",
                      color: "#1890ff",
                      border: "none",
                      borderRadius: 12,
                    }}
                  >
                    Tìm: "{search}"
                  </Tag>
                )}
                <Button
                  type="link"
                  size="small"
                  onClick={clearAllFilters}
                  style={{ color: "#667eea", fontWeight: 500 }}
                >
                  Xóa tất cả
                </Button>
              </Space>
            </div>
          )}
        </Card>

        {/* FILTER TAGS SECTION */}
        <Card
          style={{
            marginBottom: 10,
            borderRadius: 20,
            border: "none",
            background: "inherit",
          }}
          styles={{ body: { padding: 24 } }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* CATEGORIES FILTER */}
            <div>
              <Text
                strong
                style={{
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <AppstoreOutlined style={{ color: "#667eea" }} /> Danh mục
              </Text>
              <Space wrap>
                <Tag.CheckableTag
                  checked={!selectedCategory}
                  onChange={() => setSelectedCategory(null)}
                  style={{
                    background: !selectedCategory
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#f5f5f5",
                    color: !selectedCategory ? "white" : "#666",
                    border: "none",
                    borderRadius: 12,
                    padding: "4px 12px",
                    cursor: "pointer",
                  }}
                >
                  Tất cả
                </Tag.CheckableTag>
                {categories.map((cat) => (
                  <Tag.CheckableTag
                    key={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() =>
                      setSelectedCategory(
                        selectedCategory === cat.id ? null : cat.id
                      )
                    }
                    style={{
                      background:
                        selectedCategory === cat.id
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "#f5f5f5",
                      color: selectedCategory === cat.id ? "white" : "#666",
                      border: "none",
                      borderRadius: 12,
                      padding: "4px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {cat.name}
                  </Tag.CheckableTag>
                ))}
              </Space>
            </div>

            {/* SUBJECTS FILTER */}
            <div>
              <Text
                strong
                style={{
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <BookOutlined style={{ color: "#ff6b35" }} /> Môn học
              </Text>
              <Space wrap>
                <Tag.CheckableTag
                  checked={!selectedSubject}
                  onChange={() => setSelectedSubject(null)}
                  style={{
                    background: !selectedSubject
                      ? "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
                      : "#f5f5f5",
                    color: !selectedSubject ? "white" : "#666",
                    border: "none",
                    borderRadius: 12,
                    padding: "4px 12px",
                    cursor: "pointer",
                  }}
                >
                  Tất cả
                </Tag.CheckableTag>
                {subjects.map((sub) => (
                  <Tag.CheckableTag
                    key={sub.id}
                    checked={selectedSubject === sub.id}
                    onChange={() =>
                      setSelectedSubject(
                        selectedSubject === sub.id ? null : sub.id
                      )
                    }
                    style={{
                      background:
                        selectedSubject === sub.id
                          ? "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
                          : "#f5f5f5",
                      color: selectedSubject === sub.id ? "white" : "#666",
                      border: "none",
                      borderRadius: 12,
                      padding: "4px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {sub.name}
                  </Tag.CheckableTag>
                ))}
              </Space>
            </div>

            {/* TAGS FILTER */}
            <div>
              <Text
                strong
                style={{
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <TagOutlined style={{ color: "#52c41a" }} /> Tags
              </Text>
              <Space wrap>
                <Tag.CheckableTag
                  checked={!selectedTag}
                  onChange={() => setSelectedTag(null)}
                  style={{
                    background: !selectedTag
                      ? "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)"
                      : "#f5f5f5",
                    color: !selectedTag ? "white" : "#666",
                    border: "none",
                    borderRadius: 12,
                    padding: "4px 12px",
                    cursor: "pointer",
                  }}
                >
                  Tất cả
                </Tag.CheckableTag>
                {tags.map((tag) => (
                  <Tag.CheckableTag
                    key={tag.id}
                    checked={selectedTag === tag.id}
                    onChange={() =>
                      setSelectedTag(selectedTag === tag.id ? null : tag.id)
                    }
                    style={{
                      background:
                        selectedTag === tag.id
                          ? "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)"
                          : "#f5f5f5",
                      color: selectedTag === tag.id ? "white" : "#666",
                      border: "none",
                      borderRadius: 12,
                      padding: "4px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {tag.name}
                  </Tag.CheckableTag>
                ))}
              </Space>
            </div>
          </Space>
        </Card>

        {/* PODCASTS GRID */}
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            background: "inherit",
            overflow: "hidden",
            marginBottom: 32,
          }}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ padding: 24, background: "inherit" }}>
            <Title
              level={3}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <PlayCircleOutlined style={{ color: "#667eea" }} />
              Danh sách Podcast
            </Title>
            <Divider style={{ margin: "16px 0" }} />
          </div>

          {podcasts.length === 0 ? (
            <div style={{ padding: 60 }}>
              <Empty
                description={
                  <div>
                    <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
                      Không tìm thấy podcast
                    </Title>
                    <Text type="secondary">
                      Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                    </Text>
                  </div>
                }
                styles={{ image: { height: 120 } }}
              >
                <Button
                  type="primary"
                  onClick={clearAllFilters}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </Empty>
            </div>
          ) : (
            <Row gutter={[24, 24]} style={{ padding: 24 }}>
              {podcasts.map((p, index) => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                      border: "none",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      height: "100%",
                    }}
                    onClick={() => navigate(`/podcast/${p.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 32px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(0,0,0,0.08)";
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={p.title}
                          src={p.cover_image || "/default_cover.jpg"}
                          style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                          }}
                        />
                        <Badge
                          count={index + 1}
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {formatTime(p.duration_sec)}
                        </div>
                      </div>
                    }
                    styles={{ body: { padding: 20 } }}
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Tooltip title={p.title}>
                        <Title
                          level={5}
                          ellipsis={{ rows: 2 }}
                          style={{
                            margin: 0,
                            lineHeight: 1.4,
                            minHeight: 44,
                          }}
                        >
                          {p.title}
                        </Title>
                      </Tooltip>

                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{
                          margin: 0,
                          color: "#666",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {p.description || "Không có mô tả"}
                      </Paragraph>

                      <Space wrap size={[8, 8]} style={{ marginTop: 8 }}>
                        <Tag
                          icon={<EyeOutlined />}
                          style={{
                            background: "rgba(24, 144, 255, 0.1)",
                            color: "#1890ff",
                            border: "none",
                            borderRadius: 12,
                          }}
                        >
                          {p.view_count || 0}
                        </Tag>
                        <Tag
                          icon={<HeartOutlined />}
                          style={{
                            background: "rgba(255, 77, 79, 0.1)",
                            color: "#ff4d4f",
                            border: "none",
                            borderRadius: 12,
                          }}
                        >
                          {p.like_count || 0}
                        </Tag>
                      </Space>

                      <div style={{ marginTop: 8 }}>
                        <Space size="small">
                          <CalendarOutlined
                            style={{ color: "#999", fontSize: 12 }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {p.published_at
                              ? new Date(p.published_at).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "Chưa xuất bản"}
                          </Text>
                        </Space>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>

        {/* PAGINATION */}
        {total > limit && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              style={{
                background: "white",
                padding: "16px 24px",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              itemRender={(current, type, originalElement) => {
                if (type === "page") {
                  return (
                    <div
                      style={{
                        background:
                          current === page
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "transparent",
                        color: current === page ? "white" : "#666",
                        borderRadius: 8,
                        minWidth: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: current === page ? 600 : 400,
                      }}
                    >
                      {current}
                    </div>
                  );
                }
                return originalElement;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastLibrary;
