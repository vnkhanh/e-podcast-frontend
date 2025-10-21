// src/components/HomePage/components/SubjectsSection/SubjectsSection.js
import React from "react";
import { Row, Col, Card, Progress, Typography, Divider, Space } from "antd";
import { mockSubjects } from "../../../utils/mockData";
import "./SubjectsSection.css";

const { Title, Text } = Typography;

const SubjectsSection = () => {
  return (
    <section className="section">
      <Title level={2}>Môn học phổ biến</Title>
      <Row gutter={[16, 16]}>
        {mockSubjects.map((subject) => (
          <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
            <Card
              hoverable
              className="subject-card"
              cover={
                <div className="subject-cover">
                  <img
                    alt={subject.name}
                    src={`/images/subjects/${subject.slug}.jpg`}
                    onError={(e) => {
                      e.target.src = "/images/subjects/default.jpg";
                    }}
                  />
                </div>
              }
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
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {Math.floor(Math.random() * 1000) + 100} học viên
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Divider />
    </section>
  );
};

export default SubjectsSection;
