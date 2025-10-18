import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Tag,
  Spin,
  message,
  Card,
  Divider,
  Modal,
  Row,
  List,
  Avatar,
  Progress,
  Button,
  Collapse,
  Space,
} from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  ReadOutlined,
  HistoryOutlined,
  BulbOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import CustomAudioPlayer from "../../../components/AudioPlayer";
import FlashcardStudySection from "./FlashcardStudySection";
import CollapsibleSummary from "./CollapsibleSummary";
import {
  getPodcastDetail,
  createFlashcards,
  getFlashcardsByPodcast,
} from "../../../services/api_flashcards";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../utils/useTheme";
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const PodcastDetailPageUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  // const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [progress, setProgress] = useState(40); // ví dụ
  const [flashcards, setFlashcards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { isDarkMode } = useContext(ThemeContext);

  const overlayGradient = isDarkMode
    ? "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))"
    : "linear-gradient(to bottom, rgba(255,255,255,0.6), #fafafa)";

  const fetchFlashcards = async (podcastId) => {
    try {
      const { flashcards } = await getFlashcardsByPodcast(podcastId);
      setFlashcards(flashcards);
    } catch (err) {
      console.error(err);
      message.error("Không tải được flashcards!");
    }
  };

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const res = await getPodcastDetail(id);
        console.log("Podcast detail raw:", res);

        // Dữ liệu thực tế là object podcast, không bọc trong data
        const podcastData = res.data || res;
        console.log("Parsed podcast data:", podcastData);

        if (!podcastData?.id) {
          console.error("Không tìm thấy ID trong podcastData:", podcastData);
          message.error("Dữ liệu podcast không hợp lệ!");
          return;
        }

        setPodcast(podcastData);
        await fetchFlashcards(podcastData.id);
      } catch (err) {
        console.error("Lỗi fetchPodcast:", err);
        message.error("Không thể tải dữ liệu podcast");
      } finally {
        setLoading(false);
      }
    };

    // const fetchRelated = async () => {
    //   try {
    //     const res = await axios.get(`${API_BASE_URL}/user/podcasts`);
    //     setRelated(res.data.data.slice(0, 4));
    //   } catch (err) {
    //     console.error("Không thể tải podcast liên quan");
    //   }
    // };

    fetchPodcast();
    // fetchRelated();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-600">
        <Spin size="large" tip="Đang tải podcast..." />
      </div>
    );

  if (!podcast)
    return (
      <div className="text-center mt-10 text-gray-400 bg-white h-screen">
        Không tìm thấy podcast.
      </div>
    );

  // === Tạo flashcards ===
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await createFlashcards(podcast.Document.id);
      await fetchFlashcards(podcast.id);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#222",
      }}
    >
      {/* ==== HEADER SECTION ==== */}
      <div
        style={{
          height: 280,
          backgroundImage: `${overlayGradient}, url(${podcast.cover_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          padding: "40px 80px",
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <img
            src={podcast.cover_image}
            alt={podcast.title}
            style={{
              width: 160,
              height: 160,
              borderRadius: 16,
              objectFit: "cover",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          />
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              {podcast.title}
            </Title>
            <Paragraph style={{ color: "#666", maxWidth: 600 }}>
              {podcast.description}
            </Paragraph>
            <Space>
              <Tag color="blue" icon={<EyeOutlined />}>
                {podcast.view_count} lượt xem
              </Tag>
              <Tag color="magenta" icon={<HeartOutlined />}>
                {podcast.like_count} lượt thích
              </Tag>
            </Space>
          </div>
        </div>
      </div>

      {/* ==== MAIN CONTENT ==== */}
      <div
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          padding: "0 5px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Title level={4}>Tóm tắt</Title>
            <CollapsibleSummary text={podcast.summary} />

            <Title level={4}>Bắt đầu học</Title>

            <CustomAudioPlayer
              src={podcast.audio_url}
              podcastId={podcast.id}
              size="default" // 'small' | 'default' | 'large'
              style={{ marginTop: 16 }}
            />

            <Progress
              // percent={progress}
              strokeColor="#1DB954"
              trailColor="#eee"
              style={{ marginBottom: 16 }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                style={{
                  backgroundColor: "#1DB954",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Tiếp tục học
              </Button>
              <Button
                icon={<HeartOutlined />}
                style={{
                  color: "#555",
                  borderColor: "#ddd",
                }}
              >
                Yêu thích
              </Button>
            </div>

            <Divider />

            {/* === Chương học === */}
            <Title level={4}>Nội dung bài học</Title>
            <Collapse accordion bordered={false}>
              {(
                podcast.lessons || [
                  { title: "Giới thiệu", duration: "3:24" },
                  { title: "Nội dung chính", duration: "8:12" },
                  { title: "Tổng kết và quiz", duration: "4:10" },
                ]
              ).map((lesson, index) => (
                <Panel
                  header={
                    <div style={{ fontWeight: 500 }}>
                      {lesson.title || `Bài ${index + 1}`}
                    </div>
                  }
                  key={index}
                  extra={<Text type="secondary">{lesson.duration || ""}</Text>}
                >
                  <Paragraph>
                    {lesson.description ||
                      "Nội dung bài học chi tiết sẽ hiển thị tại đây."}
                  </Paragraph>
                  <Button
                    icon={<PlayCircleOutlined />}
                    size="small"
                    style={{
                      background: "#1DB954",
                      border: "none",
                      color: "white",
                    }}
                  >
                    Nghe bài này
                  </Button>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Tài liệu */}
          {podcast.Document && (
            <Card
              title="Tài liệu học"
              variant={false}
              style={{
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <FileTextOutlined style={{ marginRight: 8, color: "#1DB954" }} />
              <a
                href={podcast.Document.file_path}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1DB954", fontWeight: 500 }}
              >
                {podcast.Document.original_name}
              </a>
            </Card>
          )}

          {/* Quiz */}
          <Card
            title="Ôn tập"
            variant={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Paragraph>
              Tự tạo trắc nghiệm hoặc flashcard để kiểm tra kiến thức sau khi
              nghe xong podcast.
            </Paragraph>
            <Row gutter={16} justify="space-around" align="middle">
              <Button
                icon={<ReadOutlined />}
                type="primary"
                onClick={() =>
                  Modal.confirm({
                    title: "Chọn hành động",
                    content:
                      "Bạn muốn tạo flashcards mới hay xem lại các flashcards đã tạo?",
                    okText: "Tạo mới",
                    cancelText: "Xem lại",
                    onOk: () => setShowCreateModal(true),
                    onCancel: handleViewFlashcards,
                  })
                }
              >
                Flashcards
              </Button>

              <Button
                icon={<HistoryOutlined />}
                onClick={() => navigate(`/quiz/${podcast.id}`)}
                type="primary"
              >
                Trắc nghiệm
              </Button>
            </Row>
          </Card>

          {/* Podcast liên quan */}
          <Card
            title="Gợi ý khác"
            variant={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <List
              itemLayout="horizontal"
              // dataSource={related}
              renderItem={(item) => (
                <List.Item
                  onClick={() =>
                    (window.location.href = `/podcasts/${item.id}`)
                  }
                  style={{
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: 12,
                    transition: "all 0.2s",
                  }}
                  className="hover:bg-gray-50"
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={60}
                        src={item.cover_image}
                        icon={<PlayCircleOutlined />}
                      />
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Text type="secondary">
                        {item.description?.slice(0, 60)}...
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Modal tạo flashcards */}
          <Modal
            open={showCreateModal}
            onCancel={() => setShowCreateModal(false)}
            footer={null}
            title="Tạo Flashcards mới"
          >
            <p>
              Bạn muốn tạo flashcards tự động dựa trên nội dung podcast này.
            </p>
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
        </div>
      </div>
    </div>
  );
};

export default PodcastDetailPageUser;
