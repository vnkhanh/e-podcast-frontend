import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

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
export async function listSubjects({ status, search, page, limit } = {}) {
  const res = await api.get("/admin/subjects", {
    params: { status, search, page, limit },
  });
  return res.data; // { data: [...], page, limit, total }
}

// Xoá môn học
export async function deleteSubject(id) {
  const res = await api.delete(`/admin/subjects/${id}`);
  return res.data; // { message }
}

// Cập nhật môn học
export async function updateSubject(id, name) {
  const res = await api.put(`/admin/subjects/${id}`, { name });
  return res.data; // { message, subject }
}

// Toggle trạng thái môn học
export async function toggleSubjectStatus(id) {
  const res = await api.patch(`/admin/subjects/${id}/toggle-status`);
  return res.data; // { message, subject }
};

export const getSubjects = async () => {
  const res = await api.get(`/admin/subjects/get`);
  return res.data;
};
export const getChaptersBySubject = async (subjectId) => {
  const res = await api.get(`/admin/chapters?subject_id=${subjectId}`);
  return res.data;
};

