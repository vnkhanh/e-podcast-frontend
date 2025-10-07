import React from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Đã đăng xuất!");
    navigate("/", { replace: true });
  };

  return (
    <Button type="text" onClick={handleLogout}>
      <LogoutOutlined /> Đăng xuất
    </Button>
  );
};

export default LogoutButton;
