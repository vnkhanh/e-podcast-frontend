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
