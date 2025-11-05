import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Pagination,
  Spin,
  Empty,
  message,
  Tag,
  Tooltip,
  Space,
  Avatar,
} from "antd";
import {
  CustomerServiceOutlined,
  PlayCircleFilled,
  SearchOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { searchFull } from "../../services/api_search";

const { Title, Text, Paragraph } = Typography;

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || "";

  const [results, setResults] = useState([]); // ✅ luôn là array
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const fetchResults = async (pageNumber = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchFull(query, pageNumber, perPage);

      // tránh lỗi null / undefined
      setResults(Array.isArray(data?.results) ? data.results : []);
      setTotal(Number(data?.total) || 0);
      setPage(Number(data?.page) || 1);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi lấy kết quả tìm kiếm");
      setResults([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  const getTypeColor = (type) => {
    return type === "podcast"
      ? { color: "#667eea", bg: "rgba(102, 126, 234, 0.1)" }
      : { color: "#ff6b35", bg: "rgba(255, 107, 53, 0.1)" };
  };

  const getTypeIcon = (type) => {
    return type === "podcast" ? <CustomerServiceOutlined /> : <BookOutlined />;
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24 }}>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Avatar
                size={64}
                icon={<SearchOutlined />}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              />
              <div>
                <Title
                  level={1}
                  style={{ color: "white", margin: 0, fontSize: 28 }}
                >
                  Kết quả tìm kiếm
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Tìm thấy {total} kết quả cho: "{query}"
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "100px 0",
              borderRadius: 20,
            }}
          >
            <Spin
              size="large"
              tip={
                <Text style={{ fontSize: 16, marginTop: 16 }}>
                  Đang tìm kiếm...
                </Text>
              }
            />
          </div>
        ) : !Array.isArray(results) || results.length === 0 ? ( // ✅ kiểm tra kỹ
          <Card
            style={{
              borderRadius: 20,
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Empty
              description={
                <div>
                  <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
                    Không tìm thấy kết quả phù hợp
                  </Title>
                  <Text type="secondary">
                    Hãy thử với từ khóa tìm kiếm khác hoặc kiểm tra chính tả
                  </Text>
                </div>
              }
              imageStyle={{ height: 120 }}
            />
          </Card>
        ) : (
          <>
            {/* RESULTS SECTION */}
            <Card
              style={{
                borderRadius: 20,
                border: "none",
                overflow: "hidden",
                marginBottom: 32,
                background: "inherit",
              }}
            >
              <Row gutter={[24, 24]} style={{ padding: 24 }}>
                {results.map((item) => {
                  const typeInfo = getTypeColor(item.type);
                  return (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 16,
                          border: "none",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                          height: "100%",
                        }}
                        cover={
                          <div style={{ position: "relative" }}>
                            <img
                              alt={item.title || item.name}
                              src={
                                item.cover_image ||
                                "https://cdn-icons-png.flaticon.com/512/727/727245.png"
                              }
                              style={{
                                width: "100%",
                                height: 180,
                                objectFit: "cover",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                              }}
                            >
                              <Tag
                                style={{
                                  background: typeInfo.bg,
                                  color: typeInfo.color,
                                  border: "none",
                                  borderRadius: 12,
                                  fontWeight: 600,
                                  padding: "4px 8px",
                                }}
                              >
                                {getTypeIcon(item.type)}
                                {item.type === "podcast"
                                  ? " Podcast"
                                  : " Môn học"}
                              </Tag>
                            </div>
                          </div>
                        }
                        bodyStyle={{ padding: 20 }}
                        onClick={() =>
                          item.type === "podcast"
                            ? navigate(`/podcast/${item.id}`)
                            : navigate(`/subjects/${item.slug}`)
                        }
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Tooltip title={item.title || item.name}>
                            <Title
                              level={5}
                              ellipsis={{ rows: 2 }}
                              style={{
                                margin: 0,
                                lineHeight: 1.4,
                                minHeight: 44,
                              }}
                            >
                              {item.title || item.name}
                            </Title>
                          </Tooltip>

                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{
                              margin: 0,
                              color: "#666",
                              fontSize: 14,
                              lineHeight: 1.5,
                            }}
                          >
                            {item.description ||
                              "Nội dung bài học hoặc podcast liên quan"}
                          </Paragraph>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>

            {/* PAGINATION */}
            {total > perPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 32,
                }}
              >
                <Pagination
                  current={page}
                  pageSize={perPage}
                  total={total}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                  style={{
                    background: "white",
                    padding: "16px 24px",
                    borderRadius: 16,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
