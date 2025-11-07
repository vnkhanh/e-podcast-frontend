import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Space,
  message,
  Tag,
  Tooltip,
  Select,
  Spin,
  Typography,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  HeartFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { listPodcasts, deletePodcast } from "../../../services/api_podcast";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PodcastPage = () => {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "" | "published" | "draft"
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  // Lấy danh sách podcast
  const fetchData = async (
    page = 1,
    limit = 12,
    searchText = "",
    statusValue = status
  ) => {
    setLoading(true);
    try {
      const res = await listPodcasts({
        page,
        limit,
        search: searchText,
        status: statusValue,
      });
      setPodcasts(res.data);
      setPagination({
        current: res.page,
        pageSize: res.limit,
        total: res.total,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách podcast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, search, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Tìm kiếm
  const handleSearch = (value) => {
    setSearch(value);
    fetchData(1, pagination.pageSize, value, status);
  };

  // Xóa podcast
  const handleDelete = async (id) => {
    try {
      await deletePodcast(id);
      message.success("Xóa podcast thành công");
      fetchData(pagination.current, pagination.pageSize, search);
    } catch (error) {
      console.error(error);
      message.error("Xóa podcast thất bại");
    }
  };

  // Phân trang
  const handlePageChange = (page) => {
    fetchData(page, pagination.pageSize, search, status);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            Quản lý Podcast
          </Title>
          <Text type="secondary">Tạo và quản lý podcast của bạn</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchData()}>
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/teacher/podcast/create")}
            >
              Thêm podcast
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Thanh công cụ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <Search
            placeholder="Tìm kiếm podcast..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            allowClear
            enterButton
            style={{ width: 320, marginRight: 10 }}
          />

          {/* Lọc trạng thái */}
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            onChange={(value) => {
              setStatus(value || "");
            }}
            style={{ width: 160 }}
          >
            <Option value="published">Đã xuất bản</Option>
            <Option value="draft">Bản nháp</Option>
          </Select>
        </div>
      </div>

      {/* Danh sách podcast */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {podcasts.map((podcast) => (
            <Col key={podcast.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: 16 }}
                cover={
                  <div style={{ position: "relative" }}>
                    {podcast.cover_image ? (
                      <div style={{ height: 160, overflow: "hidden" }}>
                        <img
                          alt={podcast.title}
                          src={podcast.cover_image}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: 160,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                          color: "#666",
                        }}
                      >
                        <Text type="secondary">Không có ảnh bìa</Text>
                      </div>
                    )}

                    {/* Tag status ở góc trên bên phải ảnh */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}
                    >
                      <Tag
                        color={
                          podcast.status === "published"
                            ? "green"
                            : podcast.status === "draft"
                            ? "orange"
                            : "default"
                        }
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: "12px",
                          border: "none",
                          borderRadius: "12px",
                          padding: "2px 8px",
                        }}
                      >
                        {podcast.status === "published"
                          ? "Đã xuất bản"
                          : podcast.status === "draft"
                          ? "Bản nháp"
                          : "—"}
                      </Tag>
                    </div>
                  </div>
                }
                actions={[
                  <Tooltip title="Xem chi tiết">
                    <Button
                      type="text"
                      icon={<EyeOutlined style={{ fontSize: 18 }} />}
                      onClick={() => navigate(`/teacher/podcast/${podcast.id}`)}
                      style={{ color: "#1890ff" }}
                    />
                  </Tooltip>,
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="text"
                      icon={<EditOutlined style={{ fontSize: 18 }} />}
                      onClick={() =>
                        navigate(`/teacher/podcast/${podcast.id}/edit`)
                      }
                      style={{ color: "#52c41a" }}
                    />
                  </Tooltip>,

                  <Tooltip title="Xóa">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                      onClick={() => handleDelete(podcast.id)}
                    />
                  </Tooltip>,
                ]}
              >
                {/* Tiêu đề podcast */}
                <div>
                  <Paragraph
                    strong
                    ellipsis={{
                      rows: 1, // Giới hạn 2 dòng
                      expandable: false,
                      tooltip: podcast.title, // Hiện tooltip tự động
                    }}
                    style={{ marginBottom: 0 }}
                  >
                    {podcast.title}
                  </Paragraph>
                </div>

                {/* Thống kê */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <EyeFilled style={{ color: "#1890ff", fontSize: 14 }} />
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      {podcast.view_count || 0}
                    </Text>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <HeartFilled style={{ color: "#ff4d4f", fontSize: 14 }} />
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      {podcast.like_count || 0}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}

          {/* Empty state */}
          {!loading && podcasts.length === 0 && (
            <Col span={24}>
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  background: "#fafafa",
                  borderRadius: 8,
                  border: "1px dashed #d9d9d9",
                }}
              >
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {search
                    ? "Không tìm thấy podcast nào"
                    : "Chưa có podcast nào"}
                </Text>
                <br />
                {!search && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/teacher/podcast/create")}
                    style={{ marginTop: 16 }}
                  >
                    Tạo podcast đầu tiên
                  </Button>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Spin>

      {/* Phân trang */}
      {podcasts.length > 0 && (
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
            padding: "16px 0",
          }}
        >
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} podcast`
            }
          />
        </div>
      )}
    </div>
  );
};

export default PodcastPage;
