import React from "react";
import { Navigate } from "react-router-dom";

// Cấp bậc quyền: số càng cao quyền càng lớn
const roleHierarchy = {
  admin: 3,
  teacher: 2,
  student: 1,
};

const defaultRoutes = {
  student: "/",
  teacher: "/teacher",
  admin: "/admin",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles) {
    // Lấy level của user
    const userLevel = roleHierarchy[user.role] || 0;

    // Lấy level tối thiểu trong allowedRoles
    const minAllowedLevel = Math.min(
      ...allowedRoles.map((role) => roleHierarchy[role] || 0)
    );

    // Nếu userLevel < minAllowedLevel => không được phép
    if (userLevel < minAllowedLevel) {
      return <Navigate to={defaultRoutes[user.role]} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
