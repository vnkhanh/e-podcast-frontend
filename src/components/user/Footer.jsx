import React from "react";
import { Layout, Row, Col, Typography, Input, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const Footer = () => {
  return (
    <AntFooter className="app-footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div className="footer-brand">
              <Title level={3} className="footer-logo">
                E-Podcast
              </Title>
              <Text className="footer-description">
                Nền tảng học tập trực tuyến hàng đầu Việt Nam, mang đến trải
                nghiệm học tập qua podcast chất lượng cao.
              </Text>
              <div className="social-links">
                <Button type="text" icon={<FacebookOutlined />} />
                <Button type="text" icon={<TwitterOutlined />} />
                <Button type="text" icon={<InstagramOutlined />} />
                <Button type="text" icon={<YoutubeOutlined />} />
              </div>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <Title level={4} className="footer-title">
              Về chúng tôi
            </Title>
            <ul className="footer-links">
              <li>
                <a href="#">Giới thiệu</a>
              </li>
              <li>
                <a href="#">Đội ngũ</a>
              </li>
              <li>
                <a href="#">Cơ hội nghề nghiệp</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </Col>

          <Col xs={12} md={4}>
            <Title level={4} className="footer-title">
              Hỗ trợ
            </Title>
            <ul className="footer-links">
              <li>
                <a href="#">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
            </ul>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4} className="footer-title">
              Đăng ký nhận tin
            </Title>
            <Text>Nhận thông báo về các podcast và khóa học mới nhất</Text>
            <Search
              placeholder="Email của bạn"
              enterButton={
                <Button type="primary" icon={<MailOutlined />}>
                  Đăng ký
                </Button>
              }
              size="large"
              className="newsletter-input"
            />
          </Col>
        </Row>

        <div className="footer-bottom">
          <Text>© 2024 E-Podcast. Tất cả quyền được bảo lưu.</Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
