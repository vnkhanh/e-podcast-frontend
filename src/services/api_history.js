import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const getAllListeningHistory = async (token, params = {}) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/user/account/listening-history`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }
  );
  return res.data;
};

export const getPodcastHistory = async (token, podcastId) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/user/account/listening-history/${podcastId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const savePodcastHistory = async (
  token,
  podcastId,
  lastPosition,
  completed = false
) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/user/account/listening-history/${podcastId}`,
    { last_position: lastPosition, completed },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deletePodcastHistory = async (token, podcastId) => {
  const res = await axios.delete(
    `${API_BASE_URL}/api/user/account/listening-history/${podcastId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const clearAllHistory = async (token) => {
  const res = await axios.delete(
    `${API_BASE_URL}/api/user/account/listening-history`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
