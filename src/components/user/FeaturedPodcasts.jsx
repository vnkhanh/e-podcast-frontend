import React from 'react';
import { Row, Col, Card, Button, Typography, Rate } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const featuredPodcasts = [
  {
    title: 'Bí quyết học tập hiệu quả',
    author: 'TS. Nguyễn Văn A',
    duration: '25 phút',
    rating: 4.8,
    listens: '12.5k',
    image: '/api/placeholder/300/200'
  },
  {
    title: 'Lập trình cho người mới bắt đầu',
    author: 'ThS. Trần Thị B',
    duration: '32 phút',
    rating: 4.9,
    listens: '8.7k',
    image: '/api/placeholder/300/200'
  },
  {
    title: 'Kỹ năng giao tiếp thành công',
    author: 'Chuyên gia C',
    duration: '28 phút',
    rating: 4.7,
    listens: '15.2k',
    image: '/api/placeholder/300/200'
  },
  {
    title: 'Toán học ứng dụng',
    author: 'GS. Lê Văn D',
    duration: '35 phút',
    rating: 4.6,
    listens: '6.3k',
    image: '/api/placeholder/300/200'
  }
];

const FeaturedPodcasts = () => {
  return (
    <div className="featured-podcasts">
      <Title level={2} className="section-title">
        Podcast nổi bật
      </Title>
      
      <Row gutter={[24, 24]}>
        {featuredPodcasts.map((podcast, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              cover={
                <div className="podcast-image-container">
                  <img 
                    alt={podcast.title} 
                    src={podcast.image} 
                    className="podcast-image"
                  />
                  <div className="play-overlay">
                    <PlayCircleOutlined />
                  </div>
                </div>
              }
              className="podcast-card"
            >
              <div className="podcast-content">
                <h3 className="podcast-title">{podcast.title}</h3>
                <p className="podcast-author">Bởi {podcast.author}</p>
                
                <div className="podcast-meta">
                  <span className="duration">
                    <ClockCircleOutlined /> {podcast.duration}
                  </span>
                  <span className="listens">{podcast.listens} nghe</span>
                </div>
                
                <div className="podcast-rating">
                  <Rate disabled defaultValue={podcast.rating} />
                  <span className="rating-value">({podcast.rating})</span>
                </div>
                
                <Button type="primary" block className="listen-btn">
                  <PlayCircleOutlined /> Nghe ngay
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