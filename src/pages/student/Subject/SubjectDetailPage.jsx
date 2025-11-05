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
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectDetailUser } from "../../../services/api_subject";
import {
  PlayCircleOutlined,
  BookOutlined,
  EyeOutlined,
  HeartOutlined,
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

        // Lưu dữ liệu môn học + tiến độ (nếu có)
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải môn học..." />
      </div>
    );

  if (!subject)
    return (
      <div className="text-center mt-10 text-gray-500">
        Không tìm thấy môn học.
      </div>
    );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <Title level={2} style={{ marginBottom: 8 }}>
        {subject.name}
      </Title>
      <Paragraph type="secondary">
        Tổng cộng: {subject.chapters?.length || 0} chương
      </Paragraph>

      {/* ✅ Hiển thị tiến độ toàn môn học nếu có */}
      {overallProgress !== null && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Tiến độ học tập toàn môn:</Text>
          <Progress
            percent={Math.round(overallProgress)}
            status="active"
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
          />
        </div>
      )}

      <Divider />

      {/* Danh sách chương */}
      {subject.chapters && subject.chapters.length > 0 ? (
        subject.chapters
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((chapter) => {
            const progressInfo = chapterProgress.find(
              (cp) => cp.chapter_id === chapter.id
            );
            return (
              <Card
                key={chapter.id}
                title={
                  <Space>
                    <BookOutlined /> {chapter.title}
                  </Space>
                }
                style={{
                  borderRadius: 12,
                  marginBottom: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* ✅ Thanh tiến độ của từng chương (nếu có user đăng nhập) */}
                {progressInfo && (
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">
                      Hoàn thành {progressInfo.done}/{progressInfo.total}{" "}
                      podcast
                    </Text>
                    <Progress
                      percent={Math.round(progressInfo.progress)}
                      size="small"
                      strokeColor="#52c41a"
                    />
                  </div>
                )}

                {/* Danh sách podcast */}
                {chapter.podcasts && chapter.podcasts.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={chapter.podcasts}
                    renderItem={(podcast) => (
                      <List.Item
                        onClick={() => navigate(`/podcast/${podcast.id}`)}
                        style={{
                          cursor: "pointer",
                          borderRadius: 8,
                          padding: 8,
                          transition: "all 0.2s",
                        }}
                        className="hover:bg-gray-50"
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="square"
                              size={64}
                              src={podcast.cover_image}
                              icon={<PlayCircleOutlined />}
                            />
                          }
                          title={<Text strong>{podcast.title}</Text>}
                          description={
                            <Text type="secondary">
                              {podcast.summary?.slice(0, 100)}...
                            </Text>
                          }
                        />
                        <Space>
                          <Tag icon={<EyeOutlined />} color="blue">
                            {podcast.view_count}
                          </Tag>
                          <Tag icon={<HeartOutlined />} color="magenta">
                            {podcast.like_count}
                          </Tag>
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">
                    Chưa có podcast nào trong chương này.
                  </Text>
                )}
              </Card>
            );
          })
      ) : (
        <Text type="secondary">Môn học này chưa có chương nào.</Text>
      )}
    </div>
  );
};

export default SubjectDetailPage;
