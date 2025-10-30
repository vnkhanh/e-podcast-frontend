import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Spin, Button, Divider, Empty, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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

const SubjectsSection = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const navigate = useNavigate();

  const fetchPopularSubjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/subjects/popular`);
      const data = res.data?.data || [];
      setSubjects(data);
    } catch (err) {
      console.error("Lỗi khi tải môn học phổ biến:", err);
      message.error("Không thể tải danh sách môn học phổ biến");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularSubjects();
  }, []);

  const getRandomColor = (index) => pastelColors[index % pastelColors.length];
  const duplicatedSubjects = [...subjects, ...subjects, ...subjects];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || subjects.length === 0) return;

    const scrollWidth = container.scrollWidth / 3;
    container.scrollLeft = scrollWidth;

    const handleScroll = () => {
      if (container.scrollLeft >= scrollWidth * 2) {
        container.scrollLeft = scrollWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft = scrollWidth;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [subjects]);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || subjects.length === 0) return;

    autoScrollRef.current = setInterval(() => {
      handleScroll("right");
    }, 3000);

    return () => clearInterval(autoScrollRef.current);
  }, [subjects]);

  const handleMouseEnter = () => clearInterval(autoScrollRef.current);
  const handleMouseLeave = () => {
    autoScrollRef.current = setInterval(() => handleScroll("right"), 3000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spin size="large" tip="Đang tải môn học phổ biến..." />
      </div>
    );
  }

  return (
    <section
      style={{
        padding: "60px 20px",
        maxWidth: 1300,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Tiêu đề */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title
          level={2}
          style={{
            marginBottom: 8,
            fontWeight: 800,
            background: "linear-gradient(90deg, #6366f1, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Môn học phổ biến
        </Title>
        <Text
          style={{
            fontSize: 16,
            color: "#6b7280",
          }}
        >
          Khám phá những môn học được yêu thích nhất
        </Text>
      </div>

      {subjects.length === 0 ? (
        <Empty description="Chưa có môn học nào" />
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
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
            }}
          />

          {/* Container danh sách môn học */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollBehavior: "smooth",
              gap: 24,
              padding: "10px 0 20px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {duplicatedSubjects.map((subject, index) => (
              <Card
                key={`${subject.id}-${index}`}
                hoverable
                onClick={() => navigate(`/subjects/${subject.slug}`)}
                style={{
                  minWidth: 240,
                  height: 220,
                  borderRadius: 20,
                  textAlign: "center",
                  flex: "0 0 auto",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  background: getRandomColor(index),
                  border: "none",
                  position: "relative",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#1f2937",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 17,
                      textTransform: "capitalize",
                      marginBottom: 6,
                    }}
                  >
                    {subject.name}
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
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      )}

      <Divider style={{ marginTop: 60 }} />
    </section>
  );
};

export default SubjectsSection;
