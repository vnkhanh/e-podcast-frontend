import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const CategoryFormEdit = ({ initialValues, onFinish, loading }) => {
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
        label="Tên danh mục"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
      >
        <Input placeholder="Nhập tên danh mục" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryFormEdit;
