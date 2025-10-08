import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  message,
  Upload,
  Descriptions,
  Modal,
  Popconfirm,
  Spin,
} from "antd";
import {
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  listDocuments,
  uploadDocument,
  getDocumentDetail,
  deleteDocument,
} from "../../../services/api_document";
import useAutoWebSocket from "../../../components/admin/useAutoWebSocket";

const { Option } = Select;

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listDocuments({
        search: debouncedSearch,
        status,
        page,
        limit,
      });
      setDocuments(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách tài liệu");
    }
    setLoading(false);
  }, [debouncedSearch, status, page, limit]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // WebSocket tự động kết nối lại
  const token = localStorage.getItem("token");
  const socketUrl = `ws://localhost:8080/ws/status?token=${token}`;

  useAutoWebSocket(socketUrl, (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.log("Non-JSON WS message:", event.data);
      console.error(err);
      return;
    }

    if (data.type === "document_list_changed") {
      fetchDocuments();
    }
  });

  // Upload file
  const handleUpload = async ({ file }) => {
    setUploading(true);
    const hide = message.loading("Đang tải lên...", 0);
    try {
      await uploadDocument(file);
      message.success("Upload thành công");
      // Danh sách sẽ tự reload nhờ WebSocket
    } catch (err) {
      console.error(err);
      message.error("Upload tài liệu thất bại");
    } finally {
      hide();
      setUploading(false);
    }
  };

  // Lấy chi tiết
  const fetchDocumentDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getDocumentDetail(id);
      setDetailData(data);
      setDetailVisible(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết tài liệu");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const hide = message.loading("Đang xoá...", 0);
    try {
      await deleteDocument(id);
      message.success("Đã xoá tài liệu");
      fetchDocuments();
    } catch (err) {
      message.error("Không thể xoá tài liệu");
      console.error(err);
    } finally {
      hide();
    }
  };

  const columns = [
    { title: "Tên tài liệu", dataIndex: "original_name", key: "original_name" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => fetchDocumentDetail(record.id)}
          />
          <Popconfirm
            title="Xoá tài liệu?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý tài liệu</h1>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm tài liệu"
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        />

        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          onChange={(value) => setStatus(value || "")}
          style={{ width: 160 }}
        >
          <Option value="Đã tải lên">Đã tải lên</Option>
          <Option value="Đang trích xuất">Đang trích xuất</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Lỗi">Lỗi</Option>
        </Select>

        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept=".pdf,.doc,.docx,.txt"
          disabled={uploading}
        >
          <Button type="primary" loading={uploading}>
            <UploadOutlined /> {uploading ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </Upload>
      </Space>

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={documents}
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
      </Spin>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết tài liệu"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />
          </div>
        ) : detailData ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">
              {detailData.original_name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại">
              {detailData.file_type}
            </Descriptions.Item>
            <Descriptions.Item label="Văn bản đã trích xuất">
              <div
                style={{
                  maxHeight: 200,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {detailData.extracted_text}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detailData.status}
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

export default DocumentPage;
