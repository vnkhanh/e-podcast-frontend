import React, { useEffect, useState } from "react";
import { Space, Input, Select, Button, Table, message, Form, Modal, Switch, Popconfirm, Descriptions} from "antd";
import { listTopics, createTopic, deleteTopic, toggleTopicStatus, updateTopic, getTopicDetail } from "../../../services/api_topic"; 
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import TopicFormEdit from "./TopicFormEdit";
const { Option } = Select;

const TopicPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // Query state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "" | "true" | "false"
  const [editingTopic, setEditingTopic] = useState(null);
  const [updating, setUpdating] = useState(false);

  //Modal Chi tiết
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);

  const [editForm] = Form.useForm();
  const fetchTopics = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await listTopics({ search, status, page, limit });
      setTopics(res.data);
      setTotal(res.total);
    } catch (err) {
      message.error("Không thể tải danh sách chủ đề");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, page, limit]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);



  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createTopic({
        name: values.name,
        status: values.status, // true/false
      });
      message.success("Tạo chủ đề thành công");
      setVisible(false);
      form.resetFields();
      fetchTopics(); // gọi lại fetchTopics
    } catch (err) {
        if (err.response?.data?.error) {
          const msg = err.response.data.error;
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
        } else {
          message.error("Không thể tạo chủ đề");
        }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingTopic(record); // mở modal
  };
  // Hàm submit update
  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      await updateTopic(editingTopic.id, values.name);
      message.success("Cập nhật chủ đề thành công");
      setEditingTopic(null);
      fetchTopics();
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg) {
        // Đảm bảo modal đã mở
        if (editForm) {
          editForm.setFields([
            { name: "name", errors: [msg] }
          ]);
        } else {
          message.error(msg);
        }
      } else {
        message.error("Lỗi khi cập nhật chủ đề");
      }
    } finally {
      setUpdating(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteTopic(id);
      message.success("Đã xoá chủ đề");
      fetchTopics();
    } catch (err) {
      message.error("Không thể xoá chủ đề");
      console.error(err);
    }
  };

  const fetchTopicDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getTopicDetail(id); 
      setDetailData(data);
      setDetailVisible(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết chủ đề");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
  { 
    title: "Tên chủ đề",
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
            await toggleTopicStatus(record.id);
            message.success("Đã cập nhật trạng thái");
            fetchTopics(); // reload
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
        title="Xoá chủ đề?"
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
        onClick={() => fetchTopicDetail(record.id)}
      />
    </Space>)
  }
];


  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Quản lý Chủ đề</h1>

      <Space style={{ marginBottom: 16 }}>
        {/* Tìm kiếm */}
        <Input.Search
          placeholder="Tìm kiếm chủ đề"
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
        Thêm chủ đề
      </Button>
    </Space>

    <Table
      rowKey="id"
      columns={columns}
      dataSource={topics}
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
      open={!!editingTopic}
      title="Cập nhật chủ đề"
      onCancel={() => setEditingTopic(null)}
      footer={null}
      destroyOnHidden
    >
      {editingTopic && (
        <TopicFormEdit
          form={editForm}
          initialValues={editingTopic}
          onFinish={handleUpdate}
          loading={updating}
        />
      )}
    </Modal>

    <Modal
      title="Thêm chủ đề mới"
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên chủ đề"
          rules={[{ required: true, message: "Vui lòng nhập tên chủ đề" }]}
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

export default TopicPage;
