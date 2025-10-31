import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
/**
 * Gọi API search-full với phân trang
 * @param {string} query - từ khóa tìm kiếm
 * @param {number} page - số trang
 * @param {number} perPage - số item mỗi trang
 * @returns {Promise<Object>} kết quả search { total, page, perPage, results }
 */
export const searchFull = async (query, page = 1, perPage = 12) => {
  if (!query) throw new Error("Query không được để trống");

  const { data } = await axios.get(`${API_BASE_URL}/search/full`, {
    params: {
      query,
      page,
      per_page: perPage,
    },
  });

  return data;
};

/**
 * Gọi API search autocomplete (gợi ý)
 * @param {string} query - từ khóa gợi ý
 * @param {number} limit - số lượng kết quả gợi ý
 * @returns {Promise<Array>} mảng kết quả autocomplete
 */
export const searchAutocomplete = async (query, limit = 10) => {
  if (!query) return [];

  const { data } = await axios.get(`${API_BASE_URL}/search`, {
    params: {
      query,
      limit,
    },
  });

  return data;
};
