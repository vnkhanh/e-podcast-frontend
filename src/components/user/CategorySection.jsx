import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Spin, message } from "antd";
import {
  BookOutlined,
  CodeOutlined,
  BulbOutlined,
  GlobalOutlined,
  LineChartOutlined,
  HeartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { listCategoriesUser } from "../../services/api_category";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const iconList = [
  <BookOutlined />,
  <CodeOutlined />,
  <BulbOutlined />,
  <GlobalOutlined />,
  <LineChartOutlined />,
  <HeartOutlined />,
  <TagOutlined />,
];

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await listCategoriesUser();
        setCategories(res);
      } catch (err) {
        message.error("Không thể tải danh mục");
        console.error("Lỗi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: "60px 40px", textAlign: "center" }}>
      <Title level={2} style={{ marginBottom: 40 }}>
        Danh mục nổi bật
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {categories.map((category, index) => (
            <Col key={category.id} xs={12} sm={8} lg={4}>
              <Card
                hoverable
                bordered={false}
                onClick={() => navigate(`/categories/${category.slug}`)}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                cover={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 100,
                    }}
                  >
                    {React.cloneElement(iconList[index % iconList.length], {
                      style: { fontSize: 36, color: "#1677ff" },
                    })}
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                      {category.name}
                    </span>
                  }
                  description={
                    <span style={{ color: "#888", fontSize: "0.9rem" }}>
                      {category.podcast_count} podcast
                    </span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CategorySection;
