import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
// Trang chủ
import HomePage from "../pages/HomePage";
import NotificationList from "../components/NotificationList";
// Sinh viên
import UserLayout from "../layouts/UserLayout/UserLayout";
import CategoryPodcastsPage from "../pages/student/Category/CategoryPodcastsPage";
import PodcastDetailPageUser from "../pages/student/PodcastDetail/PodcastDetailPage";
import UserProfile from "../pages/student/UserProfile";
import QuizSetsListPage from "../pages/student/Quiz/QuizSetsListPage";
import QuizTakePage from "../pages/student/Quiz/QuizTakePage";
import QuizHistoryPage from "../pages/student/Quiz/QuizHistoryPage";
import QuizAttemptDetailPage from "../pages/student/Quiz/QuizAttemptDetailPage";
import SubjectDetailPage from "../pages/student/Subject/SubjectDetailPage";
import SearchPage from "../pages/student/SearchPage";
import CategoryList from "../pages/student/Category/CategoryList";
import PodcastLibrary from "../pages/student/PodcastLibrary";

// Admin & Teacher dùng chung layout
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SubjectPage from "../pages/admin/Subject/SubjectPage";
import CategoryPage from "../pages/admin/Category/CategoryPage";
import DocumentPage from "../pages/admin/Document/DocumentPage";
import PodcastPage from "../pages/admin/Podcast/PodcastPage";
import CreatePodcastUpload from "../pages/admin/Podcast/AddPodcast";
import PodcastDetailPage from "../pages/admin/Podcast/PodcastDetail";
import EditPodcast from "../pages/admin/Podcast/EditPodcast";
import UserPage from "../pages/admin/User/UserPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminProfile from "../pages/admin/AdminProfile";
import SubjectListPage from "../pages/student/Subject/SubjectListPage";
import TeacherAssignments from "../pages/admin/Assignment/TeacherAssignments";
import AssignmentDetail from "../pages/student/Assignment/AssignmentDetail";
import DoAssignmentPage from "../pages/student/Assignment/DoAssignmentPage";
import AssignmentSubmissionsPage from "../pages/admin/Assignment/AssignmentSubmissionsPage";
const AppRoute = () => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  return (
    <Routes>
      {/* Trang chủ */}
      <Route
        path="/"
        element={
          token && user ? (
            user.role === "student" ? (
              <Navigate to="/" replace />
            ) : user.role === "teacher" ? (
              <Navigate to="/teacher" replace />
            ) : user.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <HomePage />
            )
          ) : (
            <HomePage />
          )
        }
      />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Sinh viên */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="categories/:slug" element={<CategoryPodcastsPage />} />
        <Route path="podcast/:id" element={<PodcastDetailPageUser />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="podcast/:id/quiz-sets" element={<QuizSetsListPage />} />
        <Route path="quiz-sets/:id/take" element={<QuizTakePage />} />
        <Route path="/quiz-sets/:id/history" element={<QuizHistoryPage />} />
        <Route
          path="/quiz-attempts/:attemptId"
          element={<QuizAttemptDetailPage />}
        />
        <Route path="/subjects/:slug" element={<SubjectDetailPage />} />
        <Route path="/subjects" element={<SubjectListPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="notifications" element={<NotificationList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/podcasts" element={<PodcastLibrary />} />

        <Route
          path="/assignment/:id"
          element={<AssignmentDetail key={token} token={token} />}
        />
        <Route
          path="/assignment/:id/start"
          element={<DoAssignmentPage key={token} token={token} />}
        />
      </Route>

      {/* Teacher & Admin dùng chung layout */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SubjectPage />} />
        <Route path="subject" element={<SubjectPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="document" element={<DocumentPage />} />
        <Route path="podcast" element={<PodcastPage />} />
        <Route path="podcast/create" element={<CreatePodcastUpload />} />
        <Route path="podcast/:id" element={<PodcastDetailPage />} />
        <Route path="podcast/:id/edit" element={<EditPodcast />} />
        <Route path="notifications" element={<NotificationList />} />
        <Route path="me" element={<AdminProfile />} />
        <Route path="assignment" element={<TeacherAssignments />} />
        <Route
          path="assignments/:id/submissions"
          element={<AssignmentSubmissionsPage />}
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="subject" element={<SubjectPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="document" element={<DocumentPage />} />
        <Route path="podcast" element={<PodcastPage />} />
        <Route path="podcast/create" element={<CreatePodcastUpload />} />
        <Route path="podcast/:id" element={<PodcastDetailPage />} />
        <Route path="user" element={<UserPage />} />
        <Route path="notifications" element={<NotificationList />} />
        <Route path="me" element={<AdminProfile />} />
        <Route path="assignment" element={<TeacherAssignments />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
