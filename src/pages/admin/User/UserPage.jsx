import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  message,
  Modal,
  Row,
  Col,
  Form,
  Switch,
  Popconfirm,
  Typography,
  Tag,
} from "antd";
import {
  listUsers,
  createLecturer,
  ToggleUserStatus,
} from "../../../services/api_user";
import dayjs from "dayjs";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({ name: "", role: "" });

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async (page = 1, limit = 10, name = "", role = "") => {
    setLoading(true);
    try {
      const res = await listUsers({ page, limit, name, role });
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi lấy danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: "Họ tên", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === "teacher") {
          return <Tag color="blue">Giảng viên</Tag>;
        } else if (role === "admin") {
          return <Tag color="red">Admin</Tag>;
        } else {
          return <Tag color="green">Sinh viên</Tag>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Popconfirm
          title={`Bạn có chắc muốn ${
            status ? "vô hiệu hóa" : "kích hoạt"
          } người dùng này không?`}
          onConfirm={async () => {
            try {
              await ToggleUserStatus(record.id); // Gọi PATCH /toggle-status
              message.success("Cập nhật trạng thái thành công");
              fetchUsers(
                pagination.page,
                pagination.limit,
                filters.name,
                filters.role
              );
            } catch (err) {
              message.error(
                err.response?.data?.error || "Lỗi khi cập nhật trạng thái"
              );
            }
          }}
        >
          <Switch
            checked={!!status}
            checkedChildren="Kích hoạt"
            unCheckedChildren="Vô hiệu hóa"
          />
        </Popconfirm>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
  ];

  // Pagination change
  const handleTableChange = (paginationTable) => {
    fetchUsers(
      paginationTable.current,
      paginationTable.pageSize,
      filters.name,
      filters.role
    );
  };

  // Filter
  const handleSearch = () => {
    fetchUsers(1, pagination.limit, filters.name, filters.role);
  };

  // Tạo giảng viên
  const handleCreateLecturer = async () => {
    try {
      const values = await form.validateFields();
      await createLecturer(values);
      message.success("Tạo giảng viên thành công");
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.error || "Lỗi khi tạo giảng viên");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        {/* Header */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Title level={2} style={{ marginBottom: 0 }}>
              Quản lý Người dùng
            </Title>
            <Text type="secondary">Tạo và quản lý tài khoản người dùng</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => fetchUsers()}>
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                Tạo tài khoản giảng viên
              </Button>
            </Space>
          </Col>
        </Row>
      </div>{" "}
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm theo tên"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          onSearch={handleSearch}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Chọn role"
          value={filters.role || undefined}
          onChange={(value) => setFilters({ ...filters, role: value })}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="student">Sinh viên</Option>
          <Option value="teacher">Giảng viên</Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>
          Lọc
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Tạo giảng viên"
        visible={modalVisible}
        onOk={handleCreateLecturer}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
