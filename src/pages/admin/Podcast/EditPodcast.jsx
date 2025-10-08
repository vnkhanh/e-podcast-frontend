import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { getPodcastDetail, updatePodcast } from "../../../services/api_podcast";

const EditPodcast = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPodcastDetail(id);
        form.setFieldsValue(res);
      } catch (err) {
        message.error("Không thể tải thông tin podcast");
        console.error(err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, form, navigate]);

  const handleSubmit = async (values) => {
    try {
      await updatePodcast(id, values);
      message.success("Cập nhật podcast thành công");
      navigate("/teacher/podcast");
    } catch (err) {
      message.error("Lỗi khi cập nhật podcast");
        console.error(err);
    }
  };

  if (loading) return <Spin />;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Chỉnh sửa podcast</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Ảnh bìa (URL)" name="cover_image">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPodcast;
