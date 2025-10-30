import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// interceptor để tự thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------- SUBJECT API -------------------

// Thêm môn học mới
export async function createSubject(name) {
  const res = await api.post("/admin/subjects", { name });
  return res.data; // { message, subject }
}

// Lấy chi tiết môn học theo id
export async function getSubjectDetail(id) {
  const res = await api.get(`/admin/subjects/${id}`);
  return res.data.subject; // lấy object môn học bên trong
}

// Danh sách môn học (có search, filter, pagination)
export async function listSubjects({
  status,
  search,
  page,
  limit,
  from_date,
  to_date,
} = {}) {
  const res = await api.get("/admin/subjects", {
    params: { status, search, page, limit, from_date, to_date },
  });
  return res.data; // { data: [...], page, limit, total }
}

// Xoá môn học
export async function deleteSubject(id) {
  const res = await api.delete(`/admin/subjects/${id}`);
  return res.data; // { message }
}

// Cập nhật môn học
export const updateSubject = async (id, data) => {
  const res = await api.put(`${API_BASE_URL}/admin/subjects/${id}`, data);
  return res.data;
};
/**
 * Kiểm tra xem chương có thể xóa được hay không
 * @param {string} chapterId
 * @returns {Promise<{can_delete: boolean, message?: string}>}
 */
export const checkChapterDeletable = async (chapterId) => {
  try {
    const res = await api.get(
      `${API_BASE_URL}/admin/subjects/chapters/${chapterId}/check-deletable`
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi checkChapterDeletable:", err);
    throw err;
  }
};
// Toggle trạng thái môn học
export async function toggleSubjectStatus(id) {
  const res = await api.patch(`/admin/subjects/${id}/toggle-status`);
  return res.data; // { message, subject }
}

export const getSubjects = async () => {
  const res = await api.get(`/admin/subjects/get`);
  return res.data;
};
export const getChaptersBySubject = async (subjectId) => {
  const res = await api.get(`/admin/chapters?subject_id=${subjectId}`);
  return res.data;
};

//User
export const getSubjectDetailUser = async (slug) => {
  const res = await axios.get(`${API_BASE_URL}/user/subjects/${slug}`);
  return res.data?.data || null;
};

export const getPopularSubjects = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/subjects/popular`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Lỗi khi tải môn học phổ biến:", err);
    return [];
  }
};
