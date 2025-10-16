import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Lấy danh sách user
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {string} options.name
 * @param {string} options.role
 * @returns {Promise} { users: [], pagination: {} }
 */
export async function listUsers({
  page = 1,
  limit = 10,
  name = "",
  role = "",
} = {}) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit, name, role },
  });
  return res.data;
}

/**
 * Lấy chi tiết user
 */
export async function getUserDetail(userId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/**
 * Xoá user (vô hiệu hoá)
 */
export async function deleteUser(userId) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/**
 * Tạo tài khoản giảng viên
 * @param {Object} data { email, full_name, password }
 */
export async function createLecturer(data) {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_BASE_URL}/admin/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function ToggleUserStatus(userId) {
  const token = localStorage.getItem("token");
  const res = await axios.patch(
    `${API_BASE_URL}/admin/users/${userId}/toggle-status`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}
