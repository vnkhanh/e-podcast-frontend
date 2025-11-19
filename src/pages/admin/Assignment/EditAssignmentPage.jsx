import React, { useEffect, useState, useCallback } from "react";
import {
  Tabs,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Typography,
  Button,
  Table,
  Space,
  Card,
  Modal,
  message,
  Select,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
// Import APIs
import {
  fetchAssignmentDetail,
  updateAssignment,
  fetchAssignmentQuestions,
  createAssignmentQuestion,
  updateAssignmentQuestion,
  deleteAssignmentQuestion,
} from "../../../services/api_assignment";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const EditAssignmentPage = () => {
  const { id: assignmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);

  const [form] = Form.useForm();

  // Questions
  const [questions, setQuestions] = useState([]);
  const [qForm] = Form.useForm();
  const [editingQ, setEditingQ] = useState(null);
  const [qModalOpen, setQModalOpen] = useState(false);

  // ===========================
  // LOAD ASSIGNMENT
  // ===========================
  const loadAssignment = useCallback(async () => {
    if (!assignmentId) return;
    try {
      setPageLoading(true);
      const res = await fetchAssignmentDetail(assignmentId);
      const a = res.assignment;
      setAssignment(a);

      form.setFieldsValue({
        title: a.title,
        description: a.description,
        due_date: a.due_date ? dayjs(a.due_date) : null,
        max_attempts: a.max_attempts,
        time_limit: a.time_limit,
        pass_score: a.pass_score,
        has_password: a.has_password,
        password: a.password,
        allow_review: a.allow_review,
        is_published: a.is_published,
      });
    } catch (err) {
      console.error("Load assignment error:", err);
      message.error(
        "Không thể tải bài tập: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setPageLoading(false);
    }
  }, [assignmentId, form]);

  // ===========================
  // LOAD QUESTIONS
  // ===========================
  const loadQuestions = useCallback(async () => {
    if (!assignmentId) return;
    try {
      const res = await fetchAssignmentQuestions(assignmentId);
      setQuestions(res.questions || []);
    } catch (err) {
      console.error("Load questions error:", err);
      message.error("Không thể tải danh sách câu hỏi");
    }
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId) {
      message.error("Không tìm thấy ID bài tập");
      navigate(-1);
      return;
    }
    loadAssignment();
    loadQuestions();
  }, [assignmentId, loadAssignment, loadQuestions, navigate]);

  // ===========================
  // UPDATE METADATA
  // ===========================
  const handleUpdateMetadata = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await updateAssignment(assignmentId, {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : null,
      });

      message.success("Đã cập nhật bài tập");
      loadAssignment();
    } catch (err) {
      console.error("Update error:", err);
      message.error(
        "Lỗi cập nhật: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // QUESTION MODAL
  // ===========================
  const openAddQuestion = () => {
    setEditingQ(null);
    qForm.resetFields();
    qForm.setFieldsValue({
      difficulty: "medium",
      points: 1,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
    });
    setQModalOpen(true);
  };

  const openEditQuestion = (q) => {
    setEditingQ(q);
    qForm.setFieldsValue({
      question: q.question,
      explanation: q.explanation,
      difficulty: q.difficulty,
      points: q.points,
      options: q.options.map((o) => ({
        id: o.id,
        option_text: o.option_text,
        is_correct: o.is_correct,
      })),
    });
    setQModalOpen(true);
  };

  const handleSubmitQuestion = async () => {
    try {
      const values = await qForm.validateFields();

      // Kiểm tra phải có ít nhất 1 đáp án đúng
      const hasCorrect = values.options?.some((o) => o.is_correct);
      if (!hasCorrect) {
        message.error("Phải có ít nhất 1 đáp án đúng!");
        return;
      }

      const payload = {
        question: values.question,
        explanation: values.explanation || "",
        difficulty: values.difficulty || "medium",
        points: values.points || 1,
        sort_order: editingQ ? editingQ.sort_order : questions.length + 1,
        options: values.options.map((o, idx) => ({
          id: o.id || null,
          option_text: o.option_text,
          is_correct: o.is_correct || false,
          sort_order: idx + 1,
        })),
      };

      if (editingQ) {
        await updateAssignmentQuestion(editingQ.id, payload);
      } else {
        await createAssignmentQuestion(assignmentId, payload);
      }

      message.success("Đã lưu câu hỏi");
      setQModalOpen(false);
      loadQuestions();
    } catch (err) {
      console.error("Submit question error:", err);
      message.error(
        "Lỗi khi lưu câu hỏi: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const deleteQuestion = (q) => {
    Modal.confirm({
      title: "Xóa câu hỏi?",
      content: "Bạn có chắc chắn muốn xóa câu hỏi này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteAssignmentQuestion(q.id);
          message.success("Đã xóa câu hỏi");
          loadQuestions();
        } catch (err) {
          console.error("Delete error:", err);
          message.error("Không thể xóa câu hỏi");
        }
      },
    });
  };
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldsValue({ password });
  };

  const hasPassword = Form.useWatch("has_password", form);

  const columns = [
    {
      title: "STT",
      width: "5%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      width: "55%",
      ellipsis: true,
    },
    {
      title: "Độ khó",
      dataIndex: "difficulty",
      width: "10%",
      render: (d) => {
        const colors = { easy: "green", medium: "orange", hard: "red" };
        const labels = { easy: "Dễ", medium: "TB", hard: "Khó" };
        return (
          <span style={{ color: colors[d] || "gray" }}>{labels[d] || d}</span>
        );
      },
    },
    {
      title: "Điểm",
      dataIndex: "points",
      width: "10%",
    },
    {
      title: "Thao tác",
      width: "20%",
      render: (_, q) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditQuestion(q)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => deleteQuestion(q)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Loading state
  if (pageLoading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Chỉnh sửa bài tập: ${assignment?.title ?? ""}`}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      }
    >
      <Tabs defaultActiveKey="meta">
        {/* ============= TAB METADATA ============= */}
        <Tabs.TabPane tab="Thông tin cơ bản" key="meta">
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Tên bài tập"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tên bài tập" }]}
            >
              <Input placeholder="Nhập tên bài tập..." />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <TextArea rows={3} placeholder="Mô tả bài tập (không bắt buộc)" />
            </Form.Item>

            <Form.Item label="Hạn nộp" name="due_date">
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn thời hạn nộp bài"
              />
            </Form.Item>

            <Form.Item label="Số lần làm tối đa" name="max_attempts">
              <InputNumber
                min={1}
                max={10}
                style={{ width: "100%" }}
                placeholder="Số lần sinh viên được làm"
              />
            </Form.Item>

            <Form.Item label="Thời gian làm (phút)" name="time_limit">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="0 = không giới hạn"
              />
            </Form.Item>

            <Form.Item label="Điểm đạt (thang 10)" name="pass_score">
              <InputNumber
                min={0}
                max={10}
                step={0.5}
                style={{ width: "100%" }}
                placeholder="Điểm tối thiểu để đạt"
              />
            </Form.Item>

            <Form.Item
              label="Bảo vệ bằng mật khẩu"
              name="has_password"
              valuePropName="checked"
            >
              <Switch
                onChange={(checked) => {
                  if (!checked) {
                    form.setFieldsValue({ password: "" }); // reset mật khẩu khi tắt
                  }
                }}
              />
            </Form.Item>

            {hasPassword && (
              <Form.Item
                label="Mật khẩu bài tập"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập hoặc tạo mật khẩu",
                  },
                  { min: 4, message: "Mật khẩu phải có ít nhất 4 ký tự" },
                  { max: 20, message: "Mật khẩu không được quá 20 ký tự" },
                ]}
                extra={
                  <Text type="secondary">
                    Sinh viên cần nhập mật khẩu này để làm bài
                  </Text>
                }
              >
                <Input
                  placeholder="Nhập mật khẩu mới hoặc tạo tự động"
                  addonAfter={
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={generatePassword}
                      title="Tạo mật khẩu ngẫu nhiên"
                    />
                  }
                />
              </Form.Item>
            )}

            <Form.Item
              label="Cho phép sinh viên xem lại đáp án"
              name="allow_review"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Công bố bài tập"
              name="is_published"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleUpdateMetadata}
            >
              Lưu thay đổi
            </Button>
          </Form>
        </Tabs.TabPane>

        {/* ============= TAB QUESTIONS ============= */}
        <Tabs.TabPane tab={`Câu hỏi (${questions.length})`} key="questions">
          <Space style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddQuestion}
            >
              Thêm câu hỏi
            </Button>
            <span style={{ color: "#888" }}>
              Tổng số câu: {questions.length}
            </span>
          </Space>

          <Table
            columns={columns}
            dataSource={questions}
            rowKey="id"
            pagination={false}
            bordered
          />
        </Tabs.TabPane>
      </Tabs>

      {/* ============= MODAL EDIT/ADD QUESTION ============= */}
      <Modal
        open={qModalOpen}
        onCancel={() => setQModalOpen(false)}
        onOk={handleSubmitQuestion}
        width={800}
        title={editingQ ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={qForm}>
          <Form.Item
            name="question"
            label="Câu hỏi"
            rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
          >
            <TextArea rows={3} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>

          <Form.Item name="explanation" label="Giải thích đáp án">
            <TextArea
              rows={2}
              placeholder="Giải thích tại sao đáp án đúng (không bắt buộc)"
            />
          </Form.Item>

          <Space style={{ width: "100%" }}>
            <Form.Item name="difficulty" label="Độ khó">
              <Select style={{ width: 150 }}>
                <Option value="easy">🟢 Dễ</Option>
                <Option value="medium">🟡 Trung bình</Option>
                <Option value="hard">🔴 Khó</Option>
              </Select>
            </Form.Item>

            <Form.Item name="points" label="Điểm">
              <InputNumber min={0} step={0.5} placeholder="1.0" />
            </Form.Item>
          </Space>

          <Form.Item label="Các đáp án (chọn đáp án đúng)">
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{
                        display: "flex",
                        marginBottom: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ marginTop: 8, fontWeight: "bold" }}>
                        {String.fromCharCode(65 + index)}.
                      </span>

                      <Form.Item
                        {...field}
                        name={[field.name, "option_text"]}
                        rules={[
                          { required: true, message: "Nhập nội dung đáp án" },
                        ]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder={`Đáp án ${index + 1}`} />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, "is_correct"]}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <Switch
                          checkedChildren="✓ Đúng"
                          unCheckedChildren="✗ Sai"
                        />
                      </Form.Item>

                      {fields.length > 2 && (
                        <Button
                          danger
                          size="small"
                          onClick={() => remove(field.name)}
                        >
                          Xóa
                        </Button>
                      )}
                    </Space>
                  ))}

                  {fields.length < 6 && (
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm đáp án
                    </Button>
                  )}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default EditAssignmentPage;
