"use client";

import "./InventoryManagement.sass";
import { useState, useEffect } from "react";
import { App } from "antd";
import { useRouter } from "next/navigation";

import {
  Tag,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TangTable from "../TangTable/TangTable";
import InventoryActionButtons from "./InventoryActionButtons/InventoryActionButtons";
import EditInventoryModal from "./EditInventoryModal/EditInventoryModal";
import {
  fetchInventoryData,
  generateMockData,
  deleteInventoryItem,
  type InventoryItem,
  type SearchParams,
} from "@/api/inventory/inventory";

export default function InventoryManagement() {
  const { message, modal } = App.useApp();
  // 表单处理
  const [form] = Form.useForm();

  // 分页状态
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [useMock, setUseMock] = useState<boolean>(false);
  const router = useRouter();

  // 编辑模态框状态
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<InventoryItem | undefined>(
    undefined
  );

  // 状态中英映射
  const statusEtoCMap: Record<InventoryItem["stock_status"], string> = {
    adequate: "充足",
    early_warning: "预警",
    shortage: "短缺",
  };

  const categoryEToCMap: Record<InventoryItem["category"], string> = {
    children_story: "儿童故事",
    science_knowledge: "科普知识",
    art_enlightenment: "艺术启蒙",
  };

  // 状态颜色映射
  const statusColorMap: Record<InventoryItem["stock_status"], string> = {
    adequate: "green",
    early_warning: "orange",
    shortage: "red",
  };

  // 表格列配置
  const columns: ColumnsType<InventoryItem> = [
    { title: "序号", dataIndex: "index", align: "center" },
    { title: "绘本编号", dataIndex: "book_id", align: "center" },
    { title: "绘本名称", dataIndex: "name", align: "center" },
    { title: "作者", dataIndex: "author", align: "center" },
    { title: "出版社", dataIndex: "publisher", align: "center" },
    {
      title: "类别",
      dataIndex: "category",
      align: "center",
      render: (category: InventoryItem["category"]) => (
        <Tag>{categoryEToCMap[category]}</Tag>
      ),
    },
    { title: "库存数量", dataIndex: "stock", align: "center" },
    {
      title: "库存状态",
      dataIndex: "stock_status",
      align: "center",
      render: (stock_status: InventoryItem["stock_status"]) => (
        <Tag color={statusColorMap[stock_status]}>
          {statusEtoCMap[stock_status]}
        </Tag>
      ),
    },
    { title: "入库时间", dataIndex: "created_at", align: "center" },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 获取库存数据
  const getInventoryData = async (params: SearchParams) => {
    setLoading(true);

    // 确保params中包含page和page_size
    const requestParams: SearchParams = {
      ...params,
      page: params.page || currentPage,
      page_size: params.page_size || pageSize,
    };

    try {
      const result = await fetchInventoryData(requestParams);

      if (result.success) {
        setData(result.data!.items);
        setCurrentPage(result.data!.currentPage);
        setTotalPages(result.data!.totalPages);
        setTotal(result.data!.total);
        setUseMock(false);
      } else {
        message.error(result.error);

        // 如果API返回错误，使用模拟数据
        const mockData = generateMockData(pageSize);
        setData(mockData.items);
        setTotalPages(mockData.totalPages);
        setTotal(mockData.total);
        setCurrentPage(params.page);
        setUseMock(true);
      }
    } catch (error) {
      console.error("获取库存数据失败:", error);
      message.error("获取库存数据失败，请稍后重试");

      // 使用模拟数据
      const mockData = generateMockData(pageSize);
      setData(mockData.items);
      setTotalPages(mockData.totalPages);
      setTotal(mockData.total);
      setCurrentPage(params.page);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    getInventoryData({
      page: currentPage,
      page_size: pageSize,
    });
  }, []);

  // 处理分页变化
  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize;
    setCurrentPage(page);
    if (size) setPageSize(size);

    // 获取表单当前值
    const formValues = form.getFieldsValue();

    // 构建查询参数
    const params: SearchParams = {
      ...formValues,
      page,
      page_size: newPageSize,
    };

    getInventoryData(params);
  };

  // 处理搜索
  const handleSearch = () => {
    const formValues = form.getFieldsValue();

    // 构建查询参数
    const params: SearchParams = {
      ...formValues,
      page: 1, // 搜索时重置到第一页
      page_size: pageSize,
    };

    setCurrentPage(1); // 重置当前页为第一页
    getInventoryData(params);
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);

    // 重置后获取所有数据
    getInventoryData({
      page: 1,
      page_size: pageSize,
    });
  };

  // 处理新增库存记录后的刷新
  const handleInventoryAdded = () => {
    // 刷新当前页数据
    getInventoryData({
      ...form.getFieldsValue(),
      page: currentPage,
      page_size: pageSize,
    });
  };

  // 处理编辑按钮点击
  const handleEdit = (record: InventoryItem) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  // 处理删除按钮点击
  const handleDelete = (record: InventoryItem) => {
    modal.confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除绘本 "${record.name}" 吗？此操作不可恢复。`,
      okText: "确认",
      cancelText: "取消",
      okType: "danger",
      onOk: async () => {
        try {
          const result = await deleteInventoryItem(record.book_id.toString());

          if (result.success) {
            message.success("删除成功");
            // 刷新数据
            getInventoryData({
              page: currentPage,
              page_size: pageSize,
              ...form.getFieldsValue(),
            });
          } else {
            message.error(result.error || "删除失败");

          }
        } catch (error) {
          console.error("删除绘本时出错:", error);
          message.error("删除绘本时出错，请稍后重试");
        }
      },
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F59A23",
          colorLink: "#F59A23",
        },
      }}
    >
      <div className="inventory-container">
        <Card title="信息检索" variant="outlined">
          <Form form={form} layout="inline">
            <Space size={"small"}>
              <Form.Item label="绘本编号" name="book_id">
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="绘本名称" name="name">
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="绘本类别" name="category">
                <Select
                  style={{ width: 120 }}
                  options={[
                    { value: "children_story", label: "儿童故事" },
                    { value: "science_knowledge", label: "科普知识" },
                    { value: "art_enlightenment", label: "艺术启蒙" },
                  ]}
                  allowClear
                />
              </Form.Item>
              <Form.Item label="作者" name="author">
                <Input placeholder="请输入" />
              </Form.Item>
            </Space>

            <Form.Item style={{ marginLeft: "auto" }}>
              <Space size={"large"}>
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ marginLeft: 8 }}
                  onClick={handleSearch}
                >
                  搜索
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <div className="main-container">
          <InventoryActionButtons onInventoryAdded={handleInventoryAdded} />

          <div className="table-container">
            <TangTable
              columns={columns}
              dataSource={data}
              // loading={loading}
              currentPage={currentPage}
              total={total}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              scroll={{ y: 50 * 12 }}
            />
          </div>
        </div>

        {/* 编辑模态框 */}
        <EditInventoryModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSuccess={() => {
            // 刷新数据
            getInventoryData({
              page: currentPage,
              page_size: pageSize,
              ...form.getFieldsValue(),
            });
          }}
          record={currentRecord}
        />
      </div>
    </ConfigProvider>
  );
}
