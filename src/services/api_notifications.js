import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Lấy danh sách thông báo
export const getNotifications = async () => {
  const res = await axios.get(`${API_BASE_URL}/notifications`, {
    headers: getHeaders(),
  });
  return res.data;
};

// Lấy số lượng thông báo chưa đọc
export const getUnreadNotifications = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/notifications/unread`, {
      headers: getHeaders(),
    });
    return res.data.unread_count || 0;
  } catch (err) {
    console.error("Lỗi khi lấy thông báo chưa đọc:", err);
    return 0;
  }
};

// Đánh dấu đã đọc một thông báo
export const markNotificationRead = async (id) => {
  await axios.put(
    `${API_BASE_URL}/notifications/${id}/read`,
    {},
    { headers: getHeaders() }
  );
};

// Đánh dấu tất cả là đã đọc
export const markAllAsRead = async () => {
  await axios.put(
    `${API_BASE_URL}/notifications/mark-all-read`,
    {},
    { headers: getHeaders() }
  );
};

// Xóa 1 thông báo
export const deleteNotification = async (id) => {
  await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
    headers: getHeaders(),
  });
};

// Xóa tất cả thông báo đã đọc
export const deleteReadNotifications = async () => {
  await axios.delete(`${API_BASE_URL}/notifications/read`, {
    headers: getHeaders(),
  });
};

// Xóa tất cả thông báo
export const deleteAllNotifications = async () => {
  await axios.delete(`${API_BASE_URL}/notifications`, {
    headers: getHeaders(),
  });
};
