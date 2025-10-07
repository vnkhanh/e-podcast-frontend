import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select, message, Card, Slider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  uploadPodcast,
  listSubjects,
  listCategories,
  listTopics,
  listTags,
} from "../../../services/api_podcast";
import { useNavigate } from "react-router-dom";



const { Option } = Select;

const CreatePodcastUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

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

const onFinish = async (values) => {
  if (!file) return message.warning("Vui lòng chọn file tài liệu");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("subject_id", values.subject_id);
  formData.append("chapter_title", values.chapter_title);

  if (coverImage) formData.append("cover_image", coverImage);
  if (values.voice) formData.append("voice", values.voice);
  formData.append("speaking_rate", values.speaking_rate || 1.0);

  (values.category_ids || []).forEach((id) => formData.append("category_ids[]", id));
  (values.topic_ids || []).forEach((id) => formData.append("topic_ids[]", id));
  (values.tag_ids || []).forEach((id) => formData.append("tag_ids[]", id));
  (values.tag_names || []).forEach((name) => formData.append("tag_names[]", name));

  try {
    setLoading(true);

    // 🔹 Gọi upload mà không chờ kết quả
    uploadPodcast(formData)
      .then((res) => {
        console.log("Upload xong:", res);
        message.success(`Tải lên thành công: ${res?.podcast?.title || ""}`);
      })
      .catch((err) => {
        console.error("Lỗi upload:", err);
        message.error("Tải lên thất bại");
      });

    // 🔹 Ngay lập tức chuyển trang
    navigate("/admin/document");
  } catch (err) {
    console.error(err);
    message.error("Lỗi khi tải lên");
  } finally {
    setLoading(false);
  }
};


  return (
    <Card title="Tạo Podcast từ tài liệu" style={{ maxWidth: 700, margin: "40px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="subject_id" label="Môn học" rules={[{ required: true }]}>
          <Select placeholder="Chọn môn học">
            {subjects.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="chapter_title" label="Tên chương" rules={[{ required: true }]}>
          <Input placeholder="VD: Chương 1 - Mở đầu" />
        </Form.Item>

        <Form.Item name="title" label="Tên podcast" rules={[{ required: true }]}>
          <Input placeholder="Tên podcast" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả nội dung podcast" />
        </Form.Item>

        <Form.Item label="Tài liệu (PDF)">
          <Upload beforeUpload={(f) => { setFile(f); return false; }} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Ảnh bìa (tuỳ chọn)">
          <Upload beforeUpload={(f) => { setCoverImage(f); return false; }} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="voice" label="Giọng đọc">
          <Select defaultValue="vi-VN-Chirp3-HD-Puck">
            <Option value="vi-VN-Chirp3-HD-Puck">Puck (Nam)</Option>
            <Option value="vi-VN-Chirp3-HD-Luna">Luna (Nữ)</Option>
            <Option value="vi-VN-Chirp3-HD-Lam">Lam (Nam, trẻ)</Option>
          </Select>
        </Form.Item>

        <Form.Item name="speaking_rate" label="Tốc độ đọc">
          <Slider min={0.5} max={2.0} step={0.1} defaultValue={1.0} />
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

        <Form.Item name="topic_ids" label="Chủ đề">
          <Select mode="multiple" placeholder="Chọn chủ đề">
            {topics.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tag_ids" label="Thẻ (tag) có sẵn">
          <Select mode="multiple" placeholder="Chọn tag">
            {tags.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tag_names" label="Thẻ mới (tạo thêm)">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập tag mới (Enter để thêm)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tải lên Podcast
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreatePodcastUpload;
