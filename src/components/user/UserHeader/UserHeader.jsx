import { Layout, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const UserHeader = () => {
  const menu = (
    <Menu
      items={[
        { key: "profile", label: "Trang cá nhân", icon: <UserOutlined /> },
        { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true },
      ]}
    />
  );

  return (
    <Header className="flex justify-between items-center px-6 bg-white shadow-sm">
      <h1 className="text-xl font-bold text-blue-600">E-Podcast</h1>
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <Avatar size="large" icon={<UserOutlined />} className="cursor-pointer" />
      </Dropdown>
    </Header>
  );
};

export default UserHeader;
