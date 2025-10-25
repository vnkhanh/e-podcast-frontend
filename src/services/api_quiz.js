import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// === Tạo trắc nghiệm từ tài liệu (document) ===
// POST /documents/:id/quizzes
export async function createQuizFromDocument(documentId) {
  const res = await axios.post(
    `${API_BASE_URL}/user/documents/${documentId}/quizzes`,
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

// === Lấy danh sách câu hỏi của 1 quiz set ===
// GET /quiz-sets/:id/questions
export async function getQuizQuestions(quizSetId) {
  const res = await axios.get(
    `${API_BASE_URL}/user/quiz-sets/${quizSetId}/questions`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

// === Nộp bài làm trắc nghiệm ===
// POST /quiz-sets/:id/submit
export async function submitQuiz(quizSetId, { answers, duration_sec }) {
  const formattedAnswers = answers.map((a) => ({
    question_id: a.question_id ?? a.questionId,
    option_id: a.option_id ?? a.selectedOptionId,
  }));

  const res = await axios.post(
    `${API_BASE_URL}/user/quiz-sets/${quizSetId}/submit`,
    {
      answers: formattedAnswers,
      duration_sec,
    },
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
// GET /quiz-attempts
export async function getUserQuizAttempts() {
  const res = await axios.get(`${API_BASE_URL}/user/quiz-attempts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}

// === Xem chi tiết 1 lần làm quiz cụ thể ===
// GET /quiz-attempts/:attempt_id
export async function getQuizAttemptDetail(attemptId) {
  const res = await axios.get(
    `${API_BASE_URL}/user/quiz-attempts/${attemptId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

// === Lấy quiz set của podcast ===
// GET /podcasts/:id/quiz-set
export async function getQuizSetsByPodcast(podcastId) {
  const res = await axios.get(
    `${API_BASE_URL}/user/podcasts/${podcastId}/quiz-sets`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

// Lấy danh sách lịch sử làm bài của 1 quiz set
export async function getQuizAttemptsBySet(quizSetId) {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/quiz-sets/${quizSetId}/attempts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data; // axios tự parse JSON
  } catch (err) {
    console.error(
      "Lỗi khi tải lịch sử làm bài:",
      err.response?.data || err.message
    );
    throw err;
  }
}
