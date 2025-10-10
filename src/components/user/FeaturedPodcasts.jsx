import React from 'react';
import { Row, Col, Card, Button, Typography, Rate } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const featuredPodcasts = [
  {
    title: 'Bí quyết học tập hiệu quả',
    author: 'TS. Nguyễn Văn A',
    duration: '25 phút',
    rating: 4.8,
    listens: '12.5k',
    image: '/api/placeholder/300/200',
  },
  {
    title: 'Lập trình cho người mới bắt đầu',
    author: 'ThS. Trần Thị B',
    duration: '32 phút',
    rating: 4.9,
    listens: '8.7k',
    image: '/api/placeholder/300/200',
  },
  {
    title: 'Kỹ năng giao tiếp thành công',
    author: 'Chuyên gia C',
    duration: '28 phút',
    rating: 4.7,
    listens: '15.2k',
    image: '/api/placeholder/300/200',
  },
  {
    title: 'Toán học ứng dụng',
    author: 'GS. Lê Văn D',
    duration: '35 phút',
    rating: 4.6,
    listens: '6.3k',
    image: '/api/placeholder/300/200',
  },
];

const FeaturedPodcasts = () => {
  return (
    <div
      style={{
        padding: '60px 40px',
        background: '#f9f9f9',
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        Podcast nổi bật
      </Title>

      <Row gutter={[24, 24]} justify="center">
        {featuredPodcasts.map((podcast, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
              }}
              cover={
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    alt={podcast.title}
                    src={podcast.image}
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.4)',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 0.3s ease',
                    }}
                    className="play-overlay"
                  >
                    <PlayCircleOutlined
                      style={{
                        fontSize: 48,
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>
              }
              className="podcast-card"
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                const overlay = e.currentTarget.querySelector('.play-overlay');
                if (img) img.style.transform = 'scale(1.05)';
                if (overlay) overlay.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                const overlay = e.currentTarget.querySelector('.play-overlay');
                if (img) img.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = 0;
              }}
            >
              <div style={{ padding: '8px 0' }}>
                <Title level={4} style={{ marginBottom: 4 }}>
                  {podcast.title}
                </Title>
                <Text type="secondary">Bởi {podcast.author}</Text>

                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#888',
                    fontSize: 13,
                  }}
                >
                  <span>
                    <ClockCircleOutlined /> {podcast.duration}
                  </span>
                  <span>{podcast.listens} nghe</span>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={podcast.rating}
                    style={{ fontSize: 14 }}
                  />
                  <Text type="secondary">({podcast.rating})</Text>
                </div>

                <Button
                  type="primary"
                  block
                  icon={<PlayCircleOutlined />}
                  style={{
                    marginTop: 16,
                    borderRadius: 8,
                    fontWeight: 500,
                  }}
                >
                  Nghe ngay
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturedPodcasts;
