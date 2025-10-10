import React from "react";
import { Layout } from "antd";
import HeroSection from "../../components/user/HeroSection";
import CategorySection from "../../components/user/CategorySection";
import FeaturedPodcasts from "../../components/user/FeaturedPodcasts";
import PopularCourses from "../../components/user/PopularCourses";
import Testimonials from "../../components/user/Testimonials";

const { Content } = Layout;

function UserDashboard() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedPodcasts />
      <PopularCourses />
      <Testimonials />
    </>
  );
}

export default UserDashboard;
