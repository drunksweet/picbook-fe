"use client";

import "./InventoryManagement.sass";
import { useState } from "react";

import {
  Button,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Pagination,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Spacer from "../common/Spacer/spacer";
import TangTable from "../TangTable/TangTable";

interface InventoryItem {
  key: string;
  index: number;
  bookId: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  quantity: number;
  status: "充足" | "预警" | "短缺";
  location: string;
  storageTime: string;
}

export default function InventoryManagement() {
  // 表单处理
  const [form] = Form.useForm();

  // // 分页状态
  // const [data, setData] = useState<InventoryItem[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

  // 状态颜色映射
  const statusColorMap: Record<InventoryItem["status"], string> = {
    充足: "#52c41a",
    预警: "#faad14",
    短缺: "#ff7875",
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

  // 模拟数据 - 创建更多数据来测试分页
  const generateData = () => {
    const data: InventoryItem[] = [];
    for (let i = 1; i <= 300; i++) {
      data.push({
        key: i.toString(),
        index: i,
        bookId: `2023${i.toString().padStart(4, "0")}`,
        title: `绘本${i}`,
        author: `作者${(i % 10) + 1}`,
        publisher: `出版社${(i % 5) + 1}`,
        category: i % 2 === 0 ? "儿童故事" : "科普知识",
        quantity: Math.floor(Math.random() * 200) + 1,
        status: i % 3 === 0 ? "充足" : i % 3 === 1 ? "预警" : "短缺",
        location: `${String.fromCharCode(65 + (i % 5))}区${(i % 10) + 1}号架`,
        storageTime: `2025-${(i % 12) + 1}-${(i % 28) + 1}`,
      });
    }
    return data;
  };

  const dataSource = generateData();

  // // 计算当前页的数据
  // const currentData = dataSource.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );

  // // Handle pagination change
  // const handlePageChange = (page: number, size: number) => {
  //   // console.log(`Page changed to ${page}, size changed to ${size}`);
  //   setCurrentPage(page);
  //   setPageSize(size);
  // };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F59A23",
          colorLink: "#F59A23",
        },
      }}
    >
      <div className="inventory-container" style={{ paddingTop: "10px" }}>
        <Card title="信息检索" bordered={false}>
          <Form form={form} layout="inline">
            <Space size={"large"}>
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
            </Space>

            <Form.Item style={{ marginLeft: "auto" }}>
              <Space size={"large"}>
                <Button type="primary" icon={<RedoOutlined />}>
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ marginLeft: 8 }}
                >
                  搜索
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <div className="main-container">
          {/* button block */}
          <div style={{ padding: 10 }}>
            <div className="btn-container">
              <Button type="primary" icon={<PlusOutlined />}>
                新增库存记录
              </Button>
              <Button type="primary" icon={<UploadOutlined />}>
                批量导入
              </Button>
              <Button type="primary" icon={<DownloadOutlined />}>
                导出库存报表
              </Button>
              <Spacer />
              <Button type="primary" icon={<ThunderboltOutlined />}>
                快速操作
              </Button>
              <Button type="primary" icon={<PrinterOutlined />}>
                打印
              </Button>
            </div>
          </div>

          <div className="table-container">
            <TangTable
              columns={columns}
              // dataSource={currentData}
              dataSource={dataSource}
              // currentPage={currentPage}
              total = {dataSource.length}
              // pageSize={pageSize}
              // onPageChange={handlePageChange}
              scroll={{ y: 500 }}
            />

            {/* <div
              className="pagination"
              style={{ marginTop: 0, padding: "10px 16px" }}
            >
              <Pagination
                align="center"
                current={currentPage}
                defaultCurrent={1}
                pageSize={pageSize}
                total={dataSource.length}
                showSizeChanger
                showQuickJumper
                size="small"
                showTotal={(total) => `共 ${total} 条`}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  if (size) setPageSize(size);
                }}
                onShowSizeChange={(current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                }}
              />
            </div> */}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
