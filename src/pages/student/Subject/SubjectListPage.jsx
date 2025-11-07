import React, { useEffect, useState, useCallback } from "react";
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
  message,
  Tag,
  Tooltip,
  Empty,
  Button,
  Avatar,
  Divider,
  Skeleton,
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { getAllSubjectsUser } from "../../../services/api_subject";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

// Component hiển thị card môn học riêng, được memo để tránh render lại
const SubjectCard = React.memo(({ subject, progress, navigate }) => {
  const percent = progress ? Math.round(progress.progress_percent) : 0;
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
  const getProgressText = (percent, p) => {
    if (percent === 100) return " Hoàn thành";
    if (percent > 0) return ` Đang học • ${p.completed}/${p.total_podcasts}`;
    return " Bắt đầu học";
  };

  const info = getProgressColor(percent);

  return (
    <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
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
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
        }}
        cover={
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <BookOutlined style={{ fontSize: 48, opacity: 0.9 }} />
              <div style={{ position: "absolute", bottom: 12, right: 12 }}>
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
      >
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Tooltip title={subject.name}>
            <Title
              level={5}
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, lineHeight: 1.4, minHeight: 44 }}
            >
              {subject.name}
            </Title>
          </Tooltip>

          {/* Tiến độ */}
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
                  progress || { completed: 0, total_podcasts: 0 }
                )}
              </Text>
              <Text strong style={{ fontSize: 12, color: info.color }}>
                {percent}%
              </Text>
            </div>
            <Progress
              percent={percent}
              size="small"
              strokeColor={info.color}
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
});

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [filterProgress, setFilterProgress] = useState("all");
  const [loading, setLoading] = useState(false);

  // debounce input search (400ms)
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSubjectsUser({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        sort,
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
  }, [debouncedSearch, sort, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

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

  return (
    <div style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER */}
        <Card
          style={{
            marginBottom: 32,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 20,
            color: "white",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 32 }}>
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
                {subjects?.length || 0} môn học
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
                Trang {pagination.page || 1}
              </Tag>
            </Space>
          </div>
        </Card>

        {/* FILTER */}
        <Card
          style={{
            marginBottom: 32,
            borderRadius: 20,
            background: "inherit",
            border: "none",
          }}
          styles={{ body: { padding: 24 } }}
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
                style={{ borderRadius: 12 }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Space size="middle">
                <Text strong style={{ fontSize: 14 }}>
                  Sắp xếp:
                </Text>
                <Select
                  value={sort}
                  onChange={(v) => setSort(v)}
                  size="large"
                  style={{ width: 160 }}
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
                  onChange={(v) => setFilterProgress(v)}
                  size="large"
                  style={{ width: 180 }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="inprogress">Đang học</Option>
                  <Option value="notstarted">Chưa học</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* LIST */}
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
          <div style={{ padding: 24 }}>
            <Title level={3}>
              <AppstoreOutlined style={{ color: "#667eea" }} /> Danh sách môn
              học
            </Title>
            <Divider style={{ margin: "16px 0" }} />
          </div>
          {loading ? (
            <Row gutter={[24, 24]} style={{ padding: 24 }}>
              {[...Array(8)].map((_, i) => (
                <Col key={i} xs={24} sm={12} md={8} lg={6}>
                  <Card style={{ borderRadius: 16 }}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : filteredSubjects.length === 0 ? (
            <Empty
              description="Không tìm thấy môn học phù hợp"
              style={{ padding: 60 }}
            />
          ) : (
            <Row gutter={[24, 24]} style={{ padding: 24 }}>
              {filteredSubjects.map((s) => (
                <SubjectCard
                  key={s.id}
                  subject={s}
                  progress={progress.find((p) => p.subject_id === s.id)}
                  navigate={navigate}
                />
              ))}
            </Row>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SubjectListPage;
