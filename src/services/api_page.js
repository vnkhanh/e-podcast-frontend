import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function getPages(token) {
  const res = await axios.get(`${API_BASE_URL}/admin/pages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getPage(slug, token) {
  const res = await axios.get(`${API_BASE_URL}/admin/pages/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createPage(data, token) {
  const res = await axios.post(`${API_BASE_URL}/admin/pages`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updatePage(slug, data, token) {
  const res = await axios.put(`${API_BASE_URL}/admin/pages/${slug}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deletePage(slug, token) {
  const res = await axios.delete(`${API_BASE_URL}/admin/pages/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// --- Dành cho user (public) ---
export async function getPublicPage(slug) {
  const res = await axios.get(`${API_BASE_URL}/page/${slug}`);
  return res.data;
}
