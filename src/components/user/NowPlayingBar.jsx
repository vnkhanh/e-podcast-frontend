import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  Row,
  Col,
  Avatar,
  Button,
  Space,
  Typography,
  Dropdown,
  Input,
  List,
  Tag,
  message,
  Tooltip,
} from "antd";
import {
  UnorderedListOutlined,
  UpOutlined,
  DownOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  PlusOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CustomAudioPlayer from "../AudioPlayer";
import SharePodcastButton from "./SharePodcastButton";
import {
  createPodcastNote,
  getNotesByPodcast,
  deleteNote,
} from "../../services/api_note";
import { formatTime } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/useTheme";

const { Text } = Typography;

const NowPlayingBar = ({ playerState, userToken }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const {
    currentPodcast,
    isPlaying,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    currentTime,
    handlePlay,
  } = playerState;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duration, setLocalDuration] = useState(0);

  const audioRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  // Cập nhật tiến trình
  useEffect(() => {
    if (!currentPodcast || !audioRef.current) return;
    const audio = audioRef.current.querySelector("audio");
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setLocalDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [currentPodcast, setCurrentTime, setDuration]);

  // Lấy danh sách ghi chú
  const fetchNotes = useCallback(async () => {
    if (!currentPodcast) return;
    try {
      const res = await getNotesByPodcast(currentPodcast.id, userToken);
      const data = res?.data?.notes || [];
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setNotes([]);
    }
  }, [currentPodcast, userToken]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setLoading(true);
    try {
      await createPodcastNote(
        {
          podcast_id: currentPodcast.id,
          content: noteText,
          position: Math.floor(currentTime),
        },
        userToken
      );
      setNoteText("");
      message.success("Đã thêm ghi chú!");
      fetchNotes();
    } catch (err) {
      console.error(err);
      message.error("Không thể thêm ghi chú!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId, userToken);
      message.success("Đã xóa ghi chú!");
      fetchNotes();
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa ghi chú!");
    }
  };

  const jumpToNote = (note) => {
    if (currentPodcast?.id === note.podcast_id) {
      const audio = document.querySelector("audio");
      if (audio) audio.currentTime = note.position;
      setCurrentTime(note.position);
    } else {
      handlePlay({ id: note.podcast_id, audio_url: note.audio_url });
      setTimeout(() => {
        const audio = document.querySelector("audio");
        if (audio) audio.currentTime = note.position;
        setCurrentTime(note.position);
      }, 700);
    }
  };

  if (!currentPodcast) return null;

  // Dropdown nội dung notes
  const noteMenu = (
    <div
      style={{
        padding: 12,
        width: 320,
        background: isDarkMode ? "#1f2937" : "#fff",
        borderRadius: 8,
        boxShadow: isDarkMode
          ? "0 4px 12px rgba(255,255,255,0.1)"
          : "0 4px 12px rgba(0,0,0,0.15)",
        color: isDarkMode ? "#e5e7eb" : "#000",
      }}
    >
      <Input.TextArea
        rows={3}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder={`Nhập ghi chú tại ${formatTime(currentTime)}`}
        style={{
          background: isDarkMode ? "#111827" : "#fff",
          color: isDarkMode ? "#e5e7eb" : "#000",
          borderColor: isDarkMode ? "#374151" : "#d9d9d9",
        }}
      />
      <Button
        type="primary"
        style={{ marginTop: 8, width: "100%" }}
        loading={loading}
        icon={<PlusOutlined />}
        onClick={handleAddNote}
      >
        Lưu ghi chú
      </Button>
      <List
        size="small"
        style={{ marginTop: 12, maxHeight: 200, overflowY: "auto" }}
        dataSource={notes.sort((a, b) => a.position - b.position)}
        renderItem={(note) => (
          <List.Item
            style={{
              cursor: "pointer",
              padding: "4px 8px",
              background: isDarkMode ? "#111827" : undefined,
            }}
            onClick={() => jumpToNote(note)}
          >
            <Space>
              <ClockCircleOutlined style={{ color: "#1DB954" }} />
              <Tag color="green">{formatTime(note.position)}</Tag>
              <Text style={{ color: isDarkMode ? "#f9fafb" : "#000" }}>
                {note.content}
              </Text>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteNote(note.id)}
              />
            </Space>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: isDarkMode
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        borderTop: isDarkMode ? "1px solid #374151" : "1px solid #f0f0f0",
        padding: isCollapsed
          ? "6px 16px"
          : isMobile
          ? "12px 16px"
          : "16px 24px",
        zIndex: 1000,
        boxShadow: isDarkMode
          ? "0 -4px 20px rgba(255, 255, 255, 0.05)"
          : "0 -4px 20px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        color: isDarkMode ? "#f3f4f6" : "#000",
      }}
    >
      {/* Full Player */}
      <div
        ref={audioRef}
        style={{ display: isCollapsed ? "none" : "block", width: "100%" }}
      >
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Space>
              <Avatar
                shape="square"
                size={40}
                src={currentPodcast?.cover_image}
              />
              <Space
                direction="vertical"
                size={0}
                onClick={() => navigate(`/podcast/${currentPodcast?.id}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                }}
              >
                <Text strong style={{ color: isDarkMode ? "#f9fafb" : "#000" }}>
                  {currentPodcast?.title || "Không có tiêu đề"}
                </Text>
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={8}>
            <CustomAudioPlayer
              src={currentPodcast?.audio_url}
              podcastId={currentPodcast?.id}
              userToken={userToken}
              size="default"
              externalPlaying={isPlaying}
              onPlayStateChange={setIsPlaying}
              notes={notes}
            />
          </Col>

          <Col xs={24} md={8}>
            <Space style={{ float: isMobile ? "left" : "right" }}>
              <SharePodcastButton
                podcastId={currentPodcast?.id}
                userToken={userToken}
              />
              <Dropdown
                overlay={noteMenu}
                trigger={["click"]}
                placement="topRight"
              >
                <Button
                  icon={<PlusOutlined />}
                  style={{
                    background: isDarkMode ? "#1f2937" : undefined,
                    color: isDarkMode ? "#f3f4f6" : undefined,
                  }}
                >
                  Ghi chú
                </Button>
              </Dropdown>

              <Button
                type="text"
                icon={<DownOutlined />}
                onClick={() => setIsCollapsed(true)}
                style={{ color: isDarkMode ? "#f3f4f6" : undefined }}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Mini Player */}
      {isCollapsed && (
        <>
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 4 }}
          >
            <Col>
              <Space>
                <Avatar
                  size={36}
                  src={currentPodcast?.cover_image}
                  onClick={() => navigate(`/podcast/${currentPodcast?.id}`)}
                />
                <Space direction="vertical" size={0}>
                  <Text
                    strong
                    style={{
                      fontSize: 13,
                      color: isDarkMode ? "#f9fafb" : "#000",
                    }}
                    onClick={() => navigate(`/podcast/${currentPodcast?.id}`)}
                  >
                    {currentPodcast?.title}
                  </Text>
                </Space>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  type="text"
                  icon={
                    isPlaying ? (
                      <PauseCircleFilled
                        style={{
                          fontSize: 22,
                          color: isDarkMode ? "#60a5fa" : "#1890ff",
                        }}
                      />
                    ) : (
                      <PlayCircleFilled
                        style={{
                          fontSize: 22,
                          color: isDarkMode ? "#60a5fa" : "#1890ff",
                        }}
                      />
                    )
                  }
                  onClick={() => setIsPlaying(!isPlaying)}
                />
                <Button
                  type="text"
                  icon={<UpOutlined />}
                  onClick={() => setIsCollapsed(false)}
                  style={{ color: isDarkMode ? "#f3f4f6" : undefined }}
                />
              </Space>
            </Col>
          </Row>

          {/* Progress bar */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 20,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 4,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                top: 8,
                background: isDarkMode ? "#374151" : "#e5e7eb",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: isDarkMode ? "#60a5fa" : "#1890ff",
                  transition: "width 0.2s linear",
                }}
              />
            </div>

            {duration > 0 &&
              notes.map((note) => {
                const leftPercent = (note.position / duration) * 100;
                return (
                  <Tooltip key={note.id} title={note.content} placement="top">
                    <div
                      style={{
                        position: "absolute",
                        left: `${leftPercent}%`,
                        top: 0,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#1DB954",
                        transform: "translateX(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const audio = document.querySelector("audio");
                        if (audio) audio.currentTime = note.position;
                        setCurrentTime(note.position);
                      }}
                    />
                  </Tooltip>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default NowPlayingBar;
