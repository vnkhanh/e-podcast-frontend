import React from "react";
import { Card, Tag, Space, Typography, Alert, Button } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const PodcastAssignments = ({ assignments, token }) => {
  const navigate = useNavigate();

  const handleClick = (ass) => {
    if (!token) {
      // Nếu chưa đăng nhập
      navigate("/auth/login");
      return;
    }
    // Chuyển sang trang chi tiết bài tập
    navigate(`/assignment/${ass.id}`);
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "none",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Title
        level={4}
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ReadOutlined style={{ color: "#667eea" }} />
        Bài tập
      </Title>

      <Paragraph style={{ color: "#666", marginBottom: 20 }}>
        Danh sách bài tập của podcast này.
      </Paragraph>

      {assignments.length === 0 ? (
        <Alert
          message="Chưa có bài tập nào cho podcast này."
          type="info"
          showIcon
          style={{ borderRadius: 8 }}
        />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          {assignments.map((ass) => (
            <Card
              key={ass.id}
              hoverable
              onClick={() => handleClick(ass)}
              style={{
                borderRadius: 12,
                background: "#fafafa",
                border: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space
                  align="center"
                  style={{ justifyContent: "space-between" }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    {ass.title}
                  </Title>

                  <Tag color={ass.is_published ? "green" : "orange"}>
                    {ass.is_published ? "Đã công bố" : "Chưa công bố"}
                  </Tag>
                </Space>
              </Space>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  );
};

export default PodcastAssignments;
