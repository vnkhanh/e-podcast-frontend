import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  GroupOutlined,
  LogoutOutlined,
  BlockOutlined,
  DockerOutlined,
} from "@ant-design/icons";

import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const TeacherLayout = () => {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible>
        <div
          style={{
            height: 40,
            margin: 16,
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: "bold",
          }}
        >
          Admin
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/teacher/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="subject" icon={<BookOutlined />}>
            <Link to="/teacher/subject">Môn học</Link>
          </Menu.Item>
          <Menu.Item key="topic" icon={<GroupOutlined />}>
            <Link to="/teacher/topic">Chủ đề</Link>
          </Menu.Item>
          <Menu.Item key="category" icon={<BlockOutlined />}>
            <Link to="/teacher/category">Danh mục</Link>
          </Menu.Item>
          <Menu.Item key="document" icon={<DockerOutlined />}>
            <Link to="/teacher/document">Tài liệu</Link>
          </Menu.Item>
          <Menu.Item key="podcast" icon={<BookOutlined />}>
            <Link to="/teacher/podcast">Podcast</Link>
          </Menu.Item>
          {/* Có thể thêm mục khác */}
        </Menu>
      </Sider>

      {/* Content */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Giảng viên</h3>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>
                Xin chào, giảng viên {user?.full_name || "Giảng viên"}!
              </span>{" "}
              &nbsp;&nbsp;&nbsp;
              <Avatar
                style={{ backgroundColor: "#87d068", marginRight: 8 }}
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              background: "#fff",
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeacherLayout;
