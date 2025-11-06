import React, { useEffect, useState } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Typography,
  Progress,
  Space,
  Select,
  Pagination,
  Spin,
  message,
  Tag,
  Tooltip,
  Empty,
  Button,
  Avatar,
  Divider,
  Badge,
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  UserOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { getAllSubjectsUser } from "../../../services/api_subject";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SubjectListPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [progress, setProgress] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 1,
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [filterProgress, setFilterProgress] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async (
    page = 1,
    limit = 8,
    searchText = "",
    sortType = "az"
  ) => {
    try {
      setLoading(true);
      const data = await getAllSubjectsUser({
        page,
        limit,
        search: searchText,
        sort: sortType,
      });
      if (data) {
        setSubjects(data.subjects || []);
        setProgress(data.progress || []);
        setPagination(data.pagination || {});
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects(pagination.page, pagination.limit, search, sort);
    // eslint-disable-next-line
  }, [sort]);

  const handleSearch = (value) => {
    setSearch(value);
    fetchSubjects(1, pagination.limit, value, sort);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handlePageChange = (page) => {
    fetchSubjects(page, pagination.limit, search, sort);
  };

  const handleFilterChange = (value) => {
    setFilterProgress(value);
  };

  const getProgress = (subjectId) =>
    progress?.find((p) => p.subject_id === subjectId) || null;

  const filteredSubjects = subjects.filter((subject) => {
    const subjProgress = getProgress(subject.id);
    const percent = subjProgress ? subjProgress.progress_percent : 0;

    switch (filterProgress) {
      case "completed":
        return percent === 100;
      case "inprogress":
        return percent > 0 && percent < 100;
      case "notstarted":
        return percent === 0;
      default:
        return true;
    }
  });

  const getProgressColor = (percent) => {
    if (percent === 100)
      return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.1)" };
    if (percent > 0) return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.1)" };
    return { color: "#d9d9d9", bg: "rgba(217, 217, 217, 0.1)" };
  };

  const getProgressIcon = (percent) => {
    if (percent === 100) return <CheckCircleOutlined />;
    if (percent > 0) return <ClockCircleOutlined />;
    return <RocketOutlined />;
  };

  const getProgressText = (percent, progressData) => {
    if (percent === 100) return " Hoàn thành";
    if (percent > 0)
      return ` Đang học • ${progressData.completed}/${progressData.total_podcasts}`;
    return " Bắt đầu học";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
      }}
    >
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
                icon={<BookOutlined />}
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
                  Khám phá môn học
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  {pagination.total} môn học đang chờ bạn khám phá
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
                <BookOutlined style={{ marginRight: 4 }} />
                {pagination.total} môn học
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
                Trang {pagination.page}
              </Tag>
            </Space>
          </div>
        </Card>

        {/* FILTER SECTION */}
        <Card
          style={{
            marginBottom: 32,
            borderRadius: 20,
            border: "none",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            background: "inherit",
          }}
          bodyStyle={{ padding: 24 }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Tìm kiếm môn học..."
                prefix={<SearchOutlined />}
                size="large"
                allowClear
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={(e) => handleSearch(e.target.value)}
                style={{
                  borderRadius: 12,
                }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Space size="middle">
                <Text strong style={{ fontSize: 14 }}>
                  Sắp xếp:
                </Text>
                <Select
                  value={sort}
                  onChange={handleSortChange}
                  size="large"
                  style={{ width: 160, borderRadius: 12 }}
                  suffixIcon={<ArrowRightOutlined />}
                >
                  <Option value="az">A → Z</Option>
                  <Option value="za">Z → A</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space size="middle">
                <FilterOutlined style={{ color: "#667eea" }} />
                <Text strong style={{ fontSize: 14 }}>
                  Lọc theo:
                </Text>
                <Select
                  value={filterProgress}
                  onChange={handleFilterChange}
                  size="large"
                  style={{ width: 180, borderRadius: 12 }}
                >
                  <Option value="all">Tất cả môn học</Option>
                  <Option value="completed">Đã hoàn thành</Option>
                  <Option value="inprogress">Đang học</Option>
                  <Option value="notstarted">Chưa học</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* SUBJECTS LIST */}
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            overflow: "hidden",
            marginBottom: 32,
            background: "inherit",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: 24 }}>
            <Title
              level={3}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Danh sách môn học
            </Title>
            <Divider style={{ margin: "16px 0" }} />
          </div>

          {loading ? (
            <div style={{ padding: 80, textAlign: "center" }}>
              <Spin
                size="large"
                tip={
                  <Text style={{ fontSize: 16, marginTop: 16 }}>
                    Đang tải danh sách môn học...
                  </Text>
                }
              />
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div style={{ padding: 60 }}>
              <Empty
                description={
                  <div>
                    <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
                      Không tìm thấy môn học phù hợp
                    </Title>
                    <Text type="secondary">
                      Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                    </Text>
                  </div>
                }
                imageStyle={{ height: 120 }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setSearch("");
                    setFilterProgress("all");
                    fetchSubjects(1, pagination.limit, "", sort);
                  }}
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
              {filteredSubjects.map((subject) => {
                const subjProgress = getProgress(subject.id);
                const percent = subjProgress
                  ? Math.round(subjProgress.progress_percent)
                  : 0;
                const progressInfo = getProgressColor(percent);

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
                    {/*Môn học*/}
                    <Card
                      hoverable
                      style={{
                        borderRadius: 16,
                        border: "none",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                        height: "100%",
                      }}
                      onClick={() => navigate(`/subjects/${subject.slug}`)}
                      cover={
                        <div style={{ position: "relative" }}>
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              height: 140,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            <BookOutlined
                              style={{ fontSize: 48, opacity: 0.9 }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: 12,
                                right: 12,
                              }}
                            >
                              <Tag
                                style={{
                                  background: "rgba(255,255,255,0.2)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: 12,
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                {subject.chapters?.length || 0} chương
                              </Tag>
                            </div>
                          </div>
                        </div>
                      }
                      bodyStyle={{ padding: 20 }}
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
                    >
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <Tooltip title={subject.name}>
                          <Title
                            level={5}
                            ellipsis={{ rows: 2 }}
                            style={{
                              margin: 0,
                              lineHeight: 1.4,
                              minHeight: 44,
                              color: "#2c3e50",
                            }}
                          >
                            {subject.name}
                          </Title>
                        </Tooltip>

                        {/* PROGRESS SECTION */}
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {getProgressIcon(percent)}
                              {getProgressText(
                                percent,
                                subjProgress || {
                                  completed: 0,
                                  total_podcasts: 0,
                                }
                              )}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: 12,
                                color: progressInfo.color,
                              }}
                            >
                              {percent}%
                            </Text>
                          </div>
                          <Progress
                            percent={percent}
                            size="small"
                            strokeColor={{
                              "0%": progressInfo.color,
                              "100%": progressInfo.color,
                            }}
                            trailColor="#f0f0f0"
                            showInfo={false}
                          />
                        </div>

                        <Button
                          type="text"
                          icon={<PlayCircleOutlined />}
                          style={{
                            color: "#667eea",
                            padding: 0,
                            height: "auto",
                            fontWeight: 600,
                            marginTop: 8,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/subjects/${subject.slug}`);
                          }}
                        >
                          Bắt đầu học
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Card>

        {/* PAGINATION */}
        {pagination.total > pagination.limit && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
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
                          current === pagination.page
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "transparent",
                        color: current === pagination.page ? "white" : "#666",
                        borderRadius: 8,
                        minWidth: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: current === pagination.page ? 600 : 400,
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

export default SubjectListPage;
