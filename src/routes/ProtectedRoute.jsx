import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Map role → trang mặc định
  const defaultRoutes = {
    student: "/dashboard",
    teacher: "/teacher",
    admin: "/admin",
  };

  // Nếu chưa login
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Nếu truyền allowedRoles, kiểm tra quyền
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect về trang mặc định của chính role
    return <Navigate to={defaultRoutes[user.role]} replace />;
  }

  return children;
};

export default ProtectedRoute;
