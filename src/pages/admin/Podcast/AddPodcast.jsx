import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Card,
  Slider,
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
  uploadPodcast,
  listSubjects,
  listCategories,
  listTopics,
  listTags,
  createChapter,
  listChaptersBySubject,
} from "../../../services/api_podcast";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreatePodcastUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [form] = Form.useForm();

  // ======= LOAD DỮ LIỆU BAN ĐẦU =======
  useEffect(() => {
    (async () => {
      try {
        const [sub, cat, top, tg] = await Promise.all([
          listSubjects(),
          listCategories(),
          listTopics(),
          listTags(),
        ]);
        setSubjects(sub);
        setCategories(cat);
        setTopics(top);
        setTags(tg);
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
        message.error("Không thể tải dữ liệu ban đầu");
      }
    })();
  }, []);

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

  // ======= GỬI FORM =======
  const onFinish = async (values) => {
    console.log("Dữ liệu form nhận từ AntD:", values);

    if (!file) return message.warning("Vui lòng chọn file tài liệu");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("subject_id", values.subject_id);

    // Xử lý chương học
    if (values.chapter_id) {
      console.log("Chọn chương có sẵn:", values.chapter_id);
      formData.append("chapter_id", values.chapter_id);
    } else if (values.subject_id && values.chapter_title) {
      console.log("Tạo chương mới:", values.chapter_title);
      formData.append("subject_id", values.subject_id);
      formData.append("chapter_title", values.chapter_title);
    } else {
      message.warning("Vui lòng chọn hoặc nhập chương học hợp lệ");
      return;
    }

    // Ảnh bìa (nếu có)
    if (coverImage) {
      console.log("Ảnh bìa:", coverImage.name);
      formData.append("cover_image", coverImage);
    }

    // Giọng đọc và tốc độ
    const voice = values.voice || "vi-VN-Chirp3-HD-Puck";
    const speakingRate = values.speaking_rate ?? 1.0;

    console.log("Giọng đọc:", voice, "Tốc độ:", speakingRate);

    formData.append("voice", voice);
    formData.append("speaking_rate", speakingRate.toString());

    // Danh mục
    (values.category_ids || []).forEach((id) =>
      formData.append("category_ids[]", id)
    );

    // Chủ đề
    (values.topic_ids || []).forEach((id) =>
      formData.append("topic_ids[]", id)
    );

    // Tag (id cũ và tag mới)
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

    // DEBUG: In toàn bộ FormData gửi lên
    console.log("Dữ liệu FormData chuẩn bị gửi lên backend:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // ====== GỬI LÊN BACKEND ======
    try {
      // Không cần chờ server xử lý toàn bộ
      uploadPodcast(formData)
        .then(() => {
          notification.success({
            message: "Tải lên thành công",
            description: "Podcast: " + values.title,
            placement: "topRight",
            duration: 2.5,
            pauseOnHover: true,
            showProgress: true,
          });
        })
        .catch((err) => {
          console.error(err);
          notification.error({
            message: "Tải lên thất bại",
            description: "Podcast: " + values.title,
            placement: "topRight",
            duration: 2.5,
            pauseOnHover: true,
            showProgress: true,
          });
        });
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        navigate("/admin/document");
      } else if (user?.role === "teacher") {
        navigate("/teacher/document");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      message.error("Lỗi gửi yêu cầu upload");
      console.error("Lỗi upload podcast:", err);
    }
  };

  // ======= GIAO DIỆN =======
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
        title="Tạo Podcast từ tài liệu"
        style={{ maxWidth: 700, margin: "40px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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

          {/* Tên podcast */}
          <Form.Item
            name="title"
            label="Tên podcast"
            rules={[{ required: true, message: "Nhập tên podcast" }]}
          >
            <Input placeholder="Tên podcast" />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả nội dung podcast" />
          </Form.Item>

          {/* File tài liệu */}
          <Form.Item
            label="Tài liệu (PDF, DOCX, TXT) nhỏ hơn 10MB"
            rules={[{ required: true, message: "Chọn file tài liệu" }]}
          >
            <Upload
              beforeUpload={(f) => {
                setFile(f);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>

          {/* Ảnh bìa */}
          <Form.Item label="Ảnh bìa (tuỳ chọn)">
            <Upload
              beforeUpload={(f) => {
                setCoverImage(f);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {/* Giọng đọc */}
          <Form.Item name="voice" label="Giọng đọc">
            <Select>
              {/* <Option value="vi-VN-Chirp3-HD-Puck">Nam</Option> */}
              <Option value="vi-VN-Standard-A">Nữ (Standard A)</Option>
              <Option value="vi-VN-Standard-B">Nam (Standard B)</Option>
              <Option value="vi-VN-Standard-C">Nữ (Standard C)</Option>
              <Option value="vi-VN-Standard-D">Nam (Standard D)</Option>
              <Option value="vi-VN-Chirp3-HD-Iapetus">Nam (Iapetus)</Option>
              <Option value="vi-VN-Chirp3-HD-Leda">Nữ (Leda)</Option>
            </Select>
          </Form.Item>

          {/* Tốc độ đọc */}
          <Form.Item name="speaking_rate" label="Tốc độ đọc" initialValue={1.0}>
            <Slider min={0.5} max={2.0} step={0.1} />
          </Form.Item>

          {/* Danh mục */}
          <Form.Item
            name="category_ids"
            label="Danh mục"
            rules={[{ required: true, message: "Chọn ít nhất 1 danh mục" }]}
          >
            <Select mode="multiple" placeholder="Chọn danh mục">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Chủ đề */}
          <Form.Item
            name="topic_ids"
            label="Chủ đề"
            rules={[{ required: true, message: "Chọn ít nhất 1 chủ đề" }]}
          >
            <Select mode="multiple" placeholder="Chọn chủ đề">
              {topics.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Tags */}
          <Form.Item name="tags_combined" label="Thẻ tag (chọn hoặc tạo mới)">
            <Select
              mode="tags"
              placeholder="Tag cách nhau bởi dấu phẩy"
              tokenSeparators={[","]}
              style={{ width: "100%" }}
              options={tags.map((t) => ({ label: t.name, value: t.id }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tải lên Podcast
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePodcastUpload;
