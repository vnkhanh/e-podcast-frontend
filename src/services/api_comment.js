import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const getComments = async (podcastId) => {
  const res = await axios.get(`${API_BASE_URL}/comments/podcasts/${podcastId}`);
  return res.data;
};

export const createComment = async (token, payload) => {
  const res = await axios.post(`${API_BASE_URL}/comments`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteComment = async (token, commentId) => {
  const res = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
