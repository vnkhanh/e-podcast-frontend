import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Tag,
  Divider,
  Spin,
  Typography,
  Row,
  Col,
  message,
  Button,
  Space,
  Image,
  Statistic,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SoundOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { getPodcastDetail } from "../../../services/api_podcast";
import dayjs from "dayjs";
import CustomAudioPlayer from "../../../components/AudioPlayer";
const { Title, Paragraph, Text } = Typography;

export default function PodcastDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const data = await getPodcastDetail(id);
        setPodcast(data);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải thông tin podcast");
      } finally {
        setLoading(false);
      }
    };
    fetchPodcast();
  }, [id]);

  if (loading)
    return (
      <Row justify="center" style={{ marginTop: 100 }}>
        <Spin size="large" />
      </Row>
    );

  if (!podcast)
    return (
      <Row justify="center" style={{ marginTop: 100 }}>
        <Text type="danger">Không tìm thấy podcast</Text>
      </Row>
    );

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>

      <Row gutter={24}>
        {/* Cột trái */}
        <Col xs={24} lg={8}>
          <Card
            cover={
              <div
                style={{
                  width: "100%",
                  height: 240, // chiều cao đồng nhất
                  overflow: "hidden",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {podcast.cover_image ? (
                  <Image
                    alt="cover"
                    src={podcast.cover_image}
                    preview={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // cắt ảnh hợp lý
                    }}
                  />
                ) : (
                  <Text type="secondary">Không có ảnh bìa</Text>
                )}
              </div>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <CustomAudioPlayer
                src={podcast.audio_url}
                size="default" // 'small' | 'default' | 'large'
                style={{ marginTop: 16 }}
              />

              <Row gutter={16} justify="space-around" align="middle">
                <Col>
                  <Statistic
                    title={<Text type="secondary">Lượt xem</Text>}
                    value={podcast.view_count || 0}
                    prefix={<EyeOutlined />}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title={<Text type="secondary">Lượt thích</Text>}
                    value={podcast.like_count || 0}
                    prefix={<HeartOutlined />}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
              </Row>

              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",

                    alignItems: "center",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  Tài liệu nguồn
                </div>

                {podcast.document ? (
                  <>
                    <Descriptions
                      size="small"
                      column={1}
                      bordered
                      labelStyle={{ fontWeight: 500, width: "30%" }}
                      contentStyle={{ background: "#fafafa" }}
                    >
                      <Descriptions.Item label="Tên file">
                        {podcast.document.original_name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Loại">
                        {podcast.document.file_type}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kích thước">
                        {(podcast.document.file_size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </Descriptions.Item>
                    </Descriptions>

                    {podcast.document.file_path && (
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        href={podcast.document.file_path}
                        target="_blank"
                        style={{ marginTop: 12 }}
                        block
                      >
                        Xem tài liệu
                      </Button>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      padding: "16px 0",
                      textAlign: "center",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Không có tài liệu
                    </Text>
                  </div>
                )}
              </div>
            </Space>
          </Card>
        </Col>

        {/* Cột phải */}
        <Col xs={24} lg={16}>
          <Card>
            <Row justify="space-between" align="middle">
              <Title level={3} style={{ margin: 0 }}>
                {podcast.title}
              </Title>
              <Tag
                color={podcast.status === "published" ? "green" : "orange"}
                style={{ fontSize: 14 }}
              >
                {podcast.status === "published" ? "Đã xuất bản" : "Bản nháp"}
              </Tag>
            </Row>

            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              {podcast.description || "Không có mô tả"}
            </Paragraph>

            <Divider />

            <Descriptions
              bordered
              column={1}
              size="middle"
              title="Thông tin chi tiết"
            >
              <Descriptions.Item label="Thời lượng">
                <ClockCircleOutlined /> {podcast.duration_text || "--:--"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                <CalendarOutlined />{" "}
                {dayjs(podcast.created_at).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              {podcast.published_at && (
                <Descriptions.Item label="Ngày xuất bản">
                  <CalendarOutlined />{" "}
                  {dayjs(podcast.published_at).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
              )}

              {podcast.updated_at && (
                <Descriptions.Item label="Ngày cập nhật mới nhất">
                  <CalendarOutlined />{" "}
                  {dayjs(podcast.updated_at).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Môn học">
                {podcast.chapter?.subject?.name || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Chương">
                {podcast.chapter?.title || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Chủ đề">
                {podcast.topics?.length
                  ? podcast.topics.map((t) => (
                      <Tag key={t.id} color="geekblue">
                        {t.name}
                      </Tag>
                    ))
                  : "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                {podcast.categories?.length
                  ? podcast.categories.map((c) => (
                      <Tag key={c.id} color="purple">
                        {c.name}
                      </Tag>
                    ))
                  : "Không có"}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Card
              type="inner"
              title={
                <>
                  <SoundOutlined /> Tóm tắt
                </>
              }
            >
              <Paragraph>{podcast.summary || "Không có tóm tắt"}</Paragraph>
            </Card>

            {podcast.tags?.length > 0 && (
              <>
                <Divider />
                <Card
                  type="inner"
                  title={
                    <>
                      <TagOutlined /> Thẻ Tag
                    </>
                  }
                >
                  {podcast.tags.map((t) => (
                    <Tag key={t.id} color="blue">
                      #{t.name}
                    </Tag>
                  ))}
                </Card>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
