// src/data/mockData.js
export const mockPodcasts = [
  {
    id: "1",
    title: "Giới thiệu về Machine Learning",
    description:
      "Tổng quan về Machine Learning và ứng dụng thực tế trong các lĩnh vực công nghệ hiện đại. Tìm hiểu về các thuật toán cơ bản và case studies thực tế.",
    audio_url: "/audio/ml-intro.mp3",
    duration_sec: 3600,
    summary: "Bài podcast giới thiệu về ML cơ bản...",
    view_count: 1500,
    like_count: 89,
    status: "published",
    cover_image: "/images/ml-cover.jpg",
    created_at: "2024-01-15",
    categories: [{ id: "1", name: "Công nghệ", slug: "cong-nghe" }],
    topics: [{ id: "1", name: "AI/ML", slug: "ai-ml" }],
    tags: [
      { id: "1", name: "machine-learning" },
      { id: "2", name: "ai" },
    ],
    chapter: {
      title: "Chương 1: Nhập môn AI",
      subject: { name: "Trí tuệ nhân tạo", slug: "tri-tue-nhan-tao" },
    },
  },
  {
    id: "2",
    title: "Lập trình ReactJS từ Zero đến Hero",
    description:
      "Series học ReactJS cho người mới bắt đầu. Từ những khái niệm cơ bản nhất đến các kỹ thuật nâng cao trong phát triển ứng dụng web hiện đại.",
    audio_url: "/audio/react-zero-hero.mp3",
    duration_sec: 2700,
    summary: "Hướng dẫn ReactJS cơ bản...",
    view_count: 2300,
    like_count: 145,
    status: "published",
    cover_image: "/images/react-cover.jpg",
    created_at: "2024-01-10",
    categories: [{ id: "2", name: "Lập trình", slug: "lap-trinh" }],
    topics: [{ id: "2", name: "Frontend", slug: "frontend" }],
    tags: [
      { id: "3", name: "reactjs" },
      { id: "4", name: "javascript" },
    ],
    chapter: {
      title: "Chương 2: React Fundamentals",
      subject: { name: "Web Development", slug: "web-development" },
    },
  },
  {
    id: "3",
    title: "Data Science cho người mới bắt đầu",
    description:
      "Khám phá thế giới Data Science với những ứng dụng thực tế và các công cụ phổ biến trong ngành.",
    audio_url: "/audio/data-science-basic.mp3",
    duration_sec: 3200,
    summary: "Giới thiệu Data Science...",
    view_count: 1800,
    like_count: 92,
    status: "published",
    cover_image: "/images/ds-cover.jpg",
    created_at: "2024-01-08",
    categories: [{ id: "3", name: "Khoa học", slug: "khoa-hoc" }],
    topics: [{ id: "3", name: "Data Science", slug: "data-science" }],
    tags: [
      { id: "5", name: "data-science" },
      { id: "6", name: "python" },
    ],
    chapter: {
      title: "Chương 1: Tổng quan Data Science",
      subject: { name: "Data Science", slug: "data-science" },
    },
  },
];

export const mockSubjects = [
  {
    id: "1",
    name: "Trí tuệ nhân tạo",
    slug: "tri-tue-nhan-tao",
    status: true,
  },
  {
    id: "2",
    name: "Web Development",
    slug: "web-development",
    status: true,
  },
  {
    id: "3",
    name: "Data Science",
    slug: "data-science",
    status: true,
  },
  {
    id: "4",
    name: "Mobile Development",
    slug: "mobile-development",
    status: true,
  },
  {
    id: "5",
    name: "Cloud Computing",
    slug: "cloud-computing",
    status: true,
  },
  {
    id: "6",
    name: "Cybersecurity",
    slug: "cybersecurity",
    status: true,
  },
];

export const mockCategories = [
  { id: "1", name: "Công nghệ", slug: "cong-nghe", status: true },
  { id: "2", name: "Lập trình", slug: "lap-trinh", status: true },
  { id: "3", name: "Khoa học", slug: "khoa-hoc", status: true },
  { id: "4", name: "Kinh doanh", slug: "kinh-doanh", status: true },
  { id: "5", name: "Nghệ thuật", slug: "nghe-thuat", status: true },
  { id: "6", name: "Giáo dục", slug: "giao-duc", status: true },
];
