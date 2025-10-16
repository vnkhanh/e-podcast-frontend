import React from "react";
import { Row, Col, Card, Avatar, Typography } from "antd";
const { Title, Paragraph, Text } = Typography;

const Testimonials = () => {
  const testimonials = [
    {
      name: "Nguyễn Thị Hương",
      role: "Sinh viên Đại học",
      content:
        "E-podcast đã thay đổi cách học của tôi hoàn toàn. Tôi có thể học mọi lúc, mọi nơi chỉ với chiếc điện thoại.",
      avatar: "https://via.placeholder.com/80x80?text=H",
    },
    {
      name: "Trần Văn Nam",
      role: "Kỹ sư phần mềm",
      content:
        "Những podcast về công nghệ giúp tôi cập nhật xu hướng mới nhất mà không mất quá nhiều thời gian.",
      avatar: "https://via.placeholder.com/80x80?text=N",
    },
    {
      name: "Lê Minh Anh",
      role: "Giáo viên",
      content:
        "Tôi đã giới thiệu E-podcast cho nhiều học sinh của mình. Các em rất thích cách học mới mẻ này.",
      avatar: "https://via.placeholder.com/80x80?text=A",
    },
  ];

  return (
    <div style={{ padding: "80px 24px", background: "#f9f9f9" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 60 }}>
          Học viên nói gì về chúng tôi
        </Title>

        <Row gutter={[24, 24]}>
          {testimonials.map((testimonial, index) => (
            <Col xs={24} md={8} key={index}>
              <Card style={{ height: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <Avatar
                    size={80}
                    src={testimonial.avatar}
                    style={{ marginBottom: 16 }}
                  />
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {testimonial.name}
                  </Title>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 16 }}
                  >
                    {testimonial.role}
                  </Text>
                  <Paragraph style={{ fontStyle: "italic" }}>
                    "{testimonial.content}"
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Testimonials;
