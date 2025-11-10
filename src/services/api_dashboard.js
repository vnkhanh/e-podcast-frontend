import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Lấy headers chung
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Tổng quan dashboard
export const getOverviewStats = async () => {
  const res = await axios.get(`${API_BASE_URL}/admin/stats/overview`, {
    headers: getHeaders(),
  });
  return res.data;
};

// Lượt nghe theo ngày
export const getDailyListens = async (from, to) => {
  const res = await axios.get(
    `${API_BASE_URL}/admin/stats/daily-listens?from=${from}&to=${to}`,
    { headers: getHeaders() }
  );
  return res.data;
};

// Lượt nghe theo tháng
export const getMonthlyListens = async (year = new Date().getFullYear()) => {
  const res = await axios.get(
    `${API_BASE_URL}/admin/stats/monthly-listens?year=${year}`,
    {
      headers: getHeaders(),
    }
  );
  return res.data;
};

// Người dùng mới
export const getNewUsers = async (days = 30) => {
  const res = await axios.get(
    `${API_BASE_URL}/admin/stats/new-users?days=${days}`,
    {
      headers: getHeaders(),
    }
  );
  return res.data;
};

// Phân bố theo môn học
export const getSubjectBreakdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/admin/stats/subject-breakdown`, {
    headers: getHeaders(),
  });
  return res.data;
};
