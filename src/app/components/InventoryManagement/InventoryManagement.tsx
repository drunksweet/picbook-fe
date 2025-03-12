"use client";

import type React from "react";

import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Table,
  DatePicker,
  Space,
  Pagination,
  Flex,
} from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ThunderboltOutlined 
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface InventoryItem {
  key: string;
  index: number;
  bookId: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  quantity: number;
  status: "充足" | "预室" | "短暂" | "短缺";
  location: string;
  storageTime: string;
}

export default function InventoryManagement() {
  // 表单处理
  const [form] = Form.useForm();

  // 状态颜色映射
  const statusColorMap: Record<InventoryItem["status"], string> = {
    充足: "#52c41a",
    预室: "#faad14",
    短暂: "#ff7875",
    短缺: "#f5222d",
  };

  // 表格列配置
  const columns: ColumnsType<InventoryItem> = [
    { title: "序号", dataIndex: "index", align: "center" },
    { title: "绘本编号", dataIndex: "bookId", align: "center" },
    { title: "绘本名称", dataIndex: "title", align: "center" },
    { title: "作者", dataIndex: "author", align: "center" },
    { title: "出版社", dataIndex: "publisher", align: "center" },
    { title: "类别", dataIndex: "category", align: "center" },
    { title: "库存数量", dataIndex: "quantity", align: "center" },
    {
      title: "库存状态",
      dataIndex: "status",
      align: "center",
      render: (status: InventoryItem["status"]) => (
        <span style={{ color: statusColorMap[status] }}>{status}</span>
      ),
    },
    { title: "库存位置", dataIndex: "location", align: "center" },
    { title: "入库时间", dataIndex: "storageTime", align: "center" },
    {
      title: "操作",
      align: "center",
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const dataSource: InventoryItem[] = [
    // 根据图片中的数据填充，此处示例第一条
    {
      key: "1",
      index: 1,
      bookId: "20230201",
      title: "绘本1",
      author: "作者1",
      publisher: "出版社1",
      category: "儿童故事",
      quantity: 100,
      status: "充足",
      location: "A区1号架",
      storageTime: "2025-01-01",
    },
    // 其他数据...
  ];

  return (
    <div className="inventory-container" style={{ padding: 20 }}>
      <Card title="信息检索" bordered={false}>
        <Form form={form} layout="inline">
          <Form.Item label="绘本编号" name="bookId">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="绘本名称" name="title">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="绘本类别" name="category">
            <Select
              style={{ width: 120 }}
              options={[
                { value: "儿童故事", label: "儿童故事" },
                { value: "科普知识", label: "科普知识" },
              ]}
            />
          </Form.Item>
          <Form.Item label="作者" name="author">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="入库时间" name="storageTime">
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button icon={<RedoOutlined />}>重置</Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ marginLeft: 8 }}
            >
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            background: "#FACD91",
            display: "flex",
            alignItems: "center",
            boxSizing: 'border-box',
            padding: '0.5rem 1.5rem',
            gap: '10px'
          }}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            新增库存记录
          </Button>
          <Button icon={<UploadOutlined />}>批量导入</Button>
          <Button icon={<DownloadOutlined />}>导出库存报表</Button>
          <div style={{flex: 1}}></div>
          <Button icon={<ThunderboltOutlined />}>快速操作</Button>
          <Button icon={<PrinterOutlined />}>打印</Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowClassName={() => "inventory-row"}
        />

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Pagination
            total={50}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      </div>
    </div>
  );
}
