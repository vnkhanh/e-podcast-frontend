import React from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Select,
  Space,
  Button,
  Typography,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const EditAssignmentModal = ({ open, onCancel, onSubmit, form, loading }) => {
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
      title="Chỉnh sửa bài tập"
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

        <Form.Item label="Hạn nộp" name="due_date">
          <DatePicker style={{ width: "100%" }} showTime />
        </Form.Item>

        <Form.Item label="Số lần làm tối đa" name="max_attempts">
          <InputNumber min={1} max={10} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Thời gian làm (phút)" name="time_limit">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Điểm đạt" name="pass_score">
          <InputNumber min={0} max={10} step={0.5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Bảo vệ bằng mật khẩu"
          name="has_password"
          valuePropName="checked"
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
              <Form.Item noStyle name="password">
                <Input
                  placeholder="Nhập mật khẩu mới hoặc tạo tự động"
                  style={{ width: "calc(100% - 40px)" }}
                />
              </Form.Item>

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

export default EditAssignmentModal;
