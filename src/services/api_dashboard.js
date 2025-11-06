import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getOverview = () =>
  axios.get(`${API_BASE_URL}/admin/stats/overview`, {
    headers: getAuthHeaders(),
  });

export const getDailyListens = (days = 7) =>
  axios.get(`${API_BASE_URL}/admin/stats/daily-listens?days=${days}`, {
    headers: getAuthHeaders(),
  });

export const getMonthlyListens = (year = new Date().getFullYear()) =>
  axios.get(`${API_BASE_URL}/admin/stats/monthly-listens?year=${year}`, {
    headers: getAuthHeaders(),
  });

export const getNewUsers = (days = 30) =>
  axios.get(`${API_BASE_URL}/admin/stats/new-users?days=${days}`, {
    headers: getAuthHeaders(),
  });

export const getSubjectBreakdown = () =>
  axios.get(`${API_BASE_URL}/admin/stats/subject-breakdown`, {
    headers: getAuthHeaders(),
  });
