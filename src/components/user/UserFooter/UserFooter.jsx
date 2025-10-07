import { Layout } from "antd";
const { Footer } = Layout;

const UserFooter = () => {
  return (
    <Footer className="text-center bg-white shadow-inner py-4">
      © {new Date().getFullYear()} E-Podcast. Học tập thông minh qua podcast 🎧
    </Footer>
  );
};

export default UserFooter;
