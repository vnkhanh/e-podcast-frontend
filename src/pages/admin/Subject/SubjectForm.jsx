import React from "react";
import { Form, Input, Button } from "antd";

const SubjectForm = ({ form, onFinish, loading }) => (
  <Form form={form} layout="vertical" onFinish={onFinish}>
    <Form.Item
      label="Tên môn học"
      name="name"
      rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
    >
      <Input placeholder="Ví dụ: Triết học Mác-Lênin" />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu
      </Button>
    </Form.Item>
  </Form>
);


export default SubjectForm;
