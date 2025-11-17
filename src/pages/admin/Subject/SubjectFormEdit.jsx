import React, { useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { PlusOutlined, DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import { checkChapterDeletable } from "../../../services/api_subject";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ field, remove, form }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 12,
  };

  const handleRemoveChapter = async () => {
    const id = form.getFieldValue(["chapters", field.name, "id"]);
    if (id) {
      try {
        const data = await checkChapterDeletable(id);
        if (!data.can_delete) {
          message.error(
            data.message || "Chương này có podcast, không thể xóa."
          );
          return;
        }
      } catch (err) {
        message.error("Không thể kiểm tra trạng thái chương");
        console.log(err);
        return;
      }
    }
    remove(field.name);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      size="small"
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MenuOutlined
            style={{ cursor: "grab", color: "#999" }}
            {...listeners} // chỉ đặt listeners trên icon
          />
          Chương {field.name + 1}
        </span>
      }
      extra={
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={handleRemoveChapter}
        />
      }
      {...attributes}
    >
      <Form.Item name={[field.name, "id"]} hidden>
        <Input />
      </Form.Item>
      <Form.Item name={[field.name, "sort_order"]} hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name={[field.name, "title"]}
        label="Tiêu đề chương"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề chương" }]}
      >
        <Input placeholder="Nhập tiêu đề chương" />
      </Form.Item>
    </Card>
  );
};
const SubjectFormEdit = ({ form, initialValues, onFinish, loading }) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        course_code: initialValues.course_code,
        chapters:
          initialValues.chapters?.map((ch) => ({
            id: ch.id,
            title: ch.title,
            sort_order: ch.sort_order,
          })) || [],
      });
    }
  }, [initialValues, form]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleFinish = (values) => {
    // kiểm tra thứ tự không trùng
    const orders = new Set();
    for (let ch of values.chapters) {
      if (orders.has(Number(ch.sort_order))) {
        message.error("Thứ tự chương bị trùng, vui lòng sửa lại");
        return;
      }
      orders.add(Number(ch.sort_order));
    }
    onFinish(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
      style={{ maxWidth: 700 }}
    >
      <Form.Item
        label="Tên môn học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
      >
        <Input placeholder="Nhập tên môn học" />
      </Form.Item>
      <Form.Item
        label="Mã môn học"
        name="course_code"
        rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}
      >
        <Input placeholder="Nhập mã môn học" />
      </Form.Item>
      <Form.List name="chapters">
        {(fields, { add, remove }) => {
          const handleDragEnd = (event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = fields.findIndex((f) => f.key === active.id);
            const newIndex = fields.findIndex((f) => f.key === over.id);

            const newFields = arrayMove(fields, oldIndex, newIndex);

            // cập nhật sort_order tự động
            form.setFieldsValue({
              chapters: newFields.map((f, i) => ({
                ...form.getFieldValue(["chapters", f.name]),
                sort_order: i + 1,
              })),
            });
          };

          return (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <strong>Danh sách chương</strong>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({ title: "", sort_order: fields.length + 1 })
                  }
                  icon={<PlusOutlined />}
                >
                  Thêm chương
                </Button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map((f) => f.key)}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field) => (
                    <SortableItem
                      key={field.key}
                      field={field}
                      remove={remove}
                      form={form}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          );
        }}
      </Form.List>

      <Form.Item style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Cập nhật môn học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubjectFormEdit;
