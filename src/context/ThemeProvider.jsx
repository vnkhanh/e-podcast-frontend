import React, { useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

import { ThemeContext } from "./useTheme";

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const themeConfig = {
    algorithm: isDarkMode
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#1677ff",
      borderRadius: 8,
      fontSize: 14,
    },
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#141414" : "#f5f6fa";
    document.body.style.color = isDarkMode ? "#fff" : "#000";
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
