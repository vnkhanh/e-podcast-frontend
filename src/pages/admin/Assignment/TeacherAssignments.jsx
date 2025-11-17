import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Select,
  Switch,
  Space,
  Upload,
  Tooltip,
  Tag,
  Alert,
  Card,
  Typography,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FileTextOutlined,
  RobotOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  fetchAssignments,
  fetchSubjects,
  fetchPodcastsByChapter,
  createAssignmentFromFile,
  updateAssignment,
  deleteAssignment,
  togglePublish,
  createAssignmentFromGemini,
} from "../../../services/api_assignment";
import { useNavigate } from "react-router-dom";

import CreateAssignmentModal from "./CreateAssignmentModal";
import EditAssignmentModal from "./EditAssignmentModal";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const TeacherAssignments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formGemini] = Form.useForm();

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ================= FETCH ASSIGNMENTS =================
  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetchAssignments();
      let list = [];
      if (Array.isArray(res.assignments)) list = res.assignments;
      else if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res)) list = res;
      setData(list);
    } catch (error) {
      message.error("Không thể tải danh sách bài tập");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD SUBJECTS =================
  const loadSubjectsData = async () => {
    try {
      setSubjectsLoading(true);
      const res = await fetchSubjects();
      let list = [];
      if (Array.isArray(res.subjects)) list = res.subjects;
      else if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res)) list = res;
      setSubjects(list);
      if (list.length === 0)
        setError("Không có môn học nào. Vui lòng tạo môn học trước.");
    } catch (error) {
      message.error("Không tải được danh sách môn học");
      setSubjects([]);
      console.error(error);
    } finally {
      setSubjectsLoading(false);
    }
  };

  // ================= LOAD CHAPTERS =================
  const loadChapters = (subjectId) => {
    if (!subjectId) return setChapters([]);
    const subject = subjects.find((s) => s.id === subjectId);
    setChapters(subject?.chapters || []);
  };

  // ================= LOAD PODCASTS =================
  const loadPodcasts = async (chapterId) => {
    if (!chapterId) return setPodcasts([]);
    try {
      const res = await fetchPodcastsByChapter(chapterId);
      setPodcasts(res.podcasts || []);
    } catch (error) {
      message.error("Không tải được podcast");
      console.error(error);
      setPodcasts([]);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    loadAssignments();
    loadSubjectsData();
  }, []);

  // ================= OPEN MODALS =================
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    formCreate.resetFields();
    setChapters([]);
    setPodcasts([]);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);

    formEdit.setFieldsValue({
      title: item.title,
      description: item.description,
      due_date: item.due_date ? dayjs(item.due_date) : null,
      max_attempts: item.max_attempts,
      time_limit: item.time_limit,
      pass_score: item.pass_score,
      is_published: item.is_published,
      has_password: item.has_password || false,
      password: item.password || "",
    });
  };

  const openGeminiModal = () => {
    setIsGeminiModalOpen(true);
    formGemini.resetFields();
    setChapters([]);
    setPodcasts([]);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    formGemini.setFieldsValue({ password });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài tập này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteAssignment(id);
          message.success("Xóa bài tập thành công");
          loadAssignments();
        } catch (error) {
          message.error("Xóa bài tập thất bại");
          console.error(error);
        }
      },
    });
  };

  // ================= TOGGLE PUBLISH =================
  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id);
      message.success(`Bài tập đã ${currentStatus ? "ẩn" : "công bố"}`);
      loadAssignments();
    } catch (error) {
      message.error("Thay đổi trạng thái thất bại");
      console.error(error);
    }
  };

  // ================= VIEW SUBMISSIONS =================
  const handleViewSubmissions = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}/submissions`);
  };

  // ================= CREATE FROM FILE =================
  const handleCreateFromFile = async (values) => {
    try {
      setUploadLoading(true);
      const formData = new FormData();

      // Add all form values
      Object.entries(values).forEach(([key, val]) => {
        if (key === "due_date" && val) {
          formData.append(key, val.toISOString());
        } else if (key !== "file") {
          formData.append(key, val);
        }
      });

      // Add file
      if (values.file && values.file.file) {
        formData.append("file", values.file.file);
      }

      await createAssignmentFromFile(formData);
      message.success("Tạo bài tập từ file thành công");
      setIsCreateModalOpen(false);
      formCreate.resetFields();
      loadAssignments();
    } catch (error) {
      message.error(error.error || "Tạo bài tập thất bại");
      console.error(error);
    } finally {
      setUploadLoading(false);
    }
  };

  // ================= EDIT ASSIGNMENT =================
  const handleEditAssignment = async (values) => {
    try {
      setUploadLoading(true);
      const payload = {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : null,
      };

      await updateAssignment(editingItem.id, payload);
      message.success("Cập nhật bài tập thành công");
      setIsEditModalOpen(false);
      formEdit.resetFields();
      loadAssignments();
    } catch (error) {
      message.error(error.error || "Cập nhật thất bại");
      console.error(error);
    } finally {
      setUploadLoading(false);
    }
  };

  // ================= CREATE FROM GEMINI =================
  const handleCreateFromGemini = async () => {
    try {
      const values = await formGemini.validateFields();
      setGeminiLoading(true);

      const payload = {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : null,
      };
      await createAssignmentFromGemini(payload);
      message.success("Tạo bài tập từ AI thành công");
      setIsGeminiModalOpen(false);
      formGemini.resetFields();
      loadAssignments();
    } catch (error) {
      message.error(error.error || "Tạo bài tập thất bại");
      console.error(error);
    } finally {
      setGeminiLoading(false);
    }
  };

  const hasGeminiPassword = Form.useWatch("has_password", formGemini);

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {title}
            {record.has_password && (
              <Tooltip title={`Mật khẩu: ${record.password}`}>
                <LockOutlined style={{ marginLeft: 8, color: "#faad14" }} />
              </Tooltip>
            )}
          </div>
          {record.description && (
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              {record.description.length > 50
                ? `${record.description.substring(0, 50)}...`
                : record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Podcast",
      dataIndex: ["podcast", "title"],
      key: "podcast",
      width: 150,
      render: (title) => title || "—",
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questions",
      key: "question_count",
      width: 100,
      render: (questions) => questions?.length || 0,
    },
    {
      title: "Hạn nộp",
      dataIndex: "due_date",
      key: "due_date",
      width: 120,
      render: (dueDate) =>
        dueDate ? dayjs(dueDate).format("DD/MM/YYYY") : "—",
    },
    {
      title: "Số lần làm",
      dataIndex: "max_attempts",
      key: "max_attempts",
      width: 100,
      render: (attempts) => attempts || 1,
    },
    {
      title: "Điểm đạt",
      dataIndex: "pass_score",
      key: "pass_score",
      width: 100,
      render: (score) => (score ? `${score}/10` : "5/10"),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_published",
      key: "is_published",
      width: 120,
      render: (published, record) => (
        <Space>
          <Tag color={published ? "green" : "orange"}>
            {published ? "Đã công bố" : "Bản nháp"}
          </Tag>
          {record.has_password && (
            <Tag icon={<LockOutlined />} color="warning">
              Có mật khẩu
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={record.is_published ? "Ẩn bài tập" : "Công bố"}>
            <Button
              icon={
                record.is_published ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              size="small"
              type={record.is_published ? "default" : "primary"}
              onClick={() =>
                handleTogglePublish(record.id, record.is_published)
              }
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
          <Tooltip title="Xem bài nộp">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewSubmissions(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      const isExcel =
        file.type.includes("spreadsheet") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv");
      if (!isExcel) {
        message.error("Chỉ chấp nhận file Excel hoặc CSV");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    maxCount: 1,
    accept: ".xlsx,.xls,.csv",
  };

  return (
    <div>
      <Card
        title="Quản lý Bài tập"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={openGeminiModal}
            >
              Tạo từ AI
            </Button>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={openCreateModal}
            >
              Tạo từ File
            </Button>
          </Space>
        }
      >
        {error && (
          <Alert
            message="Thông báo"
            description={error}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài tập`,
          }}
        />
      </Card>

      <CreateAssignmentModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFromFile}
        form={formCreate}
        subjects={subjects}
        chapters={chapters}
        podcasts={podcasts}
        subjectsLoading={subjectsLoading}
        loadChapters={loadChapters}
        loadPodcasts={loadPodcasts}
        uploadProps={uploadProps}
        loading={uploadLoading}
      />

      <EditAssignmentModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleEditAssignment}
        form={formEdit}
        loading={uploadLoading}
      />

      <Modal
        title="Tạo bài tập từ AI (Gemini)"
        open={isGeminiModalOpen}
        onCancel={() => setIsGeminiModalOpen(false)}
        onOk={handleCreateFromGemini}
        width={700}
        confirmLoading={geminiLoading}
      >
        <Form layout="vertical" form={formGemini}>
          <Form.Item
            label="Tên bài tập"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên bài tập" }]}
          >
            <Input placeholder="Nhập tên bài tập..." />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={2} placeholder="Mô tả bài tập (không bắt buộc)" />
          </Form.Item>
          <Form.Item
            label="Môn học"
            name="subject_id"
            rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
          >
            <Select
              placeholder="Chọn môn học"
              loading={subjectsLoading}
              onChange={(val) => {
                formGemini.setFieldsValue({
                  chapter_id: null,
                  podcast_id: null,
                });
                setPodcasts([]);
                loadChapters(val);
              }}
            >
              {subjects.map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name || subject.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Chương"
            name="chapter_id"
            rules={[{ required: true, message: "Vui lòng chọn chương" }]}
          >
            <Select
              placeholder="Chọn chương"
              onChange={(val) => {
                formGemini.setFieldsValue({ podcast_id: null });
                loadPodcasts(val);
              }}
              disabled={chapters.length === 0}
            >
              {chapters.map((chapter) => (
                <Option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Podcast"
            name="podcast_id"
            rules={[{ required: true, message: "Vui lòng chọn podcast" }]}
          >
            <Select placeholder="Chọn podcast" disabled={podcasts.length === 0}>
              {podcasts.map((podcast) => (
                <Option key={podcast.id} value={podcast.id}>
                  {podcast.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Số câu hỏi"
            name="num_questions"
            initialValue={10}
            rules={[{ required: true, message: "Vui lòng nhập số câu hỏi" }]}
          >
            <InputNumber
              min={5}
              max={50}
              style={{ width: "100%" }}
              placeholder="Số câu hỏi cần tạo"
            />
          </Form.Item>
          <Form.Item label="Hạn nộp" name="due_date">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn hạn nộp"
              showTime
            />
          </Form.Item>
          <Form.Item
            label="Số lần làm tối đa"
            name="max_attempts"
            initialValue={1}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Thời gian làm (phút)"
            name="time_limit"
            initialValue={0}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="0 = không giới hạn"
            />
          </Form.Item>
          <Form.Item
            label="Điểm đạt (thang 10)"
            name="pass_score"
            initialValue={5.0}
          >
            <InputNumber
              min={0}
              max={10}
              step={0.5}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Bảo vệ bằng mật khẩu"
            name="has_password"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          {hasGeminiPassword && (
            <Form.Item
              label="Mật khẩu bài tập"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập hoặc tạo mật khẩu" },
                { min: 4, message: "Mật khẩu phải có ít nhất 4 ký tự" },
                { max: 20, message: "Mật khẩu không được quá 20 ký tự" },
              ]}
              extra={
                <Text type="secondary">
                  Sinh viên cần nhập mật khẩu này để làm bài
                </Text>
              }
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Nhập mật khẩu hoặc tạo tự động"
                  style={{ width: "calc(100% - 40px)" }}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={generatePassword}
                  title="Tạo mật khẩu ngẫu nhiên"
                />
              </Space.Compact>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherAssignments;
