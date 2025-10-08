import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Home from "../pages/Home";

// Sinh viên
import UserLayout from "../layouts/UserLayout/UserLayout";
import UserDashboard from "../pages/user/UserDashboard";

// Giảng viên
import TeacherLayout from "../layouts/TeacherLayout/TeacherLayout";
import SubjectPage from "../pages/admin/Subject/SubjectPage";
import TopicPage from "../pages/admin/Topic/TopicPage";
import CategoryPage from "../pages/admin/Category/CategoryPage";
import DocumentPage from "../pages/admin/Document/DocumentPage";
import PodcastPage from "../pages/admin/Podcast/PodcastPage";
import CreatePodcastUpload from "../pages/admin/Podcast/AddPodcast";
import PodcastDetailPage from "../pages/admin/Podcast/PodcastDetail";
import EditPodcast from "../pages/admin/Podcast/EditPodcast";

// Admin hệ thống
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
// Sau này có thể thêm quản lý giảng viên, user
// import ManageLecturerPage from "../pages/admin/ManageLecturerPage";

import ProtectedRoute from "./ProtectedRoute";

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
            user.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : user.role === "teacher" ? (
              <Navigate to="/teacher" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Home />
          )
        }
      />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Sinh viên */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Giảng viên */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SubjectPage />} />
        <Route path="subject" element={<SubjectPage />} />
        <Route path="topic" element={<TopicPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="document" element={<DocumentPage />} />
        <Route path="podcast" element={<PodcastPage />} />
        <Route path="podcast/create" element={<CreatePodcastUpload />} />
        <Route path="podcast/:id" element={<PodcastDetailPage />} />
        <Route path="podcast/:id/edit" element={<EditPodcast />} />
      </Route>

      {/* Admin hệ thống */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="subject" element={<SubjectPage />} />
        <Route path="topic" element={<TopicPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="document" element={<DocumentPage />} />
        <Route path="podcast" element={<PodcastPage />} />
        <Route path="podcast/create" element={<CreatePodcastUpload />} />
        <Route path="podcast/:id" element={<PodcastDetailPage />} />
        {/* Thêm route quản lý giảng viên, user sau này */}
        {/* <Route path="lecturer" element={<ManageLecturerPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoute;
