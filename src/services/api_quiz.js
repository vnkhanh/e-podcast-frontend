import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/user";

// === Tạo trắc nghiệm từ tài liệu (document) ===
// POST /documents/:id/quizzes
export async function createQuizFromDocument(documentId) {
  const res = await axios.post(
    `${API_BASE_URL}/documents/${documentId}/quizzes`,
    {}, // body trống vì AI tự tạo
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

// ===  Lấy danh sách câu hỏi của 1 podcast ===
// GET /podcasts/:id/quizzes
export async function getQuizQuestions(podcastId) {
  const res = await axios.get(`${API_BASE_URL}/podcasts/${podcastId}/quizzes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}

// === Nộp bài làm trắc nghiệm ===
// POST /podcasts/:podcast_id/quiz/submit
export async function submitQuiz(podcastId, answers) {
  const formattedAnswers = answers.map((a) => ({
    question_id: a.question_id ?? a.questionId,
    option_id: a.option_id ?? a.selectedOptionId,
  }));

  const res = await axios.post(
    `${API_BASE_URL}/podcasts/${podcastId}/quiz/submit`,
    { answers: formattedAnswers },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

// === Lấy tất cả các lần làm quiz của người dùng ===
// GET /quiz/attempt
export async function getUserQuizAttempts() {
  const res = await axios.get(`${API_BASE_URL}/quiz/attempt`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}

// === Xem chi tiết 1 lần làm quiz cụ thể ===
// GET /quiz/attempts/:attempt_id
export async function getQuizAttemptDetail(attemptId) {
  const res = await axios.get(`${API_BASE_URL}/quiz/attempts/${attemptId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}
