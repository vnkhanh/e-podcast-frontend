import React, { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Space,
  Typography,
  Alert,
  Button,
  Spin,
  message,
  Modal,
  Input,
  Row,
  Col,
  Avatar,
  Divider,
  Badge,
} from "antd";
import {
  ReadOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  UnlockOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAssignmentsByPodcast,
  verifyAssignmentPassword,
} from "../../../services/api_assignment";

const { Title, Paragraph, Text } = Typography;

const PodcastAssignments = () => {
  const { id: podcastId } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ====== STATE kiểm tra password ======
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [checking, setChecking] = useState(false);

  // ================= FETCH ASSIGNMENTS =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAssignmentsByPodcast(podcastId);
        setAssignments(res.assignments || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        message.error("Không thể tải danh sách bài tập.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [podcastId]);

  // ================= CLICK =================
  const handleClick = (ass) => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    // Nếu bài tập có mật khẩu → bật modal
    if (ass.has_password || ass.Password || ass.password) {
      setSelectedAssignment(ass);
      setOpenPasswordModal(true);
      return;
    }

    // Không có mật khẩu → cho vào luôn
    navigate(`/assignment/${ass.id}`);
  };

  // ================= VERIFY PASSWORD =================
  const handleVerify = async () => {
    if (!selectedAssignment) return;

    setChecking(true);
    try {
      const res = await verifyAssignmentPassword(
        selectedAssignment.id,
        passwordInput
      );

      if (res.valid) {
        message.success("Mật khẩu chính xác!");
        setOpenPasswordModal(false);
        setPasswordInput("");
        navigate(`/assignment/${selectedAssignment.id}`);
      } else {
        message.error("Mật khẩu không đúng!");
      }
    } catch (err) {
      console.error(err);
      message.error("Mật khẩu không đúng!");
    } finally {
      setChecking(false);
    }
  };

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
              Đang tải bài tập...
            </Text>
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
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
                    icon={<ReadOutlined />}
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
                      Bài tập Podcast
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.5,
                      }}
                    >
                      Danh sách bài tập được giao cho podcast này
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
                    <ReadOutlined style={{ marginRight: 4 }} />
                    {assignments.length} bài tập
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
                    <RocketOutlined style={{ marginRight: 4 }} />
                    Sẵn sàng học tập
                  </Tag>
                </Space>
              </Col>
            </Row>
          </div>
        </Card>

        {/* ASSIGNMENTS LIST */}
        <Card
          style={{
            borderRadius: 20,
            border: "none",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: 24 }}>
            <Title
              level={3}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ReadOutlined style={{ color: "#667eea" }} />
              Danh sách bài tập
            </Title>
            <Divider style={{ margin: "16px 0" }} />
          </div>

          {assignments.length === 0 ? (
            <div style={{ padding: 60 }}>
              <Alert
                message={
                  <div style={{ textAlign: "center" }}>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      Chưa có bài tập nào
                    </Title>
                    <Text type="secondary">
                      Podcast này hiện chưa có bài tập được giao
                    </Text>
                  </div>
                }
                type="info"
                showIcon
                style={{
                  borderRadius: 12,
                  border: "1px solid #e6f7ff",
                }}
              />
            </div>
          ) : (
            <div style={{ padding: 24 }}>
              <Row gutter={[24, 24]}>
                {assignments.map((ass, index) => (
                  <Col xs={24} key={ass.id}>
                    <Card
                      hoverable
                      onClick={() => handleClick(ass)}
                      style={{
                        borderRadius: 16,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={16}>
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
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
                                  backgroundColor: "#667eea",
                                  boxShadow:
                                    "0 2px 8px rgba(102, 126, 234, 0.3)",
                                }}
                              />
                              <Title level={4} style={{ margin: 0 }}>
                                {ass.title}
                              </Title>
                            </div>

                            {ass.description && (
                              <Paragraph
                                style={{
                                  margin: 0,
                                  fontSize: 14,
                                  lineHeight: 1.5,
                                }}
                                ellipsis={{ rows: 2 }}
                              >
                                {ass.description}
                              </Paragraph>
                            )}

                            <Space wrap size={[8, 8]}>
                              <Tag
                                icon={
                                  ass.is_published ? (
                                    <CheckCircleOutlined />
                                  ) : (
                                    <ClockCircleOutlined />
                                  )
                                }
                                style={{
                                  background: ass.is_published
                                    ? "rgba(82, 196, 26, 0.1)"
                                    : "rgba(250, 173, 20, 0.1)",
                                  color: ass.is_published
                                    ? "#52c41a"
                                    : "#faad14",
                                  border: "none",
                                  borderRadius: 12,
                                }}
                              >
                                {ass.is_published
                                  ? "Đã công bố"
                                  : "Chưa công bố"}
                              </Tag>

                              <Tag
                                icon={
                                  ass.has_password ||
                                  ass.Password ||
                                  ass.password ? (
                                    <LockOutlined />
                                  ) : (
                                    <UnlockOutlined />
                                  )
                                }
                                style={{
                                  background:
                                    ass.has_password ||
                                    ass.Password ||
                                    ass.password
                                      ? "rgba(255, 77, 79, 0.1)"
                                      : "rgba(24, 144, 255, 0.1)",
                                  color:
                                    ass.has_password ||
                                    ass.Password ||
                                    ass.password
                                      ? "#ff4d4f"
                                      : "#1890ff",
                                  border: "none",
                                  borderRadius: 12,
                                }}
                              >
                                {ass.has_password ||
                                ass.Password ||
                                ass.password
                                  ? "Có mật khẩu"
                                  : "Không mật khẩu"}
                              </Tag>

                              <Tag
                                style={{
                                  color: "peru",
                                  border: "none",
                                  borderRadius: 12,
                                }}
                              >
                                Tạo bởi{" "}
                                {ass.creator?.role === "teacher"
                                  ? "Giảng viên"
                                  : ass.creator?.role === "admin"
                                  ? "Admin"
                                  : "N/A"}{" "}
                                {ass.creator?.full_name || "N/A"}
                              </Tag>
                            </Space>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card>

        {/* PASSWORD MODAL */}
        <Modal
          open={openPasswordModal}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LockOutlined style={{ color: "#667eea" }} />
              Nhập mật khẩu bài tập
            </div>
          }
          okText="Xác nhận"
          cancelText="Hủy"
          onOk={handleVerify}
          confirmLoading={checking}
          onCancel={() => {
            setOpenPasswordModal(false);
            setPasswordInput("");
          }}
          centered
          style={{ borderRadius: 16 }}
          okButtonProps={{
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: 8,
              fontWeight: 500,
            },
          }}
          cancelButtonProps={{
            style: {
              borderRadius: 8,
            },
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            {selectedAssignment && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                }}
              >
                <Text strong style={{ color: "#667eea" }}>
                  {selectedAssignment.title}
                </Text>
              </div>
            )}

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Mật khẩu bài tập
              </Text>
              <Input.Password
                placeholder="Nhập mật khẩu để truy cập bài tập"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                size="large"
                style={{
                  borderRadius: 8,
                }}
                onPressEnter={handleVerify}
              />
            </div>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Bài tập này được bảo vệ bằng mật khẩu. Vui lòng nhập mật khẩu để
              tiếp tục.
            </Text>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default PodcastAssignments;
