import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.vai_tro !== role) {
    // Nếu truyền role mà không đúng, redirect về trang mặc định
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
