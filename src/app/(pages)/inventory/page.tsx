// app/inventory/page.tsx
"use client";

import React from "react";
import { Button, Table, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

// 定义库存数据类型
interface InventoryType {
  key: string;
  bookTitle: string;
  author: string;
  stock: number;
  location: string;
}

// 模拟库存数据
const mockData: InventoryType[] = [
  {
    key: "1",
    bookTitle: "猜猜我有多爱你",
    author: "山姆·麦克布雷尼",
    stock: 15,
    location: "A区-3排",
  },
  {
    key: "2",
    bookTitle: "好饿的毛毛虫",
    author: "艾瑞·卡尔",
    stock: 8,
    location: "B区-1排",
  },
  {
    key: "3",
    bookTitle: "爷爷一定有办法",
    author: "菲比·吉尔曼",
    stock: 5,
    location: "C区-2排",
  },
];

// 表格列配置
const columns: ColumnsType<InventoryType> = [
  {
    title: "绘本名称",
    dataIndex: "bookTitle",
    key: "bookTitle",
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "库存数量",
    dataIndex: "stock",
    key: "stock",
    align: "center",
  },
  {
    title: "存放位置",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>详情</a>
        <a>编辑</a>
        <a style={{ color: "red" }}>删除</a>
      </Space>
    ),
  },
];

export default function InventoryPage() {
  // 新增库存操作
  const handleAddInventory = () => {
    // 这里可以添加跳转新增页面逻辑
    alert("打开新增库存表单");
  };

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={handleAddInventory}
        style={{ float: "right", marginBottom: 16 }}
      >
        新增库存
      </Button>
      
      <Table
        columns={columns}
        dataSource={mockData}
        bordered
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}