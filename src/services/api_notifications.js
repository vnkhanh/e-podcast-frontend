import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const getUnreadNotifications = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/notifications/unread`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.unread_count;
  } catch (err) {
    console.error("Lỗi khi lấy thông báo chưa đọc:", err);
    return 0;
  }
};

export const markAllNotificationsRead = async (token) => {
  try {
    await axios.put(
      `${API_BASE_URL}/admin/notifications/mark-all-read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (err) {
    console.error("Lỗi khi đánh dấu đọc:", err);
    return false;
  }
};

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Lấy danh sách thông báo
export const getNotifications = async () => {
  const res = await axios.get(`${API_BASE_URL}/admin/notifications`, {
    headers: getHeaders(),
  });
  return res.data;
};

// Đánh dấu tất cả là đã đọc
export const markAllAsRead = async () => {
  await axios.put(
    `${API_BASE_URL}/admin/notifications/mark-all-read`,
    {},
    {
      headers: getHeaders(),
    }
  );
};

// Xóa 1 thông báo
export const deleteNotification = async (id) => {
  await axios.delete(`${API_BASE_URL}/admin/notifications/${id}`, {
    headers: getHeaders(),
  });
};

// Xóa tất cả đã đọc
export const deleteReadNotifications = async () => {
  await axios.delete(`${API_BASE_URL}/admin/notifications/read`, {
    headers: getHeaders(),
  });
};

// Xóa tất cả thông báo
export const deleteAllNotifications = async () => {
  await axios.delete(`${API_BASE_URL}/admin/notifications`, {
    headers: getHeaders(),
  });
};
