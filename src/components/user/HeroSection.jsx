import React from 'react';
import { Row, Col, Button, Typography, Card, Space } from 'antd';
import { PlayCircleOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const HeroSection = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #f0f5ff 0%, #ffffff 100%)',
        padding: '80px 40px',
      }}
    >
      <Row gutter={[48, 48]} align="middle" justify="center">
        {/* LEFT CONTENT */}
        <Col xs={24} md={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={1} style={{ fontWeight: 700, fontSize: '2.8rem' }}>
                Học tập qua Podcast
                <Text style={{ color: '#1677ff' }}> Hiệu quả hơn</Text>
              </Title>

              <Paragraph style={{ fontSize: '1.1rem', color: '#555', marginTop: 16 }}>
                Khám phá thế giới tri thức qua các podcast giáo dục chất lượng cao.  
                Học mọi lúc, mọi nơi với <b>E-Podcast</b> — nền tảng học tập trực tuyến hàng đầu.
              </Paragraph>
            </div>

            <Space size="middle">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                Bắt đầu ngay
              </Button>

              <Button
                size="large"
                icon={<RocketOutlined />}
                style={{ borderRadius: 8 }}
              >
                Khám phá khóa học
              </Button>
            </Space>

            <Row gutter={[16, 16]} style={{ marginTop: 40 }}>
              <Col span={8}>
                <Card
                  bordered={false}
                  style={{
                    textAlign: 'center',
                    background: '#fafafa',
                    borderRadius: 12,
                  }}
                >
                  <Title level={3} style={{ margin: 0 }}>
                    500+
                  </Title>
                  <Text type="secondary">Podcast giáo dục</Text>
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  bordered={false}
                  style={{
                    textAlign: 'center',
                    background: '#fafafa',
                    borderRadius: 12,
                  }}
                >
                  <Title level={3} style={{ margin: 0 }}>
                    10,000+
                  </Title>
                  <Text type="secondary">Học viên</Text>
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  bordered={false}
                  style={{
                    textAlign: 'center',
                    background: '#fafafa',
                    borderRadius: 12,
                  }}
                >
                  <Title level={3} style={{ margin: 0 }}>
                    50+
                  </Title>
                  <Text type="secondary">Chuyên gia</Text>
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>

        {/* RIGHT IMAGE */}
        <Col xs={24} md={12}>
          <Card
            hoverable
            bordered={false}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
            cover={
              <img
                src="/api/placeholder/600/400"
                alt="Học tập với E-Podcast"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            }
          >
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                borderRadius: 12,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <PlayCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
              <Text style={{ color: '#fff', fontWeight: 500 }}>
                Đang phát: Kỹ năng học tập hiệu quả
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;
