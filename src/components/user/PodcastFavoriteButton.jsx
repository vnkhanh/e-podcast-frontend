import React, { useState, useEffect } from "react";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "../../services/api_favorite";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { getPodcastById } from "../../services/api_podcast";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

const PodcastFavoriteButton = ({ podcastId, onLikeChange }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const toggleFavorite = async () => {
    // Nếu chưa đăng nhập → hiển thị yêu cầu đăng nhập
    if (!token) {
      Modal.confirm({
        title: "Yêu cầu đăng nhập",
        content: "Bạn cần đăng nhập để thêm podcast vào danh sách yêu thích.",
        okText: "Đăng nhập ngay",
        cancelText: "Hủy",
        centered: true,
        onOk: () => navigate("/auth/login"),
      });
      return;
    }

    try {
      if (isFavorited) {
        await removeFavorite(token, podcastId);
        setIsFavorited(false);
      } else {
        await addFavorite(token, podcastId);
        setIsFavorited(true);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }

      // Sau khi thêm hoặc bỏ, gọi lại API để cập nhật like_count
      if (onLikeChange) {
        const updated = await getPodcastById(podcastId);
        onLikeChange(updated.like_count);
      }
    } catch (err) {
      console.error("toggleFavorite error:", err);
    }
  };

  // === Lấy danh sách yêu thích ban đầu ===
  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return;
      try {
        const isFav = await checkFavorite(token, podcastId);
        setIsFavorited(isFav);
      } catch (err) {
        console.error("checkFavorite error:", err);
      }
    };
    fetchStatus();
  }, [podcastId, token]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {isFavorited ? (
        <HeartFilled
          style={{
            color: "rgb(255,72,88)",
            fontSize: 26,
            filter: "drop-shadow(0 0 6px rgba(255,72,88,0.6))",
            transform: isAnimating ? "scale(1.3)" : "scale(1)",
            transition: "transform 0.25s ease, filter 0.3s ease",
          }}
        />
      ) : (
        <HeartOutlined style={{ color: "#999", fontSize: 26 }} />
      )}
    </button>
  );
};

export default PodcastFavoriteButton;
