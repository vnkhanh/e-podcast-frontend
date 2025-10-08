import React, { useEffect, useState } from "react";
import { Space, Input, Select, Button, Table, message, Form, Modal, Switch, Popconfirm, Descriptions} from "antd";
import { listCategories, createCategory, deleteCategory, toggleCategoryStatus, updateCategory, getCategoryDetail } from "../../../services/api_category"; 
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import CategoryFormEdit from "./CategoryFormEdit";
const { Option } = Select;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // Query state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "" | "true" | "false"
  const [editingCategory, setEditingCategory] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCategories({
        search,           // key phải đúng với BE
        status,
        page,
        limit,
      });
      setCategories(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách danh mục");
    }
    setLoading(false);
  }, [search, status, page, limit]);

  useEffect(() => {
    fetchCategories();
  }, [search, status, page, limit, fetchCategories]);


  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createCategory({
        name: values.name,
        status: values.status, // true/false
      });
      message.success("Tạo danh mục thành công");
      setVisible(false);
      form.resetFields();
      fetchCategories(); // gọi lại danh sách
    } catch (err) {
      if (err.response?.data?.error) {
        const msg = err.response.data.error;
        // Nếu lỗi trùng tên/slugs, hiển thị dưới input
        if (msg.includes("tồn tại")) {
          form.setFields([
            {
              name: "name",
              errors: [msg],
            },
          ]);
        } else {
          message.error(msg);
        }
      } else if (err.errorFields) {
        // lỗi validate form, AntD sẽ tự hiển thị
      } else {
        message.error("Không thể tạo danh mục");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (record) => {
    setEditingCategory(record); // mở modal
  };
  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      await updateCategory(editingCategory.id, values.name);
      message.success("Cập nhật danh mục thành công");
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg?.includes("tồn tại")) {
        // Hiển thị lỗi dưới input
        form.setFields([
          {
            name: "name",
            errors: [msg],
          },
        ]);
      } else {
        message.error(msg || "Lỗi khi cập nhật danh mục");
      }
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };


  const fetchCategoryDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getCategoryDetail(id); 
      setDetailData(data);
      setDetailVisible(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết danh mục");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };


const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Đã xoá danh mục");
      fetchCategories();
    } catch (err) {
      message.error("Không thể xoá danh mục");
      console.error(err);
    }
  };

  const columns = [
  { 
    title: "Tên danh mục",
    dataIndex: "name",
    key: "name",
    sorter: (a,b) => a.name.localeCompare(b.name),
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
            fetchCategories(); // reload
          } catch {
            message.error("Cập nhật trạng thái thất bại");
          }
        }}
      />
    )
  },
  { 
    title: "Ngày tạo",
    dataIndex: "created_at",       
    key: "created_at",
    sorter: (a,b) => new Date(a.created_at) - new Date(b.created_at),
    render: (text) => new Date(text).toLocaleString(),
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => 
    (<Space>
      <Popconfirm
        title="Xoá danh mục?"
        onConfirm={() => {record.id && handleDelete(record.id)}}
        okText="Xoá"
        cancelText="Hủy"
     >
        <Button danger icon={<DeleteOutlined />} />
      </Popconfirm>

      <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}></Button>
      
      <Button
        icon={<EyeOutlined />}
        type="primary"
        onClick={() => fetchCategoryDetail(record.id)}
        />
    </Space>)
  }
];


  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Quản lý Danh mục</h1>

      <Space style={{ marginBottom: 16 }}>
        {/* Tìm kiếm */}
        <Input.Search
          placeholder="Tìm kiếm danh mục"
          allowClear
          onSearch={(val) => {
            setSearch(val);
            setPage(1); // reset về trang 1
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset về trang 1
          }}
        />

        {/* Lọc trạng thái */}
        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          onChange={(value) => {
            setStatus(value || "");
            setPage(1);
          }}
          style={{ width: 160 }}
        >
          <Option value="true">Kích hoạt</Option>
          <Option value="false">Ngừng</Option>
        </Select>

      <Button type="primary" onClick={() => setVisible(true)}>
        Thêm danh mục
      </Button>
    </Space>

    <Table
      rowKey="id"
      columns={columns}
      dataSource={categories}
      loading={loading}
      rowClassName={(record) => (record.status ? "row-active" : "row-inactive")}
      onRow={(record) => ({
        style: {
          backgroundColor: record.status ? "#c7f5edff" : "#ffd0cdff", // xanh / đỏ
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
    <Modal
      open={!!editingCategory}
      title="Cập nhật danh mục"
      onCancel={() => setEditingCategory(null)}
      footer={null}
      destroyOnHidden
    >
      {editingCategory && (
        <CategoryFormEdit
          form={form}
          initialValues={editingCategory}
          onFinish={handleUpdate}
          loading={updating}
        />
      )}
    </Modal>

   <Modal
      title="Thêm danh mục mới"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null} // tắt footer để dùng nút submit trong Form
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOk} // submit sẽ gọi handleOk
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


    <Modal
        title="Chi tiết danh mục"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        >
        {detailLoading ? (
            <p>Đang tải...</p>
        ) : detailData ? (
            <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{detailData.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">{detailData.slug}</Descriptions.Item>
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

export default CategoryPage;
