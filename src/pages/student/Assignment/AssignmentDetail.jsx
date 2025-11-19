import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Table,
  Alert,
  Spin,
  message,
  Row,
  Col,
  Avatar,
  Divider,
  Badge,
  Statistic,
  Progress,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReadOutlined,
  ArrowLeftOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RocketOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getUserAssignmentDetail,
  getUserAssignmentSubmissions,
  checkDraftSubmission,
} from "../../../services/api_assignment";
const { Title, Paragraph, Text } = Typography;

const AssignmentDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [allowReview, setAllowReview] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSubmission, setDraftSubmission] = useState(null);

  useEffect(() => {
    setAssignment(null);
    setSubmissions([]);
    setAttemptsLeft(0);
    setIsExpired(false);
    setAllowReview(false);
    setHasDraft(false);
    setDraftSubmission(null);
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        // 1. Lấy chi tiết assignment
        const detailData = await getUserAssignmentDetail(id, token);
        setAssignment(detailData.assignment);
        setAttemptsLeft(detailData.attempts_left || 0);
        setIsExpired(detailData.is_expired || false);
        setAllowReview(detailData.allow_review || false);

        // 2. Kiểm tra có submission draft không
        const draftData = await checkDraftSubmission(id, token);
        setHasDraft(draftData.has_draft || false);
        setDraftSubmission(draftData.submission || null);

        // 3. Lấy lịch sử làm bài (chỉ lấy những bài đã nộp)
        const subsData = await getUserAssignmentSubmissions(id, token);

        // Filter chỉ lấy submissions đã nộp
        const completedSubs = (subsData.submissions || []).filter(
          (sub) => sub.submitted_at !== null && sub.submitted_at !== undefined
        );
        setSubmissions(completedSubs);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu bài tập");
        setAssignment(null);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, token, navigate]);

  const handleStart = () => {
    if (isExpired) {
      message.warning("Bài tập đã quá hạn. Bạn không thể tiếp tục.");
      return;
    }

    if (attemptsLeft <= 0 && !hasDraft) {
      message.warning("Bạn đã hết lượt làm bài.");
      return;
    }

    navigate(`/assignment/${id}/start`);
  };

  const columns = [
    {
      title: "Lần làm",
      dataIndex: "attempt_num",
      width: 100,
      align: "center",
      render: (attempt) => (
        <Badge
          count={attempt}
          style={{
            backgroundColor: "#667eea",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
          }}
        />
      ),
    },
    {
      title: "Điểm số",
      align: "center",
      render: (row) => (
        <div style={{ textAlign: "center" }}>
          <Statistic
            value={row.score}
            suffix={`/ ${row.max_score}`}
            valueStyle={{
              fontSize: 16,
              fontWeight: 600,
              color: row.is_passed ? "#52c41a" : "#ff4d4f",
            }}
          />
          <Progress
            percent={Math.round((row.score / row.max_score) * 100)}
            size="small"
            strokeColor={row.is_passed ? "#52c41a" : "#ff4d4f"}
            trailColor="#f0f0f0"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (row) =>
        row.is_passed ? (
          <Tag
            icon={<CheckCircleOutlined />}
            color="green"
            style={{
              background: "rgba(82, 196, 26, 0.1)",
              color: "#52c41a",
              border: "none",
              borderRadius: 12,
              fontWeight: 500,
            }}
          >
            Đạt
          </Tag>
        ) : (
          <Tag
            icon={<CloseCircleOutlined />}
            color="red"
            style={{
              background: "rgba(255, 77, 79, 0.1)",
              color: "#ff4d4f",
              border: "none",
              borderRadius: 12,
              fontWeight: 500,
            }}
          >
            Chưa đạt
          </Tag>
        ),
    },
    {
      title: "Thời gian nộp",
      align: "center",
      dataIndex: "submitted_at",
      render: (date) => (
        <Space size="small">
          <CalendarOutlined />
          <Text type="secondary">
            {date ? new Date(date).toLocaleString("vi-VN") : "N/A"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Xem chi tiết",
      align: "center",
      render: (row) => (
        <Button
          type="link"
          disabled={!allowReview}
          onClick={() =>
            navigate(`/assignment/${row.assignment_id}/submission/${row.id}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

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
              Đang tải chi tiết bài tập...
            </Text>
          }
        />
      </div>
    );
  }

  if (!assignment) {
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
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <Alert
            message="Không tìm thấy bài tập"
            description="Bài tập bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
            type="error"
            showIcon
          />
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              marginTop: 16,
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

  // Xác định trạng thái nút
  const canStart = !isExpired && (attemptsLeft > 0 || hasDraft);
  const buttonText = hasDraft ? "Tiếp tục làm bài" : "Làm bài ngay";
  const buttonIcon = hasDraft ? <EditOutlined /> : <PlayCircleOutlined />;

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
                      {assignment.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.5,
                      }}
                    >
                      {assignment.description}
                    </Paragraph>

                    {/* METADATA */}
                    <Space style={{ marginTop: 16 }} size={24}>
                      <Tag color={allowReview ? "green" : "red"}>
                        {allowReview
                          ? "Cho phép xem đáp án"
                          : "Không xem đáp án"}
                      </Tag>
                    </Space>
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
                    {assignment.max_attempts} lượt tối đa
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
                    {attemptsLeft} lượt còn lại
                  </Tag>
                  {assignment.due_date && (
                    <Tag
                      style={{
                        background: isExpired
                          ? "rgba(255, 77, 79, 0.3)"
                          : "rgba(255,255,255,0.15)",
                        color: "white",
                        border: `1px solid ${
                          isExpired
                            ? "rgba(255, 77, 79, 0.5)"
                            : "rgba(255,255,255,0.3)"
                        }`,
                        borderRadius: 20,
                        padding: "4px 12px",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {new Date(assignment.due_date).toLocaleString("vi-VN")}
                    </Tag>
                  )}
                </Space>
              </Col>

              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  icon={buttonIcon}
                  onClick={handleStart}
                  disabled={!canStart}
                  style={{
                    background: !canStart
                      ? "linear-gradient(135deg, #d9d9d9 0%, #bfbfbf 100%)"
                      : hasDraft
                      ? "linear-gradient(135deg, #faad14 0%, #fa8c16 100%)"
                      : "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 600,
                    height: 56,
                    width: "100%",
                    fontSize: 16,
                    boxShadow: !canStart
                      ? "none"
                      : hasDraft
                      ? "0 4px 16px rgba(250, 173, 20, 0.4)"
                      : "0 4px 16px rgba(255, 107, 53, 0.4)",
                  }}
                >
                  {isExpired
                    ? "Đã quá hạn"
                    : attemptsLeft <= 0 && !hasDraft
                    ? "Hết lượt"
                    : buttonText}
                </Button>
                {hasDraft && draftSubmission && (
                  <Text
                    style={{
                      display: "block",
                      marginTop: 8,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 12,
                    }}
                  >
                    Bạn có bài làm dở từ{" "}
                    {new Date(draftSubmission.started_at).toLocaleString(
                      "vi-VN"
                    )}
                  </Text>
                )}
              </Col>
            </Row>
          </div>
        </Card>

        {/* ALERTS */}
        {hasDraft && (
          <Alert
            message="Bạn có bài làm chưa hoàn thành"
            description="Bạn đã bắt đầu làm bài tập này nhưng chưa nộp. Nhấn 'Tiếp tục làm bài' để hoàn thành."
            type="info"
            showIcon
            icon={<EditOutlined />}
            style={{ marginBottom: 24, borderRadius: 16, border: "none" }}
          />
        )}

        {isExpired && (
          <Alert
            message="Đã quá hạn"
            description="Bài tập này hết hạn. Bạn không thể tiếp tục làm bài."
            type="error"
            showIcon
            style={{ marginBottom: 24, borderRadius: 16, border: "none" }}
          />
        )}

        {!isExpired && attemptsLeft <= 0 && !hasDraft && (
          <Alert
            message="Đã hết lượt làm bài"
            description={`Bạn đã sử dụng hết ${assignment.max_attempts} lượt làm bài cho bài tập này.`}
            type="warning"
            showIcon
            style={{ marginBottom: 24, borderRadius: 16, border: "none" }}
          />
        )}

        {/* LỊCH SỬ LÀM BÀI */}
        <Card style={{ borderRadius: 20, border: "none", overflow: "hidden" }}>
          <div style={{ padding: 5 }}>
            <Title
              level={3}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 10,
              }}
            >
              <HistoryOutlined style={{ color: "#667eea" }} />
              Lịch sử làm bài (Đã nộp)
            </Title>
            <Divider style={{ margin: 0 }} />
          </div>

          {submissions.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center" }}>
              <HistoryOutlined
                style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
              />
              <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
                Chưa có lần làm nào hoàn thành
              </Title>
              <Text type="secondary">
                Bạn chưa hoàn thành và nộp bài tập này
              </Text>
            </div>
          ) : (
            <div style={{ padding: 24, margin: 0 }}>
              <Table
                dataSource={submissions}
                columns={columns}
                rowKey="id"
                pagination={false}
                bordered
                size="middle"
                style={{ borderRadius: 12, overflow: "hidden" }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AssignmentDetail;
