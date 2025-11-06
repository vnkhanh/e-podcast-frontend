import React, { useEffect, useState } from "react";
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
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectDetailUser } from "../../../services/api_subject";
import {
  PlayCircleOutlined,
  BookOutlined,
  EyeOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const SubjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
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
            Không tìm thấy môn học
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

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER SECTION */}
        <Card
          style={{
            marginBottom: 32,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                    src={subject.cover_image}
                    icon={<BookOutlined />}
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
                      {subject.name}
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.5,
                      }}
                      ellipsis={{ rows: 2 }}
                    >
                      {subject.description ||
                        "Khám phá kiến thức thông qua các bài học và podcast"}
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
                    <BookOutlined style={{ marginRight: 4 }} />
                    {subject.chapters?.length || 0} chương
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
                    <FileTextOutlined style={{ marginRight: 4 }} />
                    {subject.chapters?.reduce(
                      (total, chapter) =>
                        total + (chapter.podcasts?.length || 0),
                      0
                    ) || 0}{" "}
                    podcast
                  </Tag>
                  {overallProgress !== null && (
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
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {Math.round(overallProgress)}% hoàn thành
                    </Tag>
                  )}
                </Space>
              </Col>

              {/* PROGRESS STATS */}
              {overallProgress !== null && (
                <Col xs={24} md={8}>
                  <Card
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 16,
                      backdropFilter: "blur(10px)",
                    }}
                    bodyStyle={{ padding: 20, textAlign: "center" }}
                  >
                    <Text
                      style={{
                        color: "white",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Tiến độ học tập
                    </Text>
                    <Progress
                      type="circle"
                      percent={Math.round(overallProgress)}
                      strokeColor={{
                        "0%": "#ff6b35",
                        "100%": "#f7931e",
                      }}
                      trailColor="rgba(255,255,255,0.3)"
                      width={80}
                      format={(percent) => (
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          {percent}%
                        </Text>
                      )}
                    />
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        </Card>

        {/* CHAPTERS LIST */}
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: 24, background: "white" }}>
            <Title
              level={3}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <BookOutlined style={{ color: "#667eea" }} />
              Danh sách chương học
            </Title>
            <Divider style={{ margin: "16px 0" }} />
          </div>

          {subject.chapters && subject.chapters.length > 0 ? (
            <div style={{ padding: "0 24px 24px" }}>
              {subject.chapters
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
                        border: "none",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                      }}
                      bodyStyle={{ padding: 0 }}
                    >
                      {/* CHAPTER HEADER */}
                      <div
                        style={{
                          padding: "20px 24px",
                          background:
                            "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 12,
                          }}
                        >
                          <Space>
                            <Badge
                              count={index + 1}
                              style={{
                                backgroundColor: "#667eea",
                                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                              }}
                            />
                            <Title
                              level={4}
                              style={{ margin: 0, color: "#667eea" }}
                            >
                              {chapter.title}
                            </Title>
                          </Space>

                          <Text type="secondary">
                            {chapter.podcasts?.length || 0} podcast
                          </Text>
                        </div>

                        {/* CHAPTER PROGRESS */}
                        {progressInfo && (
                          <div style={{ marginTop: 12 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 4,
                              }}
                            >
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Hoàn thành {progressInfo.done}/
                                {progressInfo.total} podcast
                              </Text>
                              <Text
                                strong
                                style={{ fontSize: 12, color: "#52c41a" }}
                              >
                                {Math.round(progressInfo.progress)}%
                              </Text>
                            </div>
                            <Progress
                              percent={Math.round(progressInfo.progress)}
                              size="small"
                              strokeColor={{
                                "0%": "#667eea",
                                "100%": "#764ba2",
                              }}
                              trailColor="#f0f0f0"
                            />
                          </div>
                        )}
                      </div>

                      {/* PODCASTS LIST */}
                      <div style={{ padding: 16 }}>
                        {chapter.podcasts && chapter.podcasts.length > 0 ? (
                          <List
                            itemLayout="horizontal"
                            dataSource={chapter.podcasts}
                            renderItem={(podcast) => (
                              <List.Item
                                style={{
                                  padding: "16px",
                                  border: "none",
                                  borderRadius: 12,
                                  marginBottom: 8,
                                  background: "white",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                }}
                                className="podcast-item"
                                onClick={() =>
                                  navigate(`/podcast/${podcast.id}`)
                                }
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <Avatar
                                    shape="square"
                                    size={64}
                                    src={podcast.cover_image}
                                    icon={<PlayCircleOutlined />}
                                    style={{
                                      borderRadius: 12,
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                  />

                                  <div style={{ flex: 1, marginLeft: 16 }}>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: 16,
                                        display: "block",
                                        marginBottom: 4,
                                      }}
                                    >
                                      {podcast.title}
                                    </Text>
                                    <Paragraph
                                      ellipsis={{ rows: 2 }}
                                      style={{
                                        margin: 0,
                                        color: "#666",
                                        fontSize: 14,
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {podcast.summary ||
                                        "Nội dung podcast hấp dẫn..."}
                                    </Paragraph>
                                  </div>

                                  <Space size="middle">
                                    <Tag
                                      icon={<EyeOutlined />}
                                      style={{
                                        background: "rgba(24, 144, 255, 0.1)",
                                        color: "#1890ff",
                                        border: "none",
                                        borderRadius: 12,
                                      }}
                                    >
                                      {podcast.view_count || 0}
                                    </Tag>
                                    <Tag
                                      icon={<HeartOutlined />}
                                      style={{
                                        background: "rgba(255, 77, 79, 0.1)",
                                        color: "#ff4d4f",
                                        border: "none",
                                        borderRadius: 12,
                                      }}
                                    >
                                      {podcast.like_count || 0}
                                    </Tag>
                                  </Space>
                                </div>
                              </List.Item>
                            )}
                          />
                        ) : (
                          <div style={{ textAlign: "center", padding: 40 }}>
                            <Text type="secondary">
                              Chưa có podcast nào trong chương này.
                            </Text>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <div style={{ padding: 60, textAlign: "center" }}>
              <Text type="secondary">Môn học này chưa có chương nào.</Text>
            </div>
          )}
        </Card>

        <style jsx>{`
          .podcast-item:hover {
            background: linear-gradient(
              135deg,
              #f8f9ff 0%,
              #f0f4ff 100%
            ) !important;
            transform: translateX(4px);
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15) !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
