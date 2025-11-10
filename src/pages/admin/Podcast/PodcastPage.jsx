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
  DatePicker,
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
const { RangePicker } = DatePicker;

const PodcastPage = () => {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  // ==================== FETCH DATA ====================
  const fetchData = async (
    page = 1,
    limit = pagination.pageSize,
    searchText = search,
    statusValue = status,
    range = dateRange
  ) => {
    setLoading(true);
    try {
      const query = {
        page,
        limit,
        search: searchText,
        status: statusValue,
      };

      if (range?.length === 2) {
        query.start_date = range[0].format("YYYY-MM-DD");
        query.end_date = range[1].format("YYYY-MM-DD");
      }

      const res = await listPodcasts(query);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, dateRange]);

  const handleSearch = (value) => {
    setSearch(value);
    fetchData(1, pagination.pageSize, value, status);
  };

  const handleDelete = async (id) => {
    try {
      await deletePodcast(id);
      message.success("Xóa podcast thành công");
      fetchData(pagination.current);
    } catch (error) {
      console.error(error);
      message.error("Xóa podcast thất bại");
    }
  };

  const handlePageChange = (page, pageSize) => {
    fetchData(page, pageSize);
  };

  // ==================== UI ====================
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

      {/* Thanh công cụ lọc */}
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
        <Space wrap>
          {/* Ô tìm kiếm */}
          <Search
            placeholder="Tìm kiếm podcast..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            allowClear
            enterButton
            style={{ width: 320 }}
          />

          {/* Lọc trạng thái */}
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            value={status || undefined}
            onChange={(value) => setStatus(value || "")}
            style={{ width: 160 }}
          >
            <Option value="published">Đã xuất bản</Option>
            <Option value="draft">Bản nháp</Option>
          </Select>

          {/* Lọc theo ngày tạo */}
          <RangePicker
            allowClear
            value={dateRange}
            onChange={(range) => setDateRange(range || [])}
            format="YYYY-MM-DD"
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Space>
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
                <Paragraph
                  strong
                  ellipsis={{
                    rows: 1,
                    expandable: false,
                    tooltip: podcast.title,
                  }}
                  style={{ marginBottom: 0 }}
                >
                  {podcast.title}
                </Paragraph>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginTop: 8,
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

          {!loading && podcasts.length === 0 && (
            <Col span={24}>
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  borderRadius: 8,
                  border: "1px dashed #d9d9d9",
                }}
              >
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {
                    (search,
                    dateRange,
                    status
                      ? "Không tìm thấy podcast nào"
                      : "Chưa có podcast nào")
                  }
                </Text>
                <br />
                {!search ||
                  !dateRange ||
                  (!status && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => navigate("/teacher/podcast/create")}
                      style={{ marginTop: 16 }}
                    >
                      Tạo podcast đầu tiên
                    </Button>
                  ))}
              </div>
            </Col>
          )}
        </Row>
      </Spin>

      {/* Phân trang động */}
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
            onShowSizeChange={handlePageChange}
            showSizeChanger
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
