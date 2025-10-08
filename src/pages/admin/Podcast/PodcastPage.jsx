import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Input, Space, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { listPodcasts } from "../../../services/api_podcast";
import AudioPlayer from "../../../components/AudioPlayer";

const { Search } = Input;

const PodcastPage = () => {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  const fetchData = async (page = 1, limit = 12, searchText = "") => {
    setLoading(true);
    try {
      const res = await listPodcasts({ page, limit, search: searchText });
      setPodcasts(res.data);
      setPagination({
        current: res.page,
        pageSize: res.limit,
        total: res.total,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách podcast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    fetchData(1, pagination.pageSize, value);
  };

  return (
    <div style={{ padding: 20 }}>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Tìm kiếm podcast"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
          enterButton
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/teacher/podcast/create")}
        >
          Tạo Podcast
        </Button>
      </Space>
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        {podcasts.map((podcast) => (
          <Col
            key={podcast.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              hoverable
              style={{ width: 220 }}
              cover={
                podcast.cover_image && (
                  <img
                    alt={podcast.title}
                    src={podcast.cover_image}
                    style={{
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                )
              }
              actions={[
                <Button
                  type="link"
                  onClick={() => navigate(`/teacher/podcast/${podcast.id}`)}
                >
                  Xem chi tiết
                </Button>,
              ]}
            >
              <Card.Meta
                title={podcast.title}
                description={
                  <>
                    <div>Trạng thái: {podcast.status}</div>
                    <div>
                      Lượt xem: {podcast.view_count} | Lượt thích:{" "}
                      {podcast.like_count}
                    </div>
                    {podcast.audio_url && <AudioPlayer src={podcast.audio_url} />}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
      {/* Pagination */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Button
          disabled={pagination.current <= 1}
          onClick={() =>
            fetchData(pagination.current - 1, pagination.pageSize, search)
          }
          style={{ marginRight: 8 }}
        >
          Trang trước
        </Button>
        <span>
          {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
        </span>
        <Button
          disabled={
            pagination.current >=
            Math.ceil(pagination.total / pagination.pageSize)
          }
          onClick={() =>
            fetchData(pagination.current + 1, pagination.pageSize, search)
          }
          style={{ marginLeft: 8 }}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default PodcastPage;