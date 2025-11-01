import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const createPodcastNote = (data, token) => {
  return axios.post(`${API_BASE_URL}/user/notes`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getNotesByPodcast = (podcastId, token) => {
  return axios.get(`${API_BASE_URL}/user/podcasts/${podcastId}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteNote = async (noteId, token) => {
  return axios.delete(`${API_BASE_URL}/user/notes/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
