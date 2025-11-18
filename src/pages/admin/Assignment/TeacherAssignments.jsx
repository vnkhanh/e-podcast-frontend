import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Row,
  Col,
  Space,
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Select,
  Switch,
  Typography,
  Alert,
  Card,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FileTextOutlined,
  RobotOutlined,
  LockOutlined,
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
import { ThemeContext } from "../../../context/useTheme";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const TeacherAssignments = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  // Forms
  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formGemini] = Form.useForm();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [podcastSearch, setPodcastSearch] = useState("");

  // ================= FETCH ASSIGNMENTS =================
  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAssignments({
        search,
        status: statusFilter,
        subject_id: subjectFilter,
        chapter_id: chapterFilter,
        podcast_search: podcastSearch,
        page,
        limit,
      });

      const list = Array.isArray(res.assignments)
        ? res.assignments
        : Array.isArray(res.data)
        ? res.data
        : res;
      setAssignments(list);
      setTotal(res.total || list.length);
    } catch (err) {
      message.error("Không thể tải danh sách bài tập");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    statusFilter,
    subjectFilter,
    chapterFilter,
    podcastSearch,
    page,
    limit,
  ]);

  // ================= FETCH SUBJECTS =================
  const loadSubjectsData = useCallback(async () => {
    try {
      setSubjectsLoading(true);
      const res = await fetchSubjects();
      const list = Array.isArray(res.subjects)
        ? res.subjects
        : Array.isArray(res.data)
        ? res.data
        : res;
      setSubjects(list);
      if (list.length === 0)
        setError("Không có môn học nào. Vui lòng tạo môn học trước.");
    } catch (err) {
      message.error("Không tải được danh sách môn học");
      setSubjects([]);
      console.error(err);
    } finally {
      setSubjectsLoading(false);
    }
  }, []);

  const loadChapters = (subjectId) => {
    if (!subjectId) return setChapters([]);
    const subject = subjects.find((s) => s.id === subjectId);
    setChapters(subject?.chapters || []);
  };

  const loadPodcasts = async (chapterId) => {
    if (!chapterId) return setPodcasts([]);
    try {
      const res = await fetchPodcastsByChapter(chapterId);
      setPodcasts(res.podcasts || []);
    } catch (err) {
      message.error("Không tải được podcast");
      setPodcasts([]);
      console.error(err);
    }
  };

  useEffect(() => {
    loadAssignments();
    loadSubjectsData();
  }, [loadAssignments, loadSubjectsData]);

  // ================= MODALS =================
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
      ...item,
      due_date: item.due_date ? dayjs(item.due_date) : null,
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

  // ================= CRUD =================
  const handleDelete = (id) => {
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
        } catch {
          message.error("Xóa bài tập thất bại");
        }
      },
    });
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id);
      message.success(`Bài tập đã ${currentStatus ? "ẩn" : "công bố"}`);
      loadAssignments();
    } catch {
      message.error("Thay đổi trạng thái thất bại");
    }
  };

  const handleViewSubmissions = (id) => {
    navigate(`/teacher/assignments/${id}/submissions`);
  };

  const handleCreateFromFile = async (values) => {
    try {
      setUploadLoading(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (key === "due_date" && val) formData.append(key, val.toISOString());
        else if (key !== "file") formData.append(key, val);
      });
      if (values.file && values.file.file)
        formData.append("file", values.file.file);
      await createAssignmentFromFile(formData);
      message.success("Tạo bài tập từ file thành công");
      setIsCreateModalOpen(false);
      formCreate.resetFields();
      loadAssignments();
    } catch {
      message.error("Tạo bài tập thất bại");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEditAssignment = async (values) => {
    try {
      setUploadLoading(true);
      const payload = {
        ...values,
        due_date: values.due_date?.toISOString() || null,
      };
      await updateAssignment(editingItem.id, payload);
      message.success("Cập nhật bài tập thành công");
      setIsEditModalOpen(false);
      formEdit.resetFields();
      loadAssignments();
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCreateFromGemini = async () => {
    try {
      const values = await formGemini.validateFields();
      setGeminiLoading(true);
      const payload = {
        ...values,
        due_date: values.due_date?.toISOString() || null,
      };
      await createAssignmentFromGemini(payload);
      message.success("Tạo bài tập từ AI thành công");
      setIsGeminiModalOpen(false);
      formGemini.resetFields();
      loadAssignments();
    } catch {
      message.error("Tạo bài tập thất bại");
    } finally {
      setGeminiLoading(false);
    }
  };

  const hasGeminiPassword = Form.useWatch("has_password", formGemini);

  // ================= TABLE =================
  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "title",
      key: "title",
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
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description.length > 50
                ? `${record.description.substring(0, 50)}...`
                : record.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Môn học",
      key: "subject",
      render: (_, record) => record?.podcast?.Chapter?.Subject?.name || "—",
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
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
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

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Quản lý Bài tập
          </Typography.Title>
          <Text type="secondary">Tạo, chỉnh sửa và quản lý bài tập</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadAssignments}>
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={openCreateModal}
            >
              Tạo từ File
            </Button>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={openGeminiModal}
            >
              Tạo từ AI
            </Button>
          </Space>
        </Col>
      </Row>

      {error && (
        <Alert
          message="Thông báo"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Tìm theo tên bài tập..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>

        <Col span={6}>
          <Select
            placeholder="Lọc theo môn học"
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => {
              setPage(1);
              setSubjectFilter(value);
            }}
          >
            {subjects.map((sub) => (
              <Option key={sub.id} value={sub.id}>
                {sub.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <Select
            placeholder="Lọc theo chương"
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => {
              setPage(1);
              setChapterFilter(value);
            }}
            disabled={!subjectFilter}
          >
            {(subjects.find((s) => s.id === subjectFilter)?.chapters || []).map(
              (chapter) => (
                <Option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </Option>
              )
            )}
          </Select>
        </Col>

        <Col span={6}>
          <Input
            placeholder="Tìm theo podcast..."
            value={podcastSearch}
            onChange={(e) => setPodcastSearch(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={assignments}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bài tập`,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
        rowClassName={() => (isDarkMode ? "dark-row" : "")}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

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
        confirmLoading={geminiLoading}
        width={700}
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
              disabled={chapters.length === 0}
              onChange={(val) => {
                formGemini.setFieldsValue({ podcast_id: null });
                loadPodcasts(val);
              }}
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

          <Form.Item label="Số câu hỏi" name="num_questions" initialValue={10}>
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
              showTime
              placeholder="Chọn hạn nộp"
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

          <Form.Item label="Điểm đạt" name="pass_score" initialValue={5}>
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Có mật khẩu"
            name="has_password"
            valuePropName="checked"
          >
            <Switch checked={hasGeminiPassword} onChange={generatePassword} />
          </Form.Item>

          {hasGeminiPassword && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Mật khẩu sẽ tự sinh khi bật switch"
                readOnly
              />
            </Form.Item>
          )}

          <Form.Item
            label="Công bố ngay"
            name="is_published"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Button
            type="primary"
            block
            onClick={handleCreateFromGemini}
            loading={geminiLoading}
          >
            Tạo bài tập
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherAssignments;
