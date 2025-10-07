import React, { useState, useEffect } from "react";
import { Card, Button, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getPodcastDetail } from "../../../services/api_podcast";

const PodcastDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPodcast = async () => {
    setLoading(true);
    try {
      const res = await getPodcastDetail(id);
      setPodcast(res);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải chi tiết podcast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !podcast) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <Button style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
        Quay lại
      </Button>

      <Card
        hoverable
        cover={
          podcast.cover_image && (
            <img
              alt={podcast.title}
              src={podcast.cover_image}
              style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 4 }}
            />
          )
        }
      >
        <h2>{podcast.title}</h2>
        <p>
          <strong>Trạng thái:</strong> {podcast.status} <br />
          <strong>Lượt xem:</strong> {podcast.view_count} | <strong>Lượt thích:</strong> {podcast.like_count}
        </p>

        {podcast.audio_url && (
          <audio controls style={{ width: "100%", marginBottom: 20 }} src={podcast.audio_url} />
        )}

        {podcast.description && (
          <div>
            <h3>Mô tả</h3>
            <p>{podcast.description}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PodcastDetailPage;
