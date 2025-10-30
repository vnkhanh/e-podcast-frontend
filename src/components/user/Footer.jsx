import React from "react";
import { Layout, Row, Col, Typography, Input, Button, Space } from "antd";
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
    <AntFooter
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "80px 60px 40px",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: 80,
        boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[48, 48]}>
          {/* --- Cột thương hiệu --- */}
          <Col xs={24} md={8}>
            <div>
              <Title
                level={3}
                style={{
                  color: "white",
                  fontWeight: 800,
                  marginBottom: 12,
                  letterSpacing: 1,
                }}
              >
                E-Podcast
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 15 }}>
                Nền tảng học tập trực tuyến hàng đầu Việt Nam, mang đến trải
                nghiệm học tập qua podcast chất lượng cao.
              </Text>

              <Space size="large" style={{ marginTop: 20 }}>
                <SocialIcon icon={<FacebookOutlined />} />
                <SocialIcon icon={<TwitterOutlined />} />
                <SocialIcon icon={<InstagramOutlined />} />
                <SocialIcon icon={<YoutubeOutlined />} />
              </Space>
            </div>
          </Col>

          {/* --- Cột liên kết --- */}
          <Col xs={12} md={4}>
            <Title level={4} style={footerTitleStyle}>
              Về chúng tôi
            </Title>
            <FooterLink text="Giới thiệu" />
            <FooterLink text="Đội ngũ" />
            <FooterLink text="Cơ hội nghề nghiệp" />
            <FooterLink text="Liên hệ" />
          </Col>

          <Col xs={12} md={4}>
            <Title level={4} style={footerTitleStyle}>
              Hỗ trợ
            </Title>
            <FooterLink text="Trung tâm trợ giúp" />
            <FooterLink text="FAQ" />
            <FooterLink text="Chính sách bảo mật" />
            <FooterLink text="Điều khoản sử dụng" />
          </Col>

          {/* --- Đăng ký nhận tin --- */}
          <Col xs={24} md={8}>
            <Title level={4} style={footerTitleStyle}>
              Đăng ký nhận tin
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              Nhận thông báo về các podcast và khóa học mới nhất
            </Text>
            <div style={{ marginTop: 16 }}>
              <Search
                placeholder="Nhập email của bạn"
                enterButton={
                  <Button
                    type="primary"
                    icon={<MailOutlined />}
                    style={{
                      background: "white",
                      color: "#764ba2",
                      fontWeight: 600,
                      borderRadius: "0 50px 50px 0",
                      height: 40,
                    }}
                  >
                    Đăng ký
                  </Button>
                }
                size="large"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  borderRadius: 50,
                  overflow: "hidden",
                }}
                className="newsletter-input"
              />
            </div>
          </Col>
        </Row>

        {/* --- Footer Bottom --- */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>
            © 2025 E-Podcast. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

/* ---- Các component phụ tái sử dụng ---- */
const footerTitleStyle = {
  color: "white",
  fontWeight: 600,
  fontSize: 16,
  marginBottom: 12,
};

const FooterLink = ({ text }) => (
  <div style={{ marginBottom: 6 }}>
    <a
      href="#"
      style={{
        color: "rgba(255,255,255,0.85)",
        fontSize: 14,
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.target.style.color = "#fff")}
      onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
    >
      {text}
    </a>
  </div>
);

const SocialIcon = ({ icon }) => (
  <Button
    shape="circle"
    type="text"
    icon={icon}
    style={{
      color: "white",
      fontSize: 18,
      background: "rgba(255,255,255,0.1)",
      border: "none",
      width: 42,
      height: 42,
      transition: "all 0.3s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "white";
      e.currentTarget.style.color = "#764ba2";
      e.currentTarget.style.transform = "scale(1.1)";
      e.currentTarget.style.boxShadow = "0 0 12px rgba(255,255,255,0.4)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
      e.currentTarget.style.color = "white";
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "none";
    }}
  />
);

export default Footer;
