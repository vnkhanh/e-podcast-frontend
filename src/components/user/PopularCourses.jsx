import React from "react";
import { Row, Col, Card, Button, Typography, Rate, Progress, Tag } from "antd";
import { StarFilled } from "@ant-design/icons";
const { Title, Text } = Typography;

const PopularCourses = () => {
  const courses = [
    {
      title: "Khóa học Tiếng Anh Giao Tiếp",
      instructor: "Cô Sarah Johnson",
      progress: 65,
      rating: 4.9,
      students: 12500,
      duration: "12 giờ",
      level: "Cơ bản",
      image: "https://via.placeholder.com/300x200?text=Tiếng+Anh",
    },
    {
      title: "Lập trình Web từ Zero đến Hero",
      instructor: "Thầy Minh DevOps",
      progress: 30,
      rating: 4.8,
      students: 8900,
      duration: "24 giờ",
      level: "Trung cấp",
      image: "https://via.placeholder.com/300x200?text=Lập+Trình",
    },
    {
      title: "Kỹ năng Thuyết trình Chuyên nghiệp",
      instructor: "TS. Nguyễn Thu Hà",
      progress: 0,
      rating: 4.7,
      students: 6700,
      duration: "8 giờ",
      level: "Mọi trình độ",
      image: "https://via.placeholder.com/300x200?text=Thuyết+Trình",
    },
    {
      title: "Data Science cho Người mới bắt đầu",
      instructor: "GS. Trần Văn Bảo",
      progress: 0,
      rating: 4.9,
      students: 10200,
      duration: "18 giờ",
      level: "Cơ bản",
      image: "https://via.placeholder.com/300x200?text=Data+Science",
    },
  ];

  return (
    <div style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 60 }}>
          Khóa học phổ biến
        </Title>

        <Row gutter={[24, 24]}>
          {courses.map((course, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      position: "relative",
                      height: 200,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt={course.title}
                      src={course.image}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Tag
                      color="red"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: "bold",
                      }}
                    >
                      <StarFilled /> Bestseller
                    </Tag>
                  </div>
                }
                bodyStyle={{ padding: 16 }}
              >
                <Title level={4} style={{ marginBottom: 8, fontSize: 16 }}>
                  {course.title}
                </Title>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 12, fontSize: 14 }}
                >
                  Bởi {course.instructor}
                </Text>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text strong style={{ color: "#ffa940", fontSize: 16 }}>
                    {course.rating}
                  </Text>
                  <Rate
                    disabled
                    defaultValue={course.rating}
                    style={{ fontSize: 14, margin: "0 8px" }}
                  />
                  <Text type="secondary">({course.students})</Text>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text type="secondary">Thời lượng: {course.duration}</Text>
                    <Tag color="blue">{course.level}</Tag>
                  </div>
                </div>

                {course.progress > 0 ? (
                  <div style={{ marginBottom: 16 }}>
                    <Progress
                      percent={course.progress}
                      size="small"
                      status="active"
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tiến độ của bạn
                    </Text>
                  </div>
                ) : null}

                <Button type="primary" block>
                  {course.progress > 0 ? "Tiếp tục học" : "Bắt đầu ngay"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Button type="primary" size="large">
            Xem tất cả khóa học
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
