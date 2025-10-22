import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Spin, Empty, Button, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { listCategoriesUser } from "../../services/api_category";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const pastelColors = [
  "#E3F2FD",
  "#FCE4EC",
  "#FFF3E0",
  "#E8F5E9",
  "#F3E5F5",
  "#E0F7FA",
  "#FFFDE7",
  "#F1F8E9",
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const navigate = useNavigate();

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

  // Nhân đôi/triple danh mục để tạo hiệu ứng vòng lặp vô hạn
  const duplicatedCategories = [...categories, ...categories, ...categories];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || categories.length === 0) return;

    const scrollWidth = container.scrollWidth / 3; // tổng chiều rộng của 1 vòng danh mục
    container.scrollLeft = scrollWidth; // bắt đầu ở giữa

    const handleScroll = () => {
      if (container.scrollLeft >= scrollWidth * 2) {
        container.scrollLeft = scrollWidth; // reset giữa
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft = scrollWidth;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto scroll mượt mỗi 3 giây
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || categories.length === 0) return;

    autoScrollRef.current = setInterval(() => {
      handleScroll("right");
    }, 3000);

    return () => clearInterval(autoScrollRef.current);
  }, [categories]);

  // Dừng auto-scroll khi hover, chạy lại khi rời chuột
  const handleMouseEnter = () => clearInterval(autoScrollRef.current);
  const handleMouseLeave = () => {
    autoScrollRef.current = setInterval(() => handleScroll("right"), 3000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section
      style={{
        padding: "40px 20px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Tiêu đề */}
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
        <div
          style={{ position: "relative" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Nút trái */}
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={() => handleScroll("left")}
            style={{
              position: "absolute",
              left: -10,
              top: "40%",
              zIndex: 5,
              boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
            }}
          />

          {/* Container danh mục */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollBehavior: "smooth",
              gap: 16,
              padding: "10px 0",
              scrollbarWidth: "none",
            }}
          >
            {duplicatedCategories.map((category, index) => (
              <Card
                key={`${category.id}-${index}`}
                hoverable
                onClick={() => navigate(`/categories/${category.slug}`)}
                style={{
                  minWidth: 250,
                  borderRadius: 12,
                  textAlign: "center",
                  flex: "0 0 auto",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
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
                      {category.count} podcast
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Nút phải */}
          <Button
            shape="circle"
            icon={<RightOutlined />}
            onClick={() => handleScroll("right")}
            style={{
              position: "absolute",
              right: -10,
              top: "40%",
              zIndex: 5,
              boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
            }}
          />
        </div>
      )}

      <Divider />
    </section>
  );
};

export default CategoriesSection;
