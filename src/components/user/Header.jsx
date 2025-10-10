import React from 'react'
import { Layout, Menu, Input, Button, Avatar, Dropdown, Typography, message } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    SearchOutlined,
    LockOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import LogoutButton from '../LogoutButton';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

const AppHeader = () => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  const menuItems = [
    { key: 'home', label: 'Trang chủ' },
    { key: 'courses', label: 'Khóa học' },
    { key: 'podcasts', label: 'Podcasts' },
    { key: 'blog', label: 'Blog' },
    { key: 'about', label: 'Về chúng tôi' },
  ];
  const navigate = useNavigate();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'my-courses',
      icon: <BookOutlined />,
      label: 'Khóa học của tôi',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        message.success("Đã đăng xuất!");
        navigate("/auth/login", { replace: true });
      }
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'my-courses') {
      navigate('/my-courses');
    }
  };

  return (
    <Header style={{ 
      background: '#fff', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: 40 }} onClick={() => navigate('/')}>
            <Title level={3} style={{ color: '#1890ff', margin: 0 }}>E-Podcast</Title>
          </div>
          
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={menuItems}
            style={{ border: 'none', background: 'transparent' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Search
            placeholder="Tìm kiếm khóa học, podcast..."
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300 }}
          />

          {token && user ? (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/auth/login')}>
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;