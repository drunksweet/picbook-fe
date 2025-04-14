import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  ConfigProvider,
} from "antd";
import type { InventoryItem } from "@/api/inventory/inventory";
import axios from "@/api/axios";

interface EditInventoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record?: InventoryItem;
}

const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  record,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  // 当记录变化时重置表单
  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        book_id: record.book_id,
        name: record.name,
        author: record.author,
        publisher: record.publisher,
        category: record.category,
        stock: record.stock,
      });
    }
  }, [visible, record, form]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // 从localStorage获取认证token
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        message.error("认证失败，请重新登录");
        return;
      }

      // 调用更新API
      const res = await axios.put(
        `/v1/book/stock/update/${record?.book_id}`,
        values,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (res.data.code === 200) {
        message.success("更新成功");
        onSuccess();
        onCancel();
      } else {
        message.error(res.data.msg || "更新失败");
      }
    } catch (error) {
      console.error("提交表单时出错:", error);
      message.error("提交表单时出错，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            // footerBg: "#F59A23",
          },
        },
      }}
    >
      <Modal
        title="编辑绘本信息"
        open={visible}
        onCancel={onCancel}
        onOk={handleSubmit}
        okText="保存"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ stock_status: "充足" }}
        >
          <Form.Item
            name="book_id"
            label="绘本编号"
            rules={[{ required: true, message: "请输入绘本编号" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="绘本名称"
            rules={[{ required: true, message: "请输入绘本名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: "请输入作者" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="publisher"
            label="出版社"
            rules={[{ required: true, message: "请输入出版社" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: "请选择类别" }]}
          >
            <Select
              // placeholder="请选择类别"
              options={[
                { value: "儿童故事", label: "儿童故事" },
                { value: "科普知识", label: "科普知识" },
                { value: "艺术启蒙", label: "艺术启蒙" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="库存数量"
            rules={[{ required: true, message: "请输入库存数量" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default EditInventoryModal;
