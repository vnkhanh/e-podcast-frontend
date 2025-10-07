import { Suspense } from "react";
import { ConfigProvider, Spin } from "antd";
import { BrowserRouter } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import AppRoute  from "./routes/AppRoute";
import './styles/App.css';
const App = () => {
  return (
     <BrowserRouter>
        <AppRoute />
     </BrowserRouter>
  );
};

export default App;
