import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const TopicFormEdit = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ name: initialValues.name });
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => onFinish(values)}
      autoComplete="off"
    >
      <Form.Item
        label="Tên chủ đề"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên chủ đề" }]}
      >
        <Input placeholder="Nhập tên chủ đề" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TopicFormEdit;
