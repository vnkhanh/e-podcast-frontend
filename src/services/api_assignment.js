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

// ================= QUESTIONS MANAGEMENT =================
export async function fetchAssignmentQuestions(assignmentId) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/admin/assignments/${assignmentId}/questions`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function createAssignmentQuestion(assignmentId, payload) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/admin/assignments/${assignmentId}/questions`,
      payload,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function updateAssignmentQuestion(questionId, payload) {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/admin/assignments/questions/${questionId}`,
      payload,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function deleteAssignmentQuestion(questionId) {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/admin/assignments/questions/${questionId}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= SUBMISSIONS =================
export async function fetchAssignmentSubmissions(assignmentId, params = {}) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/admin/assignments/${assignmentId}/submissions`,
      {
        params,
        headers: getAuthHeader(),
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ========================= USER ASSIGNMENTS ==============================
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
  try {
    const res = await axios.get(`${API_BASE_URL}/user/assignments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function getUserSubmissions(id, token) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/assignments/${id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function submitAssignment(id, payload, token) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/assignments/${id}/submit`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function getSubmissionDetail(assignmentId, submissionId) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/assignments/${assignmentId}/submissions/${submissionId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= USER ASSIGNMENT OPERATIONS =================
export async function startAssignment(assignmentId, token) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/assignments/${assignmentId}/start`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function saveAssignmentProgress(submissionId, answers, token) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/assignments/submissions/${submissionId}/save`,
      { answers },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function checkDraftSubmission(assignmentId, token) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/assignments/${assignmentId}/check-draft`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Verify assignment password
export const verifyAssignmentPassword = async (assignmentId, password) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/assignments/${assignmentId}/verify-password`,
      { password },
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ================= USER ASSIGNMENT DETAIL =================
export async function getUserAssignmentDetail(id, token) {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/assignments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function getUserAssignmentSubmissions(id, token) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/assignments/${id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ================= EXPORT EXCEL =================
export async function exportAssignmentSubmissions(assignmentId) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/admin/assignments/${assignmentId}/export`,
      {
        headers: getAuthHeader(),
        responseType: "blob", // IMPORTANT: để nhận file
      }
    );

    // Tạo download link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;

    // Lấy tên file từ header hoặc tạo mới
    const contentDisposition = res.headers["content-disposition"];
    let fileName = "Ket_qua_bai_tap.xlsx";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename=(.+)/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (err) {
    throw err.response?.data || err;
  }
}
