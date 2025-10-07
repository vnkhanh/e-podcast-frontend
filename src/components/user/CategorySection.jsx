import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { 
  BookOutlined, 
  CodeOutlined, 
  BulbOutlined, 
  GlobalOutlined,
  LineChartOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const categories = [
  { icon: <BookOutlined />, title: 'Văn học', count: '120 podcast' },
  { icon: <CodeOutlined />, title: 'Công nghệ', count: '89 podcast' },
  { icon: <BulbOutlined />, title: 'Khoa học', count: '75 podcast' },
  { icon: <GlobalOutlined />, title: 'Ngoại ngữ', count: '63 podcast' },
  { icon: <LineChartOutlined />, title: 'Kinh doanh', count: '54 podcast' },
  { icon: <HeartOutlined />, title: 'Tâm lý học', count: '42 podcast' },
];

const CategorySection = () => {
  return (
    <div className="category-section">
      <Title level={2} className="section-title">
        Danh mục nổi bật
      </Title>
      
      <Row gutter={[24, 24]}>
        {categories.map((category, index) => (
          <Col xs={12} sm={8} lg={4} key={index}>
            <Card 
              hoverable 
              className="category-card"
              cover={
                <div className="category-icon">
                  {React.cloneElement(category.icon, { 
                    style: { fontSize: '32px', color: '#1890ff' } 
                  })}
                </div>
              }
            >
              <Card.Meta
                title={category.title}
                description={category.count}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySection;