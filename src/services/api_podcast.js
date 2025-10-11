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
  const res = await axios.get(`${API_BASE_URL}/admin/subjects/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // trả về mảng subjects
}

export async function listTopics() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/topics/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // trả về mảng topics
}
export async function listCategories() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/categories/get`, {
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

export async function listChapters(subjectId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/chapters`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { subject_id: subjectId },
  });
  return res.data;
}

export async function listChaptersBySubject(subjectId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/subjects/${subjectId}/chapters`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
export async function createChapter(data) {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_BASE_URL}/admin/subjects/${data.subject_id}/chapters`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deletePodcast(id) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_BASE_URL}/admin/podcasts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Cập nhật metadata podcast
export async function updatePodcast(id, data) {
  const formData = new FormData();
    const token = localStorage.getItem("token");

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const res = await axios.put(`${API_BASE_URL}/admin/podcasts/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },

  });
  return res.data;
}

///USER
export const getFeaturedPodcasts = async () => {
  const res = await axios.get(`${API_BASE_URL}/user/podcasts/featured`);
  return res.data.podcasts || [];
};

export const getPodcastById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/user/podcasts/${id}`);
  return res.data || null;
}