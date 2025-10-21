import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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

export async function listPodcasts({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/admin/podcasts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit, search, status },
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

export async function listChaptersBySubject(subjectId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `${API_BASE_URL}/admin/subjects/${subjectId}/chapters`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}
export async function createChapter(data) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_BASE_URL}/admin/subjects/${data.subject_id}/chapters`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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
export const updatePodcast = async (id, data, isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  if (isMultipart) headers["Content-Type"] = "multipart/form-data";
  const res = await axios.put(`${API_BASE_URL}/admin/podcasts/${id}`, data, {
    headers,
  });
  return res.data;
};
///USER
export const getFeaturedPodcasts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/podcasts/featured`);
    return res.data.podcasts; // vì backend trả về { message, podcasts }
  } catch (error) {
    console.error("Lỗi khi lấy podcast nổi bật:", error);
    throw error;
  }
};

export const getPodcastById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/user/podcasts/${id}`);
  return res.data || null;
};

export const getCategoryPodcasts = async ({
  slug,
  page = 1,
  limit = 8,
  sort = "latest",
  search = "",
}) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API_BASE_URL}/user/categories/${slug}/podcasts`,
      {
        params: { page, limit, sort, search },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách podcast:", error);
    throw error;
  }
};
//lượt nghe
export const increaseListenCount = async (podcastId, currentTime) => {
  try {
    const token = localStorage.getItem("token");
    const seconds = Math.floor(currentTime || 0);

    await axios.post(
      `${API_BASE_URL}/user/podcasts/${podcastId}/listen`,
      {}, // body rỗng
      {
        params: { listened_seconds: seconds },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    console.log(`Đã gửi API tăng lượt nghe (${seconds}s):`, podcastId);
  } catch (error) {
    console.error("Lỗi khi tăng lượt nghe:", error);
  }
};
