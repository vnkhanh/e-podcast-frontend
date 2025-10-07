import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Switch,
  Input,
  Descriptions,
  Select,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
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

const { Option } = Select;

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // create
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  // edit
  const [editingSubject, setEditingSubject] = useState(null);
  const [updating, setUpdating] = useState(false);

  // search + filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState();

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // detail
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // load list
  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listSubjects({
        search: searchText,
        status: statusFilter,
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
  }, [searchText, statusFilter, page, limit]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // create
  const handleCreate = async (values) => {
    try {
      setCreating(true);
      await createSubject(values.name);
      message.success("Thêm môn học thành công");
      setModalVisible(false);
      loadSubjects();
    } catch (err) {
      message.error(err.response?.data?.error || "Lỗi khi thêm môn học");
    } finally {
      setCreating(false);
    }
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      message.success("Đã xoá môn học");
      loadSubjects();
    } catch (err) {
      message.error("Không thể xoá môn học");
      console.error(err);
    }
  };

  // detail
  const fetchSubjectDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getSubjectDetail(id);
      setDetailData(data);
      setDetailVisible(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết môn học");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  // edit
  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      await updateSubject(editingSubject.id, values.name);
      message.success("Cập nhật môn học thành công");
      setEditingSubject(null);
      loadSubjects();
    } catch (err) {
      message.error(err.response?.data?.error || "Lỗi khi cập nhật môn học");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // toggle
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
      sortDirections: ["ascend", "descend"],
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
      sorter: (a, b) =>
        new Date(a.created_at) - new Date(b.created_at),
      sortDirections: ["ascend", "descend"],
    },
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

          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingSubject(record)}
          />

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
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Quản lý Môn học</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm môn học"
          allowClear
          onSearch={setSearchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
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

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Thêm môn học
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={subjects}
        loading={loading}
        rowClassName={(record) =>
          record.status ? "row-active" : "row-inactive"
        }
        onRow={(record) => ({
          style: {
            backgroundColor: record.status ? "#c7f5edff" : "#ffd0cdff",
          },
        })}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
      />

      {/* Modal thêm */}
      <Modal
        open={modalVisible}
        title="Thêm môn học"
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <SubjectForm onFinish={handleCreate} loading={creating} />
      </Modal>

      {/* Modal sửa */}
      <Modal
        open={!!editingSubject}
        title="Cập nhật môn học"
        onCancel={() => setEditingSubject(null)}
        footer={null}
        destroyOnClose
      >
        {editingSubject && (
          <SubjectFormEdit
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
      >
        {detailLoading ? (
          <p>Đang tải...</p>
        ) : detailData ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">
              {detailData.name}
            </Descriptions.Item>
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
          </Descriptions>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>
    </div>
  );
};

export default SubjectPage;
