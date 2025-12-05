import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Switch,
  DatePicker,
  Input,
  Descriptions,
  Typography,
  Select,
  Form,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  BookOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  listSubjects,
  createSubject,
  deleteSubject,
  updateSubject,
  toggleSubjectStatus,
  getSubjectDetail,
} from "../../../services/api_subject";
import SubjectForm from "./SubjectForm";
import SubjectFormEdit from "./SubjectFormEdit";
import { ThemeContext } from "../../../context/useTheme";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SubjectPage = () => {
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const user = JSON.parse(localStorage.getItem("user"));
  const { isDarkMode } = useContext(ThemeContext); // dùng context dark mode

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  // edit
  const [editingSubject, setEditingSubject] = useState(null);
  const [updating, setUpdating] = useState(false);

  // search + filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [dateRange, setDateRange] = useState([null, null]);
  const [lecturerFilter, setLecturerFilter] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // detail
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listSubjects({
        search: searchText,
        status: statusFilter,
        from_date: dateRange[0]?.format("YYYY-MM-DD"),
        to_date: dateRange[1]?.format("YYYY-MM-DD"),
        lecturer: lecturerFilter,
        page,
        limit,
      });
      setSubjects(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách môn học");
    }
    setLoading(false);
  }, [searchText, statusFilter, dateRange, lecturerFilter, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [searchText, statusFilter, dateRange, lecturerFilter]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleCreate = async (values) => {
    try {
      setCreating(true);
      await createSubject(values.name, values.course_code);
      message.success("Thêm môn học thành công");
      setModalVisible(false);
      loadSubjects();
      createForm.resetFields();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Lỗi khi thêm môn học";
      if (errorMsg.includes("đã tồn tại")) {
        createForm.setFields([{ name: "name", errors: [errorMsg] }]);
      } else message.error(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      message.success("Đã xoá môn học");
      loadSubjects();
    } catch (error) {
      // lấy message backend trả về
      const backendMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Không thể xoá môn học";

      message.error(backendMsg);
    }
  };

  const fetchSubjectDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getSubjectDetail(id);
      setDetailData(data);
      setDetailVisible(true);
    } catch {
      message.error("Không thể lấy chi tiết môn học");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = async (record) => {
    try {
      setUpdating(true);
      const data = await getSubjectDetail(record.id);
      setEditingSubject(data);
    } catch {
      message.error("Không thể tải chi tiết môn học");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      await updateSubject(editingSubject.id, values);
      message.success("Cập nhật môn học thành công");
      setEditingSubject(null);
      loadSubjects();
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg?.includes("tồn tại")) {
        editForm.setFields([{ name: "name", errors: [msg] }]);
      } else message.error(msg || "Lỗi khi cập nhật môn học");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleSubjectStatus(id);
      message.success(res.message);
      loadSubjects();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status}
          checkedChildren="Kích hoạt"
          unCheckedChildren="Ngừng"
          onChange={() => handleToggle(record.id)}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "Người tạo",
            dataIndex: ["user", "full_name"],
            key: "creator",
            render: (_, record) =>
              record.user?.full_name || record.user?.email || "—",
          },
        ]
      : []),
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xoá môn học?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => fetchSubjectDetail(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            Quản lý Môn học
          </Title>
          <Text type="secondary">Tạo, chỉnh sửa và quản lý môn học</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => loadSubjects()}>
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Thêm môn học
            </Button>
          </Space>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input.Search
          placeholder="Tìm kiếm môn học"
          enterButton
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => loadSubjects()}
          style={{
            width: 250,
            background: isDarkMode ? "#1f2937" : undefined,
            color: isDarkMode ? "#e5e7eb" : undefined,
          }}
        />
        <RangePicker
          style={{ width: 250 }}
          value={dateRange}
          onChange={(dates) => {
            setDateRange(dates || [null, null]);
            setPage(1);
            loadSubjects();
          }}
          format="YYYY-MM-DD"
          allowClear
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="true">Kích hoạt</Option>
          <Option value="false">Ngừng</Option>
        </Select>
        {user?.role === "admin" && (
          <Input
            placeholder="Lọc theo giảng viên"
            allowClear
            value={lecturerFilter}
            onChange={(e) => setLecturerFilter(e.target.value)}
            style={{ width: 200 }}
          />
        )}
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={subjects}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
        style={{
          borderRadius: 12,
          overflow: "hidden",
        }}
        rowClassName={() => (isDarkMode ? "dark-row" : "")}
      />

      {/* Modal thêm */}
      <Modal
        open={modalVisible}
        title="Thêm môn học"
        onCancel={() => {
          setModalVisible(false);
          createForm.resetFields(); // reset form khi đóng
        }}
        footer={null}
        centered
        styles={{
          content: {
            background: isDarkMode ? "#1f2937" : "#fff",
            color: isDarkMode ? "#e5e7eb" : "#000",
          },
        }}
      >
        <SubjectForm
          form={createForm}
          onFinish={handleCreate}
          loading={creating}
        />
      </Modal>

      {/* Modal sửa */}
      <Modal
        open={!!editingSubject}
        title="Cập nhật môn học"
        onCancel={() => {
          setEditingSubject(null);
          editForm.resetFields(); // reset form khi đóng
        }}
        footer={null}
        centered
      >
        {editingSubject && (
          <SubjectFormEdit
            form={editForm}
            initialValues={editingSubject}
            onFinish={handleUpdate}
            loading={updating}
          />
        )}
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết môn học"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        centered
      >
        {detailLoading ? (
          <p>Đang tải...</p>
        ) : detailData ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{detailData.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">
              {detailData.slug || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detailData.status ? "Kích hoạt" : "Ngừng"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(detailData.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(detailData.updated_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Người cập nhật">
              {detailData.updated_by_user?.full_name || "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>
    </div>
  );
};

export default SubjectPage;
