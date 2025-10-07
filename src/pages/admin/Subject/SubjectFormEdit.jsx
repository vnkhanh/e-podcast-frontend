import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const SubjectFormEdit = ({ initialValues, onFinish, loading }) => {
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
        label="Tên môn học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
      >
        <Input placeholder="Nhập tên môn học" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubjectFormEdit;
