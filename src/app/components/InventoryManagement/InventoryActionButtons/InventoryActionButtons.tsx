"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, Select, InputNumber, App } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Spacer from "../../common/spacer/spacer";
import axiosInstance from "src/api/axios";
import "./InventoryActionButtons.scss";

interface InventoryActionButtonsProps {
  onInventoryAdded?: () => void;
}

interface InventoryFormData {
  book_id: string;
  name: string;
  author: string;
  publisher: string;
  category: string;
  quantity_added: number;
}

interface RequestBody {
  author: string;
  category: string;
  name: string;
  publisher: string;
  quantity_added: number;
  user_id?: number;
}

export default function InventoryActionButtons({
  onInventoryAdded,
}: InventoryActionButtonsProps) {
  const { message } = App.useApp();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 打开新增库存记录模态框
  const showAddModal = () => {
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      // 验证表单字段
      const formValues = (await form.validateFields()) as InventoryFormData;
      setLoading(true);

      // 从localStorage获取认证token
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        message.error("认证失败，请重新登录");
        return {
          success: false,
          error: "认证失败",
          needLogin: true,
        };
      }

      const requestBody: RequestBody = {
        author: formValues.author,
        category: formValues.category,
        name: formValues.name,
        publisher: formValues.publisher,
        quantity_added: formValues.quantity_added,
      }

      // 发送请求添加库存记录
      const response = await axiosInstance.post("/v1/book/stock/add", requestBody, {
        headers: {
          Authorization: authToken,
        },
      });

      if (response.data.code === 0) {
        message.success("添加库存记录成功");
        setIsModalVisible(false);
        form.resetFields();

        // 通知父组件刷新数据
        if (onInventoryAdded) {
          onInventoryAdded();
        }
      } else {
        message.error(response.data.msg || "添加库存记录失败");
      }
    } catch (error) {
      console.error("添加库存记录失败:", error);
      message.error("添加库存记录失败，请检查表单填写是否正确");
    } finally {
      setLoading(false);
    }
  };

  // 批量导入功能
  const handleBatchImport = () => {
    message.info("批量导入功能开发中...");
  };

  // 导出库存报表功能
  const handleExportReport = () => {
    message.info("导出库存报表功能开发中...");
  };

  // 快速操作功能
  const handleQuickAction = () => {
    message.info("快速操作功能开发中...");
  };

  // 打印功能
  const handlePrint = () => {
    message.info("打印功能开发中...");
  };

  return (
    <div style={{ padding: 10 }}>
      <div className="btn-container">
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新增库存记录
        </Button>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleBatchImport}
        >
          批量导入
        </Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportReport}
        >
          导出库存报表
        </Button>
        <Spacer />
        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          onClick={handleQuickAction}
        >
          快速操作
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          打印
        </Button>
      </div>

      {/* 新增库存记录模态框 */}
      <Modal
        title="新增库存记录"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            提交
          </Button>,
        ]}
        maskClosable={false}
        width={500}
      >
        <Form form={form} layout="vertical" initialValues={{ stock: 1 }}>
          <Form.Item
            name="name"
            label="绘本名称"
            rules={[{ required: true, message: "请输入绘本名称" }]}
          >
            <Input placeholder="请输入绘本名称" />
          </Form.Item>

          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: "请输入作者" }]}
          >
            <Input placeholder="请输入作者" />
          </Form.Item>

          <Form.Item
            name="publisher"
            label="出版社"
            rules={[{ required: true, message: "请输入出版社" }]}
          >
            <Input placeholder="请输入出版社" />
          </Form.Item>

          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: "请选择类别" }]}
          >
            <Select
              placeholder="请选择类别"
              options={[
                { value: "children_story", label: "儿童故事" },
                { value: "science_knowledge", label: "科普知识" },
                { value: "art_enlightenment", label: "艺术启蒙" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="quantity_added"
            label="添加库存"
            rules={[{ required: true, message: "请输入库存数量" }]}
          >
            <InputNumber
              min={1}
              placeholder="请输入添加的库存数量"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
