import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Spin,
  message,
  Divider,
  List,
  Avatar,
  Space,
  Tag,
  Progress,
  Button,
  Badge,
  Empty,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectDetailUser } from "../../../services/api_subject";
import {
  PlayCircleOutlined,
  BookOutlined,
  EyeOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "../../../context/useTheme";

const { Title, Text, Paragraph } = Typography;

const SubjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [subject, setSubject] = useState(null);
  const [chapterProgress, setChapterProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getSubjectDetailUser(slug);
        if (!data) {
          message.error("Không tìm thấy môn học này!");
          return;
        }

        setSubject(data.data || data);
        setChapterProgress(data.chapter_progress || []);
        setOverallProgress(data.overall_progress ?? null);
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi tải chi tiết môn học");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          background: isDarkMode
            ? "linear-gradient(135deg, #111827 0%, #312e81 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              Đang tải môn học...
            </Text>
          }
        />
      </div>
    );
  }

  if (!subject) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDarkMode ? "#111827" : "#fafafa",
        }}
      >
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            background: isDarkMode ? "#1f2937" : "white",
            color: isDarkMode ? "#e5e7eb" : "#000",
            textAlign: "center",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.08)",
            maxWidth: 400,
          }}
        >
          <Title level={3} style={{ color: isDarkMode ? "#c7d2fe" : "#666" }}>
            Không tìm thấy môn học
          </Title>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, #312e81 0%, #4338ca 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
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

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#e5e7eb" : "#000",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER */}
        <Card
          style={{
            marginBottom: 32,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 20,
            color: "white",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 32 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "white",
                marginBottom: 20,
                borderRadius: 8,
              }}
            >
              Quay lại
            </Button>

            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={16}>
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 20 }}
                >
                  <Avatar
                    size={80}
                    src={subject.cover_image}
                    icon={<BookOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "3px solid rgba(255,255,255,0.4)",
                    }}
                  />
                  <div>
                    <Title level={1} style={{ color: "white", margin: 0 }}>
                      {subject.name}
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        marginBottom: 0,
                      }}
                    >
                      {subject.description ||
                        "Khám phá kiến thức thông qua các bài học và podcast"}
                    </Paragraph>
                  </div>
                </div>

                <Space wrap size={[12, 12]} style={{ marginTop: 16 }}>
                  <Tag
                    color="default"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <BookOutlined /> {subject.chapters?.length || 0} chương
                  </Tag>
                  <Tag
                    color="default"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <FileTextOutlined />{" "}
                    {subject.chapters?.reduce(
                      (t, c) => t + (c.podcasts?.length || 0),
                      0
                    ) || 0}{" "}
                    podcast
                  </Tag>
                  {overallProgress !== null && (
                    <Tag
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <ClockCircleOutlined /> {Math.round(overallProgress)}%
                      hoàn thành
                    </Tag>
                  )}
                </Space>
              </Col>

              {overallProgress !== null && (
                <Col xs={24} md={8}>
                  <div style={{ textAlign: "center" }}>
                    <Progress
                      type="circle"
                      percent={Math.round(overallProgress)}
                      strokeColor={{
                        "0%": "#22c55e",
                        "100%": "#16a34a",
                      }}
                      trailColor="rgba(255,255,255,0.3)"
                      width={90}
                      format={(p) => (
                        <Text style={{ color: "white", fontWeight: 600 }}>
                          {p}%
                        </Text>
                      )}
                    />
                    <Text style={{ color: "white" }}> Tiến độ học tập</Text>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Card>

        {/* CHAPTERS */}
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            background: "inherit",
          }}
        >
          <div style={{ padding: 24 }}>
            <Title
              level={3}
              style={{ color: isDarkMode ? "#c7d2fe" : "#667eea" }}
            >
              <BookOutlined /> Danh sách chương học
            </Title>
            <Divider
              style={{ borderColor: isDarkMode ? "#374151" : "#f0f0f0" }}
            />
            {subject.chapters && subject.chapters.length > 0 ? (
              subject.chapters
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((chapter, index) => {
                  const progressInfo = chapterProgress.find(
                    (cp) => cp.chapter_id === chapter.id
                  );
                  return (
                    <Card
                      key={chapter.id}
                      style={{
                        borderRadius: 16,
                        marginBottom: 24,
                        boxShadow: isDarkMode
                          ? "0 2px 6px rgba(0,0,0,0.4)"
                          : "0 2px 8px rgba(0,0,0,0.05)",
                        background: isDarkMode
                          ? "#111827"
                          : "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          padding: 20,
                          borderBottom: isDarkMode
                            ? "1px solid #374151"
                            : "1px solid #f0f0f0",
                        }}
                      >
                        <Space align="center">
                          <Badge count={index + 1} color="#667eea" />
                          <Title
                            level={4}
                            style={{
                              margin: 0,
                              color: isDarkMode ? "#c7d2fe" : "#667eea",
                            }}
                          >
                            {chapter.title}
                          </Title>
                        </Space>
                        {progressInfo && (
                          <div style={{ marginTop: 8 }}>
                            <Text
                              style={{
                                color: isDarkMode ? "#9ca3af" : "#555",
                                fontSize: 13,
                              }}
                            >
                              Hoàn thành {progressInfo.done}/
                              {progressInfo.total} podcast
                            </Text>
                            <Progress
                              percent={Math.round(progressInfo.progress)}
                              size="small"
                              strokeColor={{
                                "0%": "#6366f1",
                                "100%": "#a855f7",
                              }}
                              trailColor={isDarkMode ? "#374151" : "#f0f0f0"}
                            />
                          </div>
                        )}
                      </div>

                      <div style={{ padding: 16 }}>
                        {chapter.podcasts && chapter.podcasts.length > 0 ? (
                          <List
                            dataSource={chapter.podcasts}
                            renderItem={(podcast) => (
                              <List.Item
                                onClick={() =>
                                  navigate(`/podcast/${podcast.id}`)
                                }
                                style={{
                                  borderRadius: 12,
                                  marginBottom: 8,
                                  background: isDarkMode ? "#1f2937" : "#fff",
                                  color: isDarkMode ? "#f3f4f6" : "#000",
                                  boxShadow: isDarkMode
                                    ? "0 2px 6px rgba(0,0,0,0.4)"
                                    : "0 2px 8px rgba(0,0,0,0.05)",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                }}
                                className="podcast-item"
                              >
                                <Space style={{ padding: 15 }}>
                                  <Avatar
                                    shape="square"
                                    size={64}
                                    src={podcast.cover_image}
                                    icon={<PlayCircleOutlined />}
                                  />
                                  <div>
                                    <Text
                                      strong
                                      style={{
                                        color: isDarkMode ? "#e5e7eb" : "#000",
                                      }}
                                    >
                                      {podcast.title}
                                    </Text>
                                    <br />
                                    <Text
                                      type="secondary"
                                      style={{
                                        color: isDarkMode ? "#9ca3af" : "#888",
                                      }}
                                    >
                                      {podcast.description || "Không có mô tả"}
                                    </Text>
                                  </div>
                                </Space>
                              </List.Item>
                            )}
                          />
                        ) : (
                          <Empty
                            description="Chưa có podcast nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{
                              color: isDarkMode ? "#9ca3af" : undefined,
                            }}
                          />
                        )}
                      </div>
                    </Card>
                  );
                })
            ) : (
              <Empty
                description="Chưa có chương học nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{
                  color: isDarkMode ? "#9ca3af" : undefined,
                }}
              />
            )}
          </div>
        </Card>

        <style jsx>{`
          .podcast-item:hover {
            background: ${isDarkMode
              ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
              : "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)"};
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
