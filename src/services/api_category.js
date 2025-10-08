import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";


export async function createCategory({ name, status }) {
  const token = localStorage.getItem("token");
  const body = { name };
  if (typeof status === "boolean") body.status = status;

  const res = await axios.post(`${API_BASE_URL}/admin/categories`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Backend trả về object category mới
  return res.data;
}

export async function listCategories({ status, search, page, limit } = {}) {
  const token = localStorage.getItem("token");

  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;  // phải đúng key "search" như BE
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const res = await axios.get(`${API_BASE_URL}/admin/categories`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  // Backend trả về { data: [...], page, limit, total }
  return res.data;
}

export async function toggleCategoryStatus(id) {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
        `${API_BASE_URL}/admin/categories/${id}/toggle-status`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data; // { message: "...", category: {...} }
}
export async function updateCategory(id, name) {
    const token = localStorage.getItem("token");
    const res = await axios.put(    
        `${API_BASE_URL}/admin/categories/${id}`,
        { name },
        {       
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data; // { message: "...", category: {...} }
}
export async function deleteCategory(id) {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_BASE_URL}/admin/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data; // { message: "...", category: {...} }
}

// Lấy chi tiết danh mục theo id
export const getCategoryDetail = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/admin/categories/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
  return res.data;
};

