import React, { useState } from "react";
import { Row, Col, Card, Progress, Typography, Divider, Space } from "antd";
import { mockSubjects } from "../../utils/mockData";

const { Title, Text } = Typography;

const SubjectsSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section style={{ padding: "24px 0" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Môn học phổ biến
      </Title>

      <Row gutter={[16, 16]}>
        {mockSubjects.map((subject) => {
          const isHovered = hoveredCard === subject.id;

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
              <Card
                hoverable
                onMouseEnter={() => setHoveredCard(subject.id)}
                onMouseLeave={() => setHoveredCard(null)}
                cover={
                  <div
                    style={{
                      position: "relative",
                      height: 120,
                      overflow: "hidden",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  >
                    <img
                      alt={subject.name}
                      src={`/images/subjects/${subject.slug}.jpg`}
                      onError={(e) => {
                        e.target.src = "/images/subjects/default.jpg";
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                  </div>
                }
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                  transition: "all 0.3s ease",
                  height: "100%",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                    : "none",
                }}
              >
                <Card.Meta
                  title={subject.name}
                  description={
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text type="secondary">
                        {Math.floor(Math.random() * 20) + 5} chương
                      </Text>
                      <Progress
                        percent={Math.floor(Math.random() * 100)}
                        size="small"
                        showInfo={false}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {Math.floor(Math.random() * 1000) + 100} học viên
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <Divider style={{ marginTop: 32 }} />
    </section>
  );
};

export default SubjectsSection;
