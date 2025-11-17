import React from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Upload,
  Button,
  Select,
  Space,
  Typography,
} from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const CreateAssignmentModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  subjects,
  subjectsLoading,
  chapters,
  podcasts,
  uploadProps,
  loadChapters,
  loadPodcasts,
  loading,
}) => {
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldsValue({ password });
  };

  const hasPassword = Form.useWatch("has_password", form);

  return (
    <Modal
      title="Tạo bài tập từ File"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={700}
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên bài tập"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên bài tập" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Môn học"
          name="subject_id"
          rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
        >
          <Select
            placeholder="Chọn môn học"
            loading={subjectsLoading}
            onChange={(val) => {
              form.setFieldsValue({ chapter_id: null, podcast_id: null });
              loadChapters(val);
            }}
          >
            {subjects.map((sub) => (
              <Option key={sub.id} value={sub.id}>
                {sub.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Chương"
          name="chapter_id"
          rules={[{ required: true, message: "Vui lòng chọn chương" }]}
        >
          <Select
            placeholder="Chọn chương"
            onChange={(val) => {
              form.setFieldsValue({ podcast_id: null });
              loadPodcasts(val);
            }}
            disabled={chapters.length === 0}
          >
            {chapters.map((chapter) => (
              <Option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Podcast"
          name="podcast_id"
          rules={[{ required: true, message: "Vui lòng chọn podcast" }]}
        >
          <Select placeholder="Chọn podcast" disabled={podcasts.length === 0}>
            {podcasts.map((pod) => (
              <Option key={pod.id} value={pod.id}>
                {pod.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Hạn nộp" name="due_date">
          <DatePicker style={{ width: "100%" }} showTime />
        </Form.Item>

        <Form.Item
          label="Số lần làm tối đa"
          name="max_attempts"
          initialValue={1}
        >
          <InputNumber min={1} max={10} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Thời gian làm (phút)"
          name="time_limit"
          initialValue={0}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Điểm đạt" name="pass_score" initialValue={5}>
          <InputNumber min={0} max={10} step={0.5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="File câu hỏi"
          name="file"
          rules={[{ required: true, message: "Vui lòng chọn file" }]}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Bảo vệ bằng mật khẩu"
          name="has_password"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>

        {hasPassword && (
          <Form.Item
            label="Mật khẩu bài tập"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập hoặc tạo mật khẩu" },
              { min: 4, message: "Mật khẩu phải có ít nhất 4 ký tự" },
              { max: 20, message: "Mật khẩu không được quá 20 ký tự" },
            ]}
            extra={
              <Text type="secondary">
                Sinh viên cần nhập mật khẩu này để làm bài
              </Text>
            }
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Nhập mật khẩu hoặc tạo tự động"
                style={{ width: "calc(100% - 40px)" }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={generatePassword}
                title="Tạo mật khẩu ngẫu nhiên"
              />
            </Space.Compact>
          </Form.Item>
        )}

        <Form.Item
          label="Công bố ngay"
          name="is_published"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAssignmentModal;
