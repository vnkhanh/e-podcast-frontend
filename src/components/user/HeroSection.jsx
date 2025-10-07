import React from 'react';
import { Row, Col, Button, Typography, Card } from 'antd';
import { PlayCircleOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} lg={12}>
          <div className="hero-content">
            <Title level={1} className="hero-title">
              Học tập qua Podcast
              <span className="highlight"> Hiệu quả hơn</span>
            </Title>
            
            <Paragraph className="hero-description">
              Khám phá thế giới tri thức qua các podcast giáo dục chất lượng cao. 
              Học mọi lúc, mọi nơi với E-Podcast - nền tảng học tập trực tuyến hàng đầu.
            </Paragraph>
            
            <div className="hero-actions">
              <Button 
                type="primary" 
                size="large" 
                icon={<PlayCircleOutlined />}
                className="cta-button"
              >
                Bắt đầu ngay
              </Button>
              
              <Button 
                size="large" 
                icon={<RocketOutlined />}
                className="secondary-button"
              >
                Khám phá khóa học
              </Button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <h3>500+</h3>
                <p>Podcast giáo dục</p>
              </div>
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Học viên</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Chuyên gia</p>
              </div>
            </div>
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card className="hero-image-card">
            <img 
              src="/api/placeholder/600/400" 
              alt="Học tập với E-Podcast" 
              className="hero-image"
            />
            <div className="playing-indicator">
              <div className="playing-now">
                <PlayCircleOutlined />
                <span>Đang phát: Kỹ năng học tập hiệu quả</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;