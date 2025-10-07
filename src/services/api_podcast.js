import axios from "axios";


const API_BASE_URL = "http://localhost:8080/api";


export const uploadPodcast = async (data) => {
const token = localStorage.getItem("token");
const res = await axios.post(`${API_BASE_URL}/admin/podcasts`, data, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "multipart/form-data",
},
});
return res.data;
};


export async function listSubjects() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/subjectsget`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // trả về mảng subjects
}

export async function listTopics() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/topicsget`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // trả về mảng topics
}
export async function listCategories() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/categoriesget`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // trả về mảng categories
}
export async function listTags() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/tags`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // trả về mảng tags
}

export async function listPodcasts({ page = 1, limit = 10, search = "" } = {}) {
  const token = localStorage.getItem("token"); 
  const res = await axios.get(`${API_BASE_URL}/admin/podcasts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit, search },
  });
  return res.data;
}

export async function getPodcastDetail(id) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/podcasts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}