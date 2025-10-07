import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getUserRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.role; // server phải encode role trong token
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
