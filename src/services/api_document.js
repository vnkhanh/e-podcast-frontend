import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function listDocuments({
  status,
  search,
  page,
  limit,
  lecturer,
  start_date,
  end_date,
} = {}) {
  const token = localStorage.getItem("token");

  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (lecturer) params.lecturer = lecturer;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const res = await axios.get(`${API_BASE_URL}/admin/documents`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return res.data;
}

// Upload document (multipart form-data)
export async function uploadDocument(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE_URL}/admin/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Kết quả API:", res.data);
  return res.data; // { message, tai_lieu }
}

// Lấy chi tiết tài liệu theo id
export const getDocumentDetail = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/documents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

//Xóa
export async function deleteDocument(id) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_BASE_URL}/admin/documents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { message: "...", topic: {...} }
}
