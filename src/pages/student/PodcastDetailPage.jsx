import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Divider,
  Button,
  Spin,
  Modal,
  Space,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  BulbOutlined,
} from "@ant-design/icons";

import FlashcardStudySection from "./FlashcardStudySection";
import {
  getPodcastDetail,
  createFlashcards,
  getFlashcardsByPodcast,
} from "../../services/api_flashcards";

const { Title, Paragraph, Text } = Typography;

const PodcastDetailPageUser = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const audioRef = useRef(null);

  // === Lấy dữ liệu podcast ===
  useEffect(() => {
    (async () => {
      try {
        const data = await getPodcastDetail(id);
        setPodcast(data);
        fetchFlashcards(id);
      } catch (err) {
        console.error(err);
        message.error("Không tải được podcast!");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handlePlay = () => {
    if (audioRef.current) audioRef.current.play();
  };

  const fetchFlashcards = async (podcastId) => {
    try {
      const { flashcards } = await getFlashcardsByPodcast(podcastId);
      setFlashcards(flashcards);
    } catch (err) {
      console.error(err);
      message.error("Không tải được flashcards!");
    }
  };

  // === Tạo flashcards ===
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await createFlashcards(podcast.Document.id);
      await fetchFlashcards(id);
      message.success("Tạo flashcards thành công!");
      setShowCreateModal(false);
      setShowListModal(true);
    } catch (err) {
      message.error("Lỗi khi tạo flashcards!");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };


  // === Xem flashcards có sẵn ===
  const handleViewFlashcards = async () => {
    await fetchFlashcards(id);
    if (flashcards.length === 0) {
      message.info("Chưa có flashcard nào cho podcast này.");
    } else {
      message.success("Lấy flashcards thành công!");
      setShowListModal(true);
    }
  };


  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );

  if (!podcast)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Text type="warning">Không tìm thấy podcast</Text>
      </div>
    );

  const { title, description, audio_url, created_at, cover_image, categories, topics, Document } =
    podcast;

  return (
    <Row gutter={[24, 24]} justify="center" style={{ padding: "24px" }}>
      {/* Nội dung chính */}
      <Col xs={24} lg={16}>
        <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          {cover_image && (
            <img
              src={cover_image}
              alt={title}
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
          <Title level={2} style={{ marginTop: 16 }}>
            {title}
          </Title>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
            {description || Document?.extracted_text}
          </Paragraph>

          {audio_url && (
            <audio
              ref={audioRef}
              controls
              style={{ width: "100%", margin: "16px 0", borderRadius: 8 }}
            >
              <source src={audio_url} type="audio/wav" />
            </audio>
          )}

          <Space style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handlePlay}
              disabled={!audio_url}
            >
              Nghe ngay
            </Button>

            <Button
              icon={<ReadOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: "Chọn hành động",
                  content: "Bạn muốn tạo flashcards mới hay xem lại các flashcards đã tạo?",
                  okText: "Tạo mới",
                  cancelText: "Xem lại",
                  onOk: () => setShowCreateModal(true),
                  onCancel: handleViewFlashcards,
                })
              }
            >
              Flashcards
            </Button>
          </Space>
        </Card>
      </Col>

      {/* Sidebar */}
      <Col xs={24} lg={8}>
        <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          <Title level={4}>Thông tin podcast</Title>
          <Divider />
          {Document && (
            <Text>
              <FileTextOutlined />{" "}
              <a href={Document.file_path} target="_blank" rel="noreferrer">
                {Document.original_name} ({Document.file_type})
              </a>
            </Text>
          )}
          <br />
          <Text>
            <ClockCircleOutlined /> Ngày tạo: {new Date(created_at).toLocaleString("vi-VN")}
          </Text>

          {categories?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Text strong>Danh mục:</Text>
              {categories.map((cat) => (
                <Tag key={cat.id} color="blue">
                  {cat.name}
                </Tag>
              ))}
            </div>
          )}

          {topics?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Text strong>Chủ đề:</Text>
              {topics.map((topic) => (
                <Tag key={topic.id} color="green">
                  {topic.name}
                </Tag>
              ))}
            </div>
          )}
        </Card>
      </Col>

      {/* Modal tạo flashcards */}
      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        title="Tạo Flashcards mới"
      >
        <p>Bạn muốn tạo flashcards tự động dựa trên nội dung podcast này.</p>
        <Button
          type="primary"
          icon={<BulbOutlined />}
          loading={generating}
          onClick={handleGenerateFlashcards}
        >
          Tạo bằng AI (Gemini)
        </Button>
      </Modal>

      {/* Modal xem flashcards */}
      <Modal
        open={showListModal}
        onCancel={() => setShowListModal(false)}
        footer={null}
        width={600}
        title="Flashcards của bạn"
      >
        {flashcards.length > 0 ? (
          <FlashcardStudySection 
            flashcards={flashcards} 
            docId={podcast.Document?.id} 
          />
        ) : (
          <Text type="secondary">Chưa có flashcard nào.</Text>
        )}
      </Modal>

    </Row>
  );
};

export default PodcastDetailPageUser;
