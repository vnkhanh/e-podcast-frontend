import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  Row,
  Col,
  Space,
  Input,
  Select,
  Button,
  Table,
  Switch,
  Modal,
  Form,
  message,
  Typography,
  Descriptions,
  Popconfirm,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  listCategories,
  createCategory,
  deleteCategory,
  toggleCategoryStatus,
  updateCategory,
  getCategoryDetail,
} from "../../../services/api_category";
import CategoryFormEdit from "./CategoryFormEdit";
import { ThemeContext } from "../../../context/useTheme";

const { Title, Text } = Typography;
const { Option } = Select;

const CategoryPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);
  const { isDarkMode } = useContext(ThemeContext); // dùng context dark mode

  // Modal
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCategories({ search, status, page, limit });
      setCategories(res.data);
      setTotal(res.total);
    } catch (err) {
      message.error("Không thể tải danh sách danh mục");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, page, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (values) => {
    try {
      setLoading(true);
      await createCategory(values);
      message.success("Tạo danh mục thành công");
      createForm.resetFields();
      setVisibleAdd(false);
      fetchCategories();
    } catch (err) {
      message.error(err.response?.data?.error || "Không thể tạo danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await updateCategory(editingCategory.id, values.name);
      message.success("Cập nhật danh mục thành công");
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      message.error(err.response?.data?.error || "Không thể cập nhật danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Đã xoá danh mục");
      fetchCategories();
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Không thể xoá danh mục";

      message.error(errMsg);
    }
  };

  const fetchCategoryDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getCategoryDetail(id);
      setDetailData(data);
      setVisibleDetail(true);
    } catch {
      message.error("Không thể lấy chi tiết danh mục");
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value, record) => (
        <Switch
          checked={value}
          checkedChildren="Kích hoạt"
          unCheckedChildren="Ngừng"
          onChange={async () => {
            try {
              await toggleCategoryStatus(record.id);
              message.success("Đã cập nhật trạng thái");
              fetchCategories();
            } catch {
              message.error("Cập nhật trạng thái thất bại");
            }
          }}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (text) => new Date(text).toLocaleString(),
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
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => fetchCategoryDetail(record.id)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingCategory(record)}
          />
          <Popconfirm
            title="Xác nhận xoá danh mục?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            Quản lý Danh mục
          </Title>
          <Text type="secondary">
            Tạo, chỉnh sửa và quản lý danh mục học liệu
          </Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchCategories()}>
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setVisibleAdd(true)}
            >
              Thêm danh mục
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filter */}
      <Space
        style={{ marginBottom: 20, background: "inherit" }}
        variant="borderless"
      >
        <Space wrap>
          <Input.Search
            placeholder="Tìm kiếm danh mục"
            allowClear
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 160 }}
            onChange={(value) => {
              setStatus(value || "");
              setPage(1);
            }}
          >
            <Option value="true">Kích hoạt</Option>
            <Option value="false">Ngừng</Option>
          </Select>
        </Space>
      </Space>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
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
        style={{
          borderRadius: 12,
          overflow: "hidden",
        }}
        rowClassName={() => (isDarkMode ? "dark-row" : "")}
      />

      {/* Modal thêm */}
      <Modal
        title="Thêm danh mục mới"
        open={visibleAdd}
        onCancel={() => setVisibleAdd(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{ status: true }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="VD: Toán học" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Kích hoạt"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Thêm danh mục
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal edit */}
      <Modal
        open={!!editingCategory}
        title="Cập nhật danh mục"
        onCancel={() => setEditingCategory(null)}
        footer={null}
        destroyOnHidden
      >
        {editingCategory && (
          <CategoryFormEdit
            form={editForm}
            initialValues={editingCategory}
            onFinish={handleUpdate}
            loading={loading}
          />
        )}
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết danh mục"
        open={visibleDetail}
        onCancel={() => setVisibleDetail(false)}
        footer={null}
      >
        {detailLoading ? (
          <p>Đang tải...</p>
        ) : detailData ? (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{detailData.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">
              {detailData.slug}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detailData.status ? (
                <Tag color="green">Kích hoạt</Tag>
              ) : (
                <Tag color="red">Ngừng</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(detailData.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(detailData.updated_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Người cập nhật mới nhất">
              {detailData.updated_by_user?.full_name || "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Text type="secondary">Không có dữ liệu</Text>
        )}
      </Modal>
    </div>
  );
};

export default CategoryPage;
