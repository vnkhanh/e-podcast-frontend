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
  Row,
  Col,
  Tag,
  Progress,
  Typography,
  Collapse,
} from "antd";
import {
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  listDocuments,
  // uploadDocument,
  getDocumentDetail,
  deleteDocument,
} from "../../../services/api_document";
import useAutoWebSocket from "../../../utils/useAutoWebSocket";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [lecturer, setLecturer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  // Debounce tìm kiếm
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
        lecturer,
        start_date: startDate,
        end_date: endDate,
      });

      setDocuments(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit, lecturer, startDate, endDate]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // === WebSocket cập nhật realtime ===
  const token = localStorage.getItem("token");
  const socketUrl = `ws://localhost:8080/ws/status?token=${token}`;

  useAutoWebSocket(socketUrl, (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    switch (data.type) {
      case "document_list_changed":
        // Khi có file mới upload hoặc bị xoá → reload toàn bộ
        fetchDocuments();
        break;

      case "document_status_update":
        // Khi trạng thái hoặc tiến trình thay đổi → cập nhật trong state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === data.document_id
              ? {
                  ...doc,
                  status: data.status,
                  progress: data.progress ?? doc.progress ?? 0,
                }
              : doc
          )
        );
        break;

      default:
        break;
    }
  });

  // === Chi tiết tài liệu ===
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

  // === Xoá tài liệu ===
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

  // === Cấu hình cột ===
  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "original_name",
      key: "original_name",
    },
    {
      title: "Loại",
      dataIndex: "file_type",
      key: "file_type",
      width: 100,
    },
    {
      title: "Kích thước",
      dataIndex: "file_size",
      key: "file_size",
      width: 100,
      render: (size) => (size ? `${(size / 1024 / 1024).toFixed(2)} MB` : "—"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const { status, progress = 0 } = record;
        let color = "default";
        if (status?.toLowerCase().includes("lỗi")) {
          color = "red"; // tất cả trạng thái có chữ "lỗi"
        } else {
          switch (status) {
            case "Đang trích xuất":
              color = "purple";
              break;
            case "Đang làm sạch":
              color = "geekblue";
              break;
            case "Đang tạo kịch bản":
              color = "blue";
              break;
            case "Đang tóm tắt":
              color = "cyan";
              break;
            case "Đang tạo audio":
            case "Đang lưu audio":
              color = "lime";
              break;
            case "Hoàn thành":
              color = "green";
              break;
            default:
              color = "default"; // fallback nếu không khớp
          }
        }

        return (
          <div style={{ minWidth: 140 }}>
            <Tag color={color}>{status}</Tag>
            {(status === "Đang trích xuất" ||
              status === "Đang tạo audio" ||
              status === "Đang lưu audio" ||
              status === "Đang tạo tóm tắt" ||
              status === "Đang tạo kịch bản" ||
              status === "Đang làm sạch" ||
              status === "Đã trích xuất") && (
              <Progress
                percent={progress}
                size="small"
                showInfo={false}
                status={status === "Lỗi" ? "exception" : "active"}
                style={{ marginTop: 4 }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "Người tạo",
            dataIndex: ["user", "full_name"],
            key: "creator",
            width: 180,
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
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => fetchDocumentDetail(record.id)}
          />

          {/*Chỉ cho phép xóa nếu status có chữ "Lỗi" */}
          {record.status?.toLowerCase().includes("lỗi") && (
            <Popconfirm
              title="Xoá tài liệu lỗi?"
              description="Bạn có chắc muốn xoá tài liệu này không?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xoá"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // === Giao diện chính ===
  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            Quản lý Tài liệu
          </Title>
          <Text type="secondary">Xem và quản lý trạng thái tài liệu</Text>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Tìm kiếm tài liệu"
          allowClear
          enterButton
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
        />

        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          onChange={(value) => setStatus(value || "")}
          style={{ width: 180 }}
        >
          <Option value="Đã tải lên">Đã tải lên</Option>
          <Option value="Đang trích xuất">Đang trích xuất</Option>
          <Option value="Đã trích xuất">Đã trích xuất</Option>
          <Option value="Đang tạo audio">Đang tạo audio</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Lỗi">Lỗi</Option>
        </Select>

        {/* Chỉ admin mới thấy ô lọc theo giảng viên */}
        {JSON.parse(localStorage.getItem("user"))?.role === "admin" && (
          <Input
            placeholder="Lọc theo giảng viên"
            allowClear
            onChange={(e) => setLecturer(e.target.value)}
            style={{ width: 200 }}
          />
        )}

        {/* Bộ lọc theo ngày */}
        <RangePicker
          format="YYYY-MM-DD"
          onChange={(dates) => {
            if (dates && dates.length === 2) {
              setStartDate(dates[0].format("YYYY-MM-DD"));
              setEndDate(dates[1].format("YYYY-MM-DD"));
            } else {
              setStartDate("");
              setEndDate("");
            }
          }}
        />

        {/* <Upload
          customRequest={async ({ file }) => {
            try {
              await uploadDocument(file);
              notification.success({
                message: "Tải lên thành công",
                description: file.name,
                placement: "topRight",
              });
              fetchDocuments();
            } catch (err) {
              console.error(err);
              notification.error({
                message: "Tải lên thất bại",
                description: file.name,
                placement: "topRight",
              });
            }
          }}
          showUploadList={false}
          accept=".pdf,.doc,.docx,.txt"
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Tải lên
          </Button>
        </Upload> */}
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
          <div style={{ textAlign: "center", padding: 20 }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
            />
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
            <Descriptions.Item label="Trạng thái">
              {detailData.status}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(detailData.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(detailData.updated_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Văn bản đã trích xuất">
              <Collapse ghost>
                <Panel header="Xem nội dung trích xuất" key="1">
                  <div
                    style={{
                      maxHeight: 300,
                      overflowY: "auto",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {detailData.extracted_text || "Chưa có dữ liệu"}
                  </div>
                </Panel>
              </Collapse>
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
