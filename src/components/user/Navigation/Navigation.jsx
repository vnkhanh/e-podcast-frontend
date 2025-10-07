import { Menu } from "antd";
import { HomeOutlined, AppstoreOutlined, BookOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { key: "/home", icon: <HomeOutlined />, label: <Link to="/home">Trang chủ</Link> },
    { key: "/browse", icon: <AppstoreOutlined />, label: <Link to="/browse">Khám phá</Link> },
    { key: "/study", icon: <BookOutlined />, label: <Link to="/study">Học tập</Link> },
    { key: "/favorites", icon: <StarOutlined />, label: <Link to="/favorites">Yêu thích</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Tài khoản</Link> },
  ];

  return (
    <div className="bg-white shadow-sm">
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="flex justify-center"
      />
    </div>
  );
};

export default Navigation;
