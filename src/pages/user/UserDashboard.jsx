import React from 'react'
import LogoutButton from '../../components/LogoutButton'

function UserDashboard() {
  return (
    <Layout>
      <AppHeader />
      <Content>
        <HeroSection />
        <CategorySection />
        <FeaturedPodcasts />
        <PopularCourses />
        <Testimonials />
      </Content>
      <AppFooter />
    </Layout>
  )
}

export default UserDashboard
