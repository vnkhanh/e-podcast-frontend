import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Select,
  Pagination,
  Empty,
  Typography,
  Space,
  message,
  Button,
  Tag,
  Avatar,
  Divider,
  Badge,
  Skeleton,
} from "antd";
import { getCategoriesUser } from "../../../services/api_category";
import {
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  AppstoreOutlined,
  BookOutlined,
  FilterOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Card hiển thị từng danh mục (memo để tránh render lại không cần thiết)
const CategoryCard = React.memo(({ cat, index, navigate }) => (
  <Col key={cat.id} xs={24} sm={12} md={8} lg={6} xl={4}>
    <Card
      hoverable
      style={{
        borderRadius: 16,
        border: "none",
        transition: "all 0.3s ease",
        overflow: "hidden",
        height: "100%",
      }}
      onClick={() => navigate(`/categories/${cat.slug}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
      }}
      styles={{ body: { padding: 20, textAlign: "center" } }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
          }}
        >
          <AppstoreOutlined style={{ fontSize: 32, color: "white" }} />
        </div>

        <div>
          <Badge
            count={index + 1}
            style={{
              backgroundColor: "#667eea",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
              marginBottom: 8,
              margin: "0 auto",
              padding: "0 auto",
            }}
          />

          <Title
            level={5}
            ellipsis={{ tooltip: cat.name }}
            style={{
              margin: "8px 0 4px 0",
              lineHeight: 1.4,
              minHeight: 44,
            }}
          >
            {cat.name}
          </Title>

          {cat.description && (
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{
                margin: 0,
                color: "#666",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {cat.description}
            </Paragraph>
          )}
        </div>

        <Button
          type="primary"
          size="small"
          icon={<ArrowRightOutlined />}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 8,
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/categories/${cat.slug}`);
          }}
        >
          Khám phá
        </Button>
      </Space>
    </Card>
  </Col>
));

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);

  // debounce search input (mượt hơn, chỉ gọi API khi user ngừng gõ 400ms)
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // gọi API
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategoriesUser({
        search: debouncedSearch,
        sort,
        page,
        limit,
      });
      setCategories(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort, page, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Avatar
                size={64}
                icon={<AppstoreOutlined />}
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
                  Khám phá danh mục
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  {total} danh mục đang chờ bạn khám phá
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
                <AppstoreOutlined style={{ marginRight: 4 }} />
                {total || 0} danh mục
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
                Trang {page || 1}
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
            <Col xs={24} md={12}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm danh mục..."
                allowClear
                size="large"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
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
                  onChange={(value) => setSort(value)}
                  size="large"
                  style={{ width: 200, borderRadius: 12 }}
                  suffixIcon={
                    sort === "asc" ? (
                      <SortAscendingOutlined />
                    ) : (
                      <SortDescendingOutlined />
                    )
                  }
                >
                  <Option value="asc">A → Z</Option>
                  <Option value="desc">Z → A</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* GRID */}
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
              <AppstoreOutlined style={{ color: "#667eea" }} /> Danh sách danh
              mục
            </Title>
            <Divider style={{ margin: "16px 0" }} />
          </div>

          {loading ? (
            <Row gutter={[24, 24]} style={{ padding: 24 }}>
              {[...Array(6)].map((_, i) => (
                <Col key={i} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Card style={{ borderRadius: 16 }}>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : categories.length === 0 ? (
            <div style={{ padding: 60 }}>
              <Empty
                description={
                  <div>
                    <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
                      Không tìm thấy danh mục
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
                  onClick={() => {
                    setSearch("");
                    setSort("asc");
                    setPage(1);
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
              {categories.map((cat, index) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  index={index}
                  navigate={navigate}
                />
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

export default CategoryList;
