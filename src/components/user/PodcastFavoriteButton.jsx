import React, { useState, useEffect } from "react";
import {
  addFavorite,
  removeFavorite,
  getAllFavorites,
} from "../../services/api_favorite";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { getPodcastById } from "../../services/api_podcast"; // thêm nếu có

const PodcastFavoriteButton = ({ podcastId, onLikeChange }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const token = localStorage.getItem("token");

  const toggleFavorite = async () => {
    try {
      if (!token) return;

      if (isFavorited) {
        await removeFavorite(token, podcastId);
        setIsFavorited(false);
        if (onLikeChange) {
          // Gọi lại API để lấy like_count mới
          const updated = await getPodcastById(podcastId);
          onLikeChange(updated.like_count);
        }
      } else {
        await addFavorite(token, podcastId);
        setIsFavorited(true);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        if (onLikeChange) {
          const updated = await getPodcastById(podcastId);
          onLikeChange(updated.like_count);
        }
      }
    } catch (err) {
      console.error("toggleFavorite error:", err);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const favorites = await getAllFavorites(token);
        const isFav = favorites.some((fav) => fav.podcast_id === podcastId);
        setIsFavorited(isFav);
      } catch (err) {
        console.error("getAllFavorites error:", err);
      }
    };
    fetchFavorites();
  }, [podcastId, token]);

  return (
    <button
      onClick={toggleFavorite}
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
