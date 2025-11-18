import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Helper lấy token
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ================= ASSIGNMENTS LIST =================
export async function fetchAssignments(params = {}) {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/assignments`, {
      headers: getAuthHeader(),
      params,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
export async function fetchAssignmentDetail(assignmentId) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/admin/assignments/${assignmentId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
// ================= SUBJECTS FOR TEACHER =================
export async function fetchSubjects() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/admin/assignments/subjects/teacher`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= DOCUMENTS =================
export async function fetchDocuments() {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/documents`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= PODCASTS BY CHAPTER =================
export async function fetchPodcastsByChapter(chapterId) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/admin/assignments/podcasts/by-chapter/${chapterId}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= CREATE FROM FILE =================
export async function createAssignmentFromFile(formData) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/admin/assignments/from-file`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= UPDATE ASSIGNMENT =================
export async function updateAssignment(id, payload) {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/admin/assignments/${id}`,
      payload,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= DELETE =================
export async function deleteAssignment(id) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/admin/assignments/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= TOGGLE PUBLISH =================
export async function togglePublish(id) {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/admin/assignments/${id}/toggle-publish`,
      {},
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= CREATE FROM GEMINI =================
export async function createAssignmentFromGemini(payload) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/admin/assignments/from-gemini`,
      payload,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
// Lấy danh sách bài nộp của assignment (giảng viên)
export async function fetchAssignmentSubmissions(assignmentId, params = {}) {
  const token = localStorage.getItem("token");

  return axios.get(
    `${API_BASE_URL}/admin/assignments/${assignmentId}/submissions`,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// ========================= USER ==============================
export const getAssignmentsByPodcast = async (podcastId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/podcasts/${podcastId}/assignments`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export async function getAssignmentDetail(id, token) {
  return axios.get(`${API_BASE_URL}/user/assignments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserSubmissions(id, token) {
  return axios.get(`${API_BASE_URL}/user/assignments/${id}/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function submitAssignment(id, answers, token) {
  return axios.post(
    `${API_BASE_URL}/user/assignments/${id}/submit`,
    { answers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
// Verify assignment password
export const verifyAssignmentPassword = async (assignmentId, password) => {
  const response = await axios.post(
    `${API_BASE_URL}/user/assignments/${assignmentId}/verify-password`,
    {
      password,
    },
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};
