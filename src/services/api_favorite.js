import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Lấy danh sách podcast yêu thích
export const getAllFavorites = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/account/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("[getAllFavorites] Error:", err);
    throw err.response?.data || err;
  }
};

// Thêm podcast vào yêu thích
export const addFavorite = async (token, podcastId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/account/favorites/${podcastId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("[addFavorite] Error:", err);
    throw err.response?.data || err;
  }
};

// Xóa podcast khỏi yêu thích
export const removeFavorite = async (token, podcastId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/user/account/favorites/${podcastId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("[removeFavorite] Error:", err);
    throw err.response?.data || err;
  }
};

// Kiểm tra podcast có được yêu thích không
export const checkFavorite = async (token, podcastId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/account/favorite/${podcastId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.is_favorite;
  } catch (err) {
    console.error("[checkFavorite] Error:", err);
    return false; // fallback để không crash
  }
};
