import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Divider, Spin, Empty } from "antd";
import { listCategoriesUser } from "../../../services/api_category";

const { Title, Text } = Typography;

const pastelColors = [
  "#E3F2FD", // Xanh nhạt
  "#FCE4EC", // Hồng pastel
  "#FFF3E0", // Cam nhạt
  "#E8F5E9", // Xanh lá nhạt
  "#F3E5F5", // Tím nhạt
  "#E0F7FA", // Xanh ngọc
  "#FFFDE7", // Vàng nhạt
  "#F1F8E9", // Xanh lime nhẹ
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategoriesUser();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getRandomColor = (index) => pastelColors[index % pastelColors.length];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Title level={2} style={{ marginBottom: 4, fontWeight: 700 }}>
          Danh mục nổi bật
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Khám phá các danh mục podcast đa dạng
        </Text>
      </div>

      {categories.length === 0 ? (
        <Empty description="Chưa có danh mục nào" />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {categories.map((category, index) => (
            <Col xs={12} sm={8} md={6} lg={5} key={category.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  textAlign: "center",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.05)";
                }}
              >
                <div
                  style={{
                    height: 100,
                    backgroundColor: getRandomColor(index),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#333",
                  }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ padding: "12px 8px" }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {category.name}
                  </Text>
                  <div style={{ marginTop: 6 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {category.podcast_count} podcast
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Divider />
    </section>
  );
};

export default CategoriesSection;
