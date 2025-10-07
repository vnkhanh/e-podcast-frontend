import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import UserDashboard from "../pages/user/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserLayout from "../layouts/UserLayout/UserLayout";
import SubjectPage from "../pages/admin/Subject/SubjectPage";
import TopicPage from "../pages/admin/Topic/TopicPage";
import CategoryPage from "../pages/admin/Category/CategoryPage";
import DocumentPage from "../pages/admin/Document/DocumentPage";
import CreatePodcastUpload from "../pages/admin/Podcast/AddPodcast";
import PodcastPage from "../pages/admin/Podcast/PodcastPage";
import PodcastDetailPage from "../pages/admin/Podcast/PodcastDetail";

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

      {/* User */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin layout + routes con */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
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


        {/* sau này thêm route khác */}
        {/* <Route path="podcasts" element={<Podcasts />} /> */}
        {/* <Route path="users" element={<Users />} /> */}
      </Route>

    </Routes>
  );
};

export default AppRoute;
