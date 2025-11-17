import React, { useEffect, useState, useContext, useRef } from "react";
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
  Col,
  Badge,
  Alert,
} from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  ReadOutlined,
  HistoryOutlined,
  BulbOutlined,
  EyeOutlined,
  HeartOutlined,
  PauseCircleOutlined,
  BookOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import FlashcardStudySection from "./FlashcardStudySection";
import CommentSection from "../../../components/user/CommentSection";
import CollapsibleSummary from "./CollapsibleSummary";
import {
  createFlashcards,
  getFlashcardsByPodcast,
} from "../../../services/api_flashcards";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ThemeContext } from "../../../context/useTheme";
import { getPodcastById } from "../../../services/api_podcast";
import { formatTime } from "../../../utils/helpers";
import { getPodcastHistory } from "../../../services/api_history";
import PodcastFavoriteButton from "../../../components/user/PodcastFavoriteButton";
import SharePodcastButton from "../../../components/user/SharePodcastButton";
import { usePlayer } from "../../../context/usePlayer";
import { getAssignmentsByPodcast } from "../../../services/api_assignment";
import PodcastAssignments from "../Assignment/PodcastAssignments";
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const PodcastDetailPageUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [, setStartTime] = useState(0);
  const token = localStorage.getItem("token");

  const location = useLocation();
  const commentSectionRef = useRef(null);

  const { currentPodcast, isPlaying, handlePlay } = usePlayer();

  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const query = new URLSearchParams(location.search);
  const queryStart = parseFloat(query.get("t")) || 0;
  const { isDarkMode } = useContext(ThemeContext);
  const [assignments, setAssignments] = useState([]);

  const overlayGradient = isDarkMode
    ? "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))"
    : "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))";

  const fetchFlashcards = async (podcastId) => {
    try {
      const { flashcards } = await getFlashcardsByPodcast(podcastId);
      setFlashcards(flashcards);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAssignments = async (podcastId) => {
    try {
      const res = await getAssignmentsByPodcast(podcastId);
      setAssignments(res.assignments || []);
    } catch (err) {
      console.error("Lỗi lấy bài tập:", err);
    }
  };
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const res = await getPodcastById(id);
        console.log("Podcast detail raw:", res);

        const podcastObj = res.data?.data || res.data || res;
        const chapterList = res.data?.chapters || res.chapters || [];

        if (!podcastObj?.id) {
          console.error("Không tìm thấy ID trong podcastObj:", podcastObj);
          message.error("Dữ liệu podcast không hợp lệ!");
          return;
        }

        setPodcast(podcastObj);
        setChapters(chapterList);
        await Promise.all([
          fetchFlashcards(podcastObj.id),
          fetchAssignments(podcastObj.id),
        ]);
      } catch (err) {
        console.error("Lỗi fetchPodcast:", err);
        message.error("Không thể tải dữ liệu podcast");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  useEffect(() => {
    const scrollToComment = location.state?.scrollToComment;

    if (scrollToComment && commentSectionRef.current) {
      setTimeout(() => {
        const commentElement = document.getElementById(
          `comment-${scrollToComment}`
        );

        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          commentElement.style.transition = "background-color 1s";
          commentElement.style.backgroundColor = "#fff9c4";

          setTimeout(() => {
            commentElement.style.backgroundColor = "";
          }, 2000);
        } else {
          commentSectionRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 500);
    }
  }, [location.state, id]);

  useEffect(() => {
    const fetchListeningHistory = async () => {
      if (!token) {
        if (queryStart > 0) setStartTime(queryStart);
        return;
      }

      try {
        const res = await getPodcastHistory(id, token);
        const hist = res?.data;
        let position = 0;

        if (queryStart > 0) {
          position = queryStart;
        } else if (hist && !hist.completed && hist.last_position > 10) {
          position = hist.last_position;
        }

        setStartTime(position);
        if (position > 0) console.log("Tiếp tục nghe từ giây:", position);
      } catch (err) {
        console.log(
          "Không có lịch sử nghe:",
          err.response?.data || err.message
        );
        if (queryStart > 0) setStartTime(queryStart);
      }
    };

    fetchListeningHistory();
  }, [id, token, queryStart]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Spin
          size="large"
          tip={
            <Text style={{ color: "white", fontSize: 16 }}>
              Đang tải podcast...
            </Text>
          }
        />
      </div>
    );
  }

  if (!podcast) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <Title level={3} style={{ color: "#666", marginBottom: 16 }}>
            Không tìm thấy podcast
          </Title>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: 8,
            }}
          >
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

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
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        {/* HEADER SECTION */}
        <Card
          style={{
            marginBottom: 32,
            background: `linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url(${podcast.cover_image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "none",
            borderRadius: 20,
            color: "white",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "radial-gradient(circle at top right, rgba(120, 119, 198, 0.3), transparent 50%)",
            }}
          />

          <div style={{ padding: 32, position: "relative" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                marginBottom: 20,
                borderRadius: 8,
                backdropFilter: "blur(10px)",
                fontWeight: 500,
              }}
            >
              Quay lại
            </Button>

            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={16}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 20,
                    marginBottom: 16,
                  }}
                >
                  <Avatar
                    size={80}
                    src={podcast.cover_image}
                    icon={<UserOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "3px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Title
                      level={1}
                      style={{
                        color: "white",
                        margin: "0 0 8px 0",
                        fontSize: 28,
                      }}
                    >
                      {podcast.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.5,
                      }}
                    >
                      {podcast.description}
                    </Paragraph>
                  </div>
                </div>

                <Space wrap size={[12, 12]}>
                  <Tag
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 20,
                      padding: "4px 12px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <EyeOutlined style={{ marginRight: 4 }} />
                    {podcast.view_count} lượt xem
                  </Tag>
                  <Tag
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 20,
                      padding: "4px 12px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <HeartOutlined style={{ marginRight: 4 }} />
                    {podcast.like_count} lượt thích
                  </Tag>
                </Space>
              </Col>

              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  icon={
                    currentPodcast?.id === podcast.id && isPlaying ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )
                  }
                  onClick={() => handlePlay(podcast, queryStart)}
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 600,
                    height: 56,
                    width: "100%",
                    fontSize: 16,
                    boxShadow: "0 4px 16px rgba(255, 107, 53, 0.4)",
                  }}
                >
                  {currentPodcast?.id === podcast.id && isPlaying
                    ? "Tạm dừng"
                    : "Bắt đầu nghe"}
                </Button>
              </Col>
            </Row>
          </div>
        </Card>

        {/* MAIN CONTENT */}
        <Row gutter={[32, 32]}>
          {/* LEFT CONTENT */}
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 20,
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                marginBottom: 24,
              }}
              bodyStyle={{ padding: 32 }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {/* SUMMARY SECTION */}
                <div>
                  <Title
                    level={3}
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <BookOutlined style={{ color: "#667eea" }} />
                    Tóm tắt nội dung
                  </Title>
                  <CollapsibleSummary text={podcast.summary} />
                </div>

                <Divider />

                {/* ACTION BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <PodcastFavoriteButton
                    podcastId={podcast.id}
                    onLikeChange={(newCount) =>
                      setPodcast({ ...podcast, like_count: newCount })
                    }
                  />
                  <SharePodcastButton
                    podcastId={podcast.id}
                    podcastTitle={podcast.title}
                  />
                </div>

                <Divider />

                {/* CHAPTERS SECTION */}
                <div>
                  <Title
                    level={3}
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <BookOutlined style={{ color: "#667eea" }} />
                    Nội dung bài học
                  </Title>

                  {chapters.length > 0 ? (
                    <Collapse
                      accordion
                      bordered={false}
                      style={{
                        background: "transparent",
                      }}
                    >
                      {chapters.map((chapter, index) => {
                        const isCurrentChapter =
                          chapter.id === podcast.Chapter?.id;
                        return (
                          <Panel
                            key={chapter.id}
                            header={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                }}
                              >
                                <Badge
                                  count={index + 1}
                                  style={{
                                    backgroundColor: isCurrentChapter
                                      ? "#52c41a"
                                      : "#667eea",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <Text strong style={{ fontSize: 16 }}>
                                  {chapter.title}
                                </Text>
                                {isCurrentChapter && (
                                  <Tag
                                    color="green"
                                    style={{ marginLeft: "auto" }}
                                  >
                                    Hiện tại
                                  </Tag>
                                )}
                              </div>
                            }
                            style={{
                              borderRadius: 12,
                              marginBottom: 12,
                              border: "1px solid #f0f0f0",
                            }}
                          >
                            {chapter.podcasts?.length > 0 ? (
                              <List
                                dataSource={chapter.podcasts}
                                renderItem={(p) => (
                                  <List.Item
                                    style={{
                                      cursor: "pointer",
                                      padding: "12px 16px",
                                      borderRadius: 8,
                                      background:
                                        p.id === podcast.id
                                          ? overlayGradient
                                          : "transparent",
                                      border:
                                        p.id === podcast.id
                                          ? "1px solid #667eea"
                                          : "1px solid transparent",
                                      transition: "all 0.3s ease",
                                      marginBottom: 8,
                                    }}
                                    onClick={() => {
                                      if (p.id !== podcast.id)
                                        navigate(`/podcast/${p.id}`);
                                    }}
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          shape="square"
                                          size={48}
                                          src={p.cover_image}
                                          icon={<PlayCircleOutlined />}
                                          style={{ borderRadius: 8 }}
                                        />
                                      }
                                      title={
                                        <Text strong ellipsis={2}>
                                          {p.title}
                                        </Text>
                                      }
                                      description={
                                        <Text type="secondary" ellipsis={2}>
                                          {p.description || "Không có mô tả"}
                                        </Text>
                                      }
                                    />
                                    <Tag
                                      style={{
                                        background: "rgba(102, 126, 234, 0.1)",
                                        color: "#667eea",
                                        border: "none",
                                        borderRadius: 12,
                                      }}
                                    >
                                      {formatTime(p.duration_sec)}
                                    </Tag>
                                  </List.Item>
                                )}
                              />
                            ) : (
                              <Text type="secondary">
                                Chưa có bài học nào trong chương này.
                              </Text>
                            )}
                          </Panel>
                        );
                      })}
                    </Collapse>
                  ) : (
                    <Text type="secondary">
                      Không có chương nào được tìm thấy.
                    </Text>
                  )}
                </div>

                <Divider />

                {/* COMMENTS SECTION */}
                <div ref={commentSectionRef}>
                  <CommentSection podcastId={podcast.id} />
                </div>
              </Space>
            </Card>
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: "100%" }} size={24}>
              {/* DOCUMENT CARD */}
              {podcast.Document && (
                <Card
                  style={{
                    borderRadius: 16,
                    border: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Title
                    level={4}
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FileTextOutlined style={{ color: "#667eea" }} />
                    Tài liệu học
                  </Title>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <a
                      href={podcast.Document.file_path}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#667eea",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                    >
                      {podcast.Document.original_name}
                    </a>
                  </div>
                </Card>
              )}

              {/* STUDY CARD */}
              <Card
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Title
                  level={4}
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ReadOutlined style={{ color: "#667eea" }} />
                  Ôn tập
                </Title>
                <Paragraph style={{ color: "#666", marginBottom: 20 }}>
                  Tự tạo trắc nghiệm hoặc flashcard để kiểm tra kiến thức sau
                  khi nghe xong podcast.
                </Paragraph>

                <Space direction="vertical" style={{ width: "100%" }} size={12}>
                  <Button
                    type="primary"
                    icon={<ReadOutlined />}
                    size="large"
                    block
                    onClick={() => {
                      if (!token) {
                        Modal.confirm({
                          title: "Yêu cầu đăng nhập",
                          content:
                            "Bạn cần đăng nhập để sử dụng tính năng Flashcards.",
                          okText: "Đăng nhập ngay",
                          cancelText: "Hủy",
                          centered: true,
                          onOk: () => navigate("/auth/login"),
                        });
                        return;
                      }

                      Modal.confirm({
                        title: "Chọn hành động",
                        content:
                          "Bạn muốn tạo flashcards mới hay xem lại các flashcards đã tạo?",
                        okText: "Tạo mới",
                        cancelText: "Xem lại",
                        onOk: () => setShowCreateModal(true),
                        onCancel: handleViewFlashcards,
                      });
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      borderRadius: 8,
                      height: 48,
                    }}
                  >
                    Flashcards
                  </Button>

                  <Button
                    type="primary"
                    icon={<HistoryOutlined />}
                    size="large"
                    block
                    onClick={() => {
                      if (!token) {
                        Modal.confirm({
                          title: "Yêu cầu đăng nhập",
                          content: "Bạn cần đăng nhập để làm bài trắc nghiệm.",
                          okText: "Đăng nhập ngay",
                          cancelText: "Hủy",
                          centered: true,
                          onOk: () => navigate("/auth/login"),
                        });
                        return;
                      }
                      navigate(`/podcast/${podcast.id}/quiz-sets`);
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                      border: "none",
                      borderRadius: 8,
                      height: 48,
                    }}
                  >
                    Trắc nghiệm
                  </Button>
                </Space>
              </Card>

              {/* ASSIGNMENT */}
              <PodcastAssignments assignments={assignments} token={token} />
            </Space>
          </Col>
        </Row>

        {/* MODALS */}
        <Modal
          open={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          footer={null}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BulbOutlined style={{ color: "#667eea" }} />
              Tạo Flashcards mới
            </div>
          }
          style={{ borderRadius: 16 }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Paragraph>
              Bạn muốn tạo flashcards tự động dựa trên nội dung podcast này.
            </Paragraph>
            <Button
              type="primary"
              icon={<BulbOutlined />}
              loading={generating}
              onClick={handleGenerateFlashcards}
              block
              size="large"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: 8,
                height: 48,
              }}
            >
              Tạo bằng AI (Gemini)
            </Button>
          </Space>
        </Modal>

        <Modal
          open={showListModal}
          onCancel={() => setShowListModal(false)}
          footer={null}
          width={600}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ReadOutlined style={{ color: "#667eea" }} />
              Flashcards của bạn
            </div>
          }
          style={{ borderRadius: 16 }}
        >
          {flashcards.length > 0 ? (
            <FlashcardStudySection
              flashcards={flashcards}
              docId={podcast.Document?.id}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Text type="secondary">Chưa có flashcard nào.</Text>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PodcastDetailPageUser;
