import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Card,
  Modal,
  Space,
  notification,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  getPodcastDetail,
  updatePodcast,
  listSubjects,
  listCategories,
  listTags,
  createChapter,
  listChaptersBySubject,
} from "../../../services/api_podcast";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const EditPodcast = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // podcast id
  const [form] = Form.useForm();

  const [coverImage, setCoverImage] = useState(null);
  const [podcast, setPodcast] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);

  // ======= LOAD DỮ LIỆU BAN ĐẦU =======
  useEffect(() => {
    (async () => {
      try {
        const [sub, cat, tg] = await Promise.all([
          listSubjects(),
          listCategories(),
          listTags(),
        ]);
        setSubjects(sub);
        setCategories(cat);
        setTags(tg);
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
        message.error("Không thể tải dữ liệu ban đầu");
      }
    })();
  }, []);

  // ======= LẤY CHI TIẾT PODCAST =======
  useEffect(() => {
    (async () => {
      try {
        const data = await getPodcastDetail(id);
        setPodcast(data);
        form.setFieldsValue({
          title: data.title,
          description: data.description,
          summary: data.summary,
          subject_id: data.chapter?.subject?.id,
          chapter_id: data.chapter?.id,
          category_ids: data.categories?.map((c) => c.id),
          tags_combined: data.tags?.map((t) => t.id),
          status: data.status,
        });

        if (data.chapter?.subject?.id) {
          setSelectedSubject(data.chapter.subject.id);
          fetchChapters(data.chapter.subject.id);
        }
      } catch (err) {
        console.error(err);
        message.error("Không thể tải thông tin podcast");
      }
    })();
  }, [id, form]);

  // ======= LẤY DANH SÁCH CHƯƠNG =======
  const fetchChapters = async (subjectId) => {
    if (!subjectId) return;
    try {
      const data = await listChaptersBySubject(subjectId);
      setChapters(data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách chương");
    }
  };

  // ======= TẠO CHƯƠNG MỚI =======
  const handleCreateChapter = async (values) => {
    try {
      const res = await createChapter({
        subject_id: selectedSubject,
        title: values.chapterTitle,
      });
      message.success("Tạo chương thành công");
      setShowCreateChapterModal(false);
      fetchChapters(selectedSubject);
      form.setFieldsValue({ chapter_id: res.chapter.id });
    } catch (err) {
      console.error(err);
      message.error("Tạo chương thất bại");
    }
  };

  // ======= GỬI FORM CẬP NHẬT =======
  const onFinish = async (values) => {
    console.log("Dữ liệu form cập nhật:", values);

    const formData = new FormData();
    if (coverImage) formData.append("cover_image", coverImage);

    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("subject_id", values.subject_id || "");
    formData.append("status", values.status || "");
    formData.append("summary", values.summary || "");

    // Chương
    if (values.chapter_id) {
      formData.append("chapter_id", values.chapter_id);
    } else if (values.subject_id && values.chapter_title) {
      formData.append("subject_id", values.subject_id);
      formData.append("chapter_title", values.chapter_title);
    }
    // Danh mục
    (values.category_ids || []).forEach((id) =>
      formData.append("category_ids[]", id)
    );

    // Tags
    if (values.tags_combined?.length) {
      const existingTagIds = [];
      const newTagNames = [];

      values.tags_combined.forEach((t) => {
        const isExisting = tags.find((tag) => tag.id === t);
        if (isExisting) existingTagIds.push(t);
        else newTagNames.push(t);
      });

      existingTagIds.forEach((id) => formData.append("tag_ids[]", id));
      newTagNames.forEach((name) => formData.append("tag_names[]", name));
    }

    // === GỬI LÊN BACKEND ===
    try {
      await updatePodcast(id, formData);
      notification.success({
        message: "Cập nhật thành công",
        description: "Podcast: " + values.title,
        placement: "topRight",
        duration: 2.5,
        pauseOnHover: true,
        showProgress: true,
      });

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        navigate("/admin/podcast");
      } else if (user?.role === "teacher") {
        navigate("/teacher/podcast");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Cập nhật thất bại",
        description: err?.response?.data?.error || "Lỗi không xác định",
      });
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>

      <Card
        title="Cập nhật Podcast"
        style={{ maxWidth: 700, margin: "40px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Tiêu đề */}
          <Form.Item
            name="title"
            label="Tên podcast"
            rules={[{ required: true, message: "Nhập tên podcast" }]}
          >
            <Input placeholder="Tên podcast" />
          </Form.Item>

          {/* Trạng thái */}
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="published">Xuất bản</Option>
              <Option value="draft">Bản nháp</Option>
            </Select>
          </Form.Item>
          {/* Môn học */}
          <Form.Item
            name="subject_id"
            label="Môn học"
            rules={[{ required: true, message: "Chọn môn học" }]}
          >
            <Select
              placeholder="Chọn môn học"
              onChange={(value) => {
                setSelectedSubject(value);
                fetchChapters(value);
                form.setFieldsValue({ chapter_id: null });
              }}
            >
              {subjects.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Chương */}
          <Form.Item label="Chương">
            <Space align="start">
              <Form.Item name="chapter_id" noStyle>
                <Select
                  style={{ width: 300 }}
                  placeholder="Chọn chương (nếu có)"
                  options={chapters.map((c) => ({
                    label: c.title,
                    value: c.id,
                  }))}
                />
              </Form.Item>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateChapterModal(true)}
              >
                Tạo chương mới
              </Button>
            </Space>
          </Form.Item>

          {/* Modal tạo chương */}
          <Modal
            title="Tạo chương mới"
            open={showCreateChapterModal}
            onCancel={() => setShowCreateChapterModal(false)}
            footer={null}
          >
            <Form layout="vertical" onFinish={handleCreateChapter}>
              <Form.Item
                name="chapterTitle"
                label="Tên chương"
                rules={[{ required: true, message: "Nhập tên chương" }]}
              >
                <Input placeholder="VD: Chương 1 - Mở đầu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Tạo chương
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={5} placeholder="Mô tả nội dung podcast" />
          </Form.Item>
          <Form.Item name="summary" label="Tóm tắt">
            <Input.TextArea rows={5} placeholder="Tóm tắt nội dung podcast" />
          </Form.Item>
          {/* Ảnh bìa (tùy chọn) */}
          <Form.Item label="Ảnh bìa mới (tuỳ chọn)">
            {podcast?.cover_image && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={podcast.cover_image}
                  alt="Ảnh hiện tại"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    objectFit: "cover",
                    maxHeight: 200,
                  }}
                />
              </div>
            )}

            <Upload
              beforeUpload={(f) => {
                setCoverImage(f);
                return false; // chặn upload tự động
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="category_ids" label="Danh mục">
            <Select mode="multiple" placeholder="Chọn danh mục">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/*Thẻ tag*/}
          <Form.Item name="tags_combined" label="Thẻ tag">
            <Select
              mode="tags"
              placeholder="Tag cách nhau bởi dấu phẩy"
              tokenSeparators={[","]}
              options={tags.map((t) => ({ label: t.name, value: t.id }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật Podcast
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditPodcast;
