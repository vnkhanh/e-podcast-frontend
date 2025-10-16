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
} from "antd";
import axios from "axios";
import { EyeInvisibleOutlined } from "@ant-design/icons";

const { Title } = Typography;
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

  // Hàm load dữ liệu từ API
  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/user/categories/${slug}/podcasts`,
        {
          params: { page, limit, sort, search },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("res:", res);
      console.log("res.data:", res.data);

      setCategory(res.data.category);
      setPodcasts(res.data.podcasts);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      console.error("Lỗi tải podcast:", err);
      message.error("Không thể tải danh sách podcast");
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi lại khi slug / page / sort / search thay đổi
  useEffect(() => {
    fetchPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, page, sort, search]);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );

  return (
    <div style={{ padding: "60px 40px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        {category?.name}
      </Title>

      {/* Bộ lọc */}
      <Space style={{ marginBottom: 24 }} size="middle" wrap>
        <Search
          placeholder="Tìm kiếm podcast..."
          onSearch={(value) => setSearch(value.trim())}
          allowClear
          enterButton
          style={{ width: 300 }}
        />

        <Select
          value={sort}
          onChange={(value) => setSort(value)}
          style={{ width: 180 }}
        >
          <Option value="latest">Mới nhất</Option>
          <Option value="popular">Phổ biến nhất</Option>
          <Option value="duration">Thời lượng dài nhất</Option>
        </Select>
      </Space>

      {/* Danh sách podcast */}
      {!podcasts || podcasts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          Chưa có podcast nào.
        </p>
      ) : (
        <Row gutter={[24, 24]}>
          {podcasts.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                title={<strong>{p.title}</strong>}
                cover={
                  <img
                    alt={p.title}
                    src={p.cover_image || "/default-cover.jpg"}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                }
              >
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  {p.description
                    ? p.description.slice(0, 80) + "..."
                    : "Không có mô tả"}
                </p>
                <p style={{ color: "#999", fontSize: "0.8rem" }}>
                  👁 {p.view_count} lượt xem
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Phân trang */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default CategoryPodcastsPage;
