import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// === Lấy chi tiết podcast ===
export const getPodcastDetail = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/podcasts/${id}`);
  return res.data.data;
};

// === Tạo flashcards tự động từ document ===
export const createFlashcards = async (documentId) => {
  const res = await axios.post(
    `${API_BASE_URL}/documents/${documentId}/flashcards`,
    {},
    { headers: authHeader() }
  );
  return res.data.data || [];
};

// === Lấy flashcards theo podcast ===
export async function getFlashcardsByPodcast(podcastId) {
  const res = await axios.get(
    `${API_BASE_URL}/podcasts/${podcastId}/flashcards`,
    {
      headers: authHeader(),
    }
  );
  return {
    flashcards: res.data.data || [],
    count: res.data.count || 0,
  };
}
