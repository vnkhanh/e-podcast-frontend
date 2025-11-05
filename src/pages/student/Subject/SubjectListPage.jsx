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
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { getAllSubjectsUser } from "../../../services/api_subject";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
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
  const [filterProgress, setFilterProgress] = useState("all"); // all | completed | inprogress | notstarted
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

  // Tìm tiến độ theo subject_id
  const getProgress = (subjectId) =>
    progress?.find((p) => p.subject_id === subjectId) || null;

  // Lọc môn học theo trạng thái tiến độ
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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        Khám phá các môn học
      </Title>

      {/* Bộ lọc */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Tìm theo tên môn học..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Space>
            <Text>Sắp xếp:</Text>
            <Select
              value={sort}
              onChange={handleSortChange}
              style={{ width: 160 }}
            >
              <Option value="az">A → Z</Option>
              <Option value="za">Z → A</Option>
            </Select>
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Space>
            <FilterOutlined />
            <Text>Lọc theo tiến độ:</Text>
            <Select
              value={filterProgress}
              onChange={handleFilterChange}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả môn học</Option>
              <Option value="completed">Đã hoàn thành</Option>
              <Option value="inprogress">Đang học</Option>
              <Option value="notstarted">Chưa học</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {/* Danh sách môn học */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" tip="Đang tải danh sách môn học..." />
        </div>
      ) : filteredSubjects.length === 0 ? (
        <Empty description="Không có môn học phù hợp" />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredSubjects.map((subject) => {
            const subjProgress = getProgress(subject.id);
            const percent = subjProgress
              ? Math.round(subjProgress.progress_percent)
              : null;

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => navigate(`/subjects/${subject.slug}`)}
                  cover={
                    <div
                      style={{
                        background: "linear-gradient(90deg, #6366f1, #3b82f6)",
                        color: "white",
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 40,
                      }}
                    >
                      <BookOutlined />
                    </div>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Tooltip title={subject.name}>
                      <Title level={4} ellipsis={{ tooltip: true }}>
                        {subject.name}
                      </Title>
                    </Tooltip>

                    <Text type="secondary">
                      {subject.chapters?.length || 0} chương
                    </Text>

                    {/* Hiển thị tiến độ học tập nếu có */}
                    {percent !== null && (
                      <>
                        <Progress
                          percent={percent}
                          strokeColor={percent === 100 ? "#52c41a" : "#1890ff"}
                          size="small"
                          status={percent === 100 ? "success" : "active"}
                          style={{ marginBottom: 4 }}
                        />
                        <Tag color={percent === 100 ? "green" : "blue"}>
                          {percent === 100
                            ? "Hoàn thành"
                            : `Đã hoàn thành ${subjProgress.completed}/${subjProgress.total_podcasts}`}
                        </Tag>
                      </>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

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
    </div>
  );
};

export default SubjectListPage;
