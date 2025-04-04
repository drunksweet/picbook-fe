"use client";

import type React from "react";
import { useState } from "react";
import {
  Typography,
  Form,
  Input,
  Select,
  Button,
  Table,
  Tabs,
  Card,
  Row,
  Col,
  Tag,
  Pagination,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import "./page.scss";
import Banner from "@/components/banner";
import { useWindowSize } from "@/hooks/useWindowSize";
import BorrowBarChart from "@/components/echarts/borrow_bar/BorrowBarChart";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟借阅历史数据
const borrowHistoryData = [
  {
    key: "1",
    id: "20230201",
    name: "书名1",
    borrower: "张三",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "延迟",
  },
  {
    key: "2",
    id: "20230202",
    name: "书名2",
    borrower: "李斯",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "逾期",
  },
  {
    key: "3",
    id: "20230203",
    name: "书名3",
    borrower: "王五",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "正常",
  },
  {
    key: "4",
    id: "20230204",
    name: "书名4",
    borrower: "赵明",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "正常",
  },
  {
    key: "5",
    id: "20230205",
    name: "书名5",
    borrower: "刘全",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "流转",
  },
  {
    key: "6",
    id: "20230206",
    name: "书名6",
    borrower: "叶咏然",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "流转",
  },
  {
    key: "7",
    id: "20230207",
    name: "书名7",
    borrower: "杨鸿",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "流转",
  },
  {
    key: "8",
    id: "20230208",
    name: "书名8",
    borrower: "刘英",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "流转",
  },
  {
    key: "9",
    id: "20230209",
    name: "书名9",
    borrower: "田静",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "流转",
  },
  {
    key: "10",
    id: "20230210",
    name: "书名10",
    borrower: "邓小王",
    borrowDate: "2024-12-24",
    returnDate: "2025-1-24",
    status: "流转",
  },
];

// 模拟搜索结果数据
const searchResultsData = [
  {
    key: "1",
    id: "20230201",
    name: "书名1",
    category: "儿童故事",
    publisher: "出版社1",
    author: "作者1",
  },
  {
    key: "2",
    id: "20230202",
    name: "书名2",
    category: "科普知识",
    publisher: "出版社2",
    author: "作者2",
  },
  {
    key: "3",
    id: "20230203",
    name: "书名3",
    category: "儿童故事",
    publisher: "出版社3",
    author: "作者3",
  },
  {
    key: "4",
    id: "20230204",
    name: "书名4",
    category: "儿童故事",
    publisher: "出版社4",
    author: "作者4",
  },
  {
    key: "5",
    id: "20230205",
    name: "书名5",
    category: "科普知识",
    publisher: "出版社5",
    author: "作者5",
  },
  {
    key: "6",
    id: "20230206",
    name: "书名6",
    category: "艺术启蒙",
    publisher: "出版社5",
    author: "作者5",
  },
  {
    key: "7",
    id: "20230207",
    name: "书名7",
    category: "儿童故事",
    publisher: "出版社5",
    author: "作者5",
  },
];

const BookBorrowPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { width } = useWindowSize();

  // 根据屏幕宽度调整列布局
  const getColumnSpans = () => {
    if (width < 768) {
      return { left: 24, right: 24 };
    } else if (width < 1200) {
      return { left: 14, right: 10 };
    } else {
      return { left: 16, right: 8 };
    }
  };

  const { left: leftSpan, right: rightSpan } = getColumnSpans();

  // 借阅历史表格列定义 - 根据屏幕宽度调整
  const getHistoryColumns = () => {
    const baseColumns = [
      { title: "序号", dataIndex: "key", key: "key", width: 60 },
      { title: "图书编号", dataIndex: "id", key: "id", width: 100 },
      { title: "书名", dataIndex: "name", key: "name", width: 100 },
      { title: "借阅人", dataIndex: "borrower", key: "borrower", width: 80 },
      {
        title: "借阅日期",
        dataIndex: "borrowDate",
        key: "borrowDate",
        width: 100,
      },
      {
        title: "应归还时间",
        dataIndex: "returnDate",
        key: "returnDate",
        width: 100,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 80,
        render: (status: string) => {
          let color = "green";
          if (status === "延迟") color = "orange";
          if (status === "逾期") color = "volcano";
          if (status === "流转") color = "blue";
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: "操作",
        key: "action",
        width: 80,
        render: () => (
          <Button type="link" style={{ color: "#F59A23", padding: "0" }}>
            详情
          </Button>
        ),
      },
    ];

    // 在小屏幕上减少显示的列
    if (width < 768) {
      return baseColumns.filter(
        (col) => !["borrowDate", "returnDate"].includes(col.dataIndex as string)
      );
    }

    return baseColumns;
  };

  // 搜索结果表格列定义 - 根据屏幕宽度调整
  const getSearchColumns = () => {
    const baseColumns = [
      {
        title: "勾选",
        dataIndex: "select",
        key: "select",
        width: 60,
        render: () => <input type="radio" name="bookSelect" />,
      },
      { title: "图书编号", dataIndex: "id", key: "id", width: 100 },
      { title: "书名", dataIndex: "name", key: "name", width: 100 },
      { title: "类型", dataIndex: "category", key: "category", width: 100 },
      { title: "出版社", dataIndex: "publisher", key: "publisher", width: 100 },
      {
        title: "作者",
        dataIndex: "author",
        key: "author",
        width: 100,
        render: (author: string) => (
          <span style={{ color: "#F59A23" }}>{author}</span>
        ),
      },
      {
        title: "操作",
        key: "action",
        width: 80,
        render: () => (
          <Button type="link" style={{ color: "#F59A23", padding: "0" }}>
            详情
          </Button>
        ),
      },
    ];

    // 在小屏幕上减少显示的列
    if (width < 768) {
      return baseColumns.filter(
        (col) => !["publisher"].includes(col.dataIndex as string)
      );
    } else if (width < 1200) {
      return baseColumns;
    }

    return baseColumns;
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const statisticsSelctOption = [
    { value: "oneDay", label: <span>近一天</span> },
    { value: "oneWeek", label: <span>近一周</span> },
    { value: "towWeek", label: <span>近两周</span> },
    { value: "oneMonth", label: <span>近一月</span> },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F59A23",
          colorLink: "#F59A23",
        },
      }}
    >
      <Banner title="绘本管理-绘本借阅" />
      <div className="book-borrow-container">
        <div className="page-content">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Row gutter={[0, 16]}>
                <Card className="borrower-info-card">
                  <Title
                    level={5}
                    style={{ color: "#F59A23", marginBottom: 8 }}
                  >
                    借阅者信息
                  </Title>
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="姓名">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="联系方式">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
                <Card className="book-info-card">
                  <Title level={5} style={{ color: "#F59A23" }}>
                    绘本信息
                  </Title>
                  <Form layout="vertical">
                    <Row gutter={[16, 4]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="绘本编号">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="类型">
                          <Select placeholder="请选择">
                            <Option value="children">儿童故事</Option>
                            <Option value="science">科普知识</Option>
                            <Option value="art">艺术启蒙</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="书名">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="作者">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="借阅时间">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="预计归还时间">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col span={24} style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          icon={<SearchOutlined />}
                          style={{
                            backgroundColor: "#F59A23",
                            borderColor: "#F59A23",
                          }}
                        >
                          搜索
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[0, 16]}>
                <Card className="borrow-history-card">
                  <div className="history-header">
                    <ClockCircleOutlined
                      style={{ fontSize: 24, color: "#F59A23" }}
                    />
                    <Title level={5} style={{ margin: "0 0 0 8px" }}>
                      借阅历史记录
                    </Title>
                  </div>

                  <Tabs defaultActiveKey="1" className="history-tabs">
                    <TabPane tab="待归还记录" key="1"></TabPane>
                    <TabPane tab="逾期记录" key="2"></TabPane>
                    <TabPane tab="已归还记录" key="3"></TabPane>
                    <TabPane tab="快速操作" key="4"></TabPane>
                  </Tabs>

                  <div className="table-responsive">
                    <Table
                      columns={getHistoryColumns()}
                      dataSource={borrowHistoryData}
                      pagination={false}
                      size="small"
                      bordered
                      scroll={{ x: "max-content", y: 48.9 * 7 }}
                    />
                  </div>

                  <div className="pagination-container">
                    <Pagination
                      size="small"
                      total={50}
                      showSizeChanger={width > 768}
                      showQuickJumper={width > 768}
                      defaultCurrent={1}
                      defaultPageSize={10}
                      simple={width <= 768}
                    />
                  </div>
                </Card>
              </Row>
            </Col>

            <Col span={12}>
              <Card className="search-results-card">
                <div className="results-header">
                  <Title
                    level={5}
                    style={{ color: "#F59A23", marginBottom: 12 }}
                  >
                    结果：
                  </Title>
                </div>
                <div className="table-responsive">
                  <Table
                    columns={getSearchColumns()}
                    dataSource={searchResultsData}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: "max-content", y: 49 * 5 }}
                  />
                </div>
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#F59A23",
                      borderColor: "#F59A23",
                      marginRight: 16,
                      marginBottom: 8,
                    }}
                  >
                    借阅
                  </Button>
                  <Button style={{ marginBottom: 8 }}>取 消</Button>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="statistics-card">
                <div className="statistics-header">
                  <BarChartOutlined
                    style={{ fontSize: 24, color: "#F59A23" }}
                  />
                  <Title level={5} style={{ margin: "0 0 0 8px" }}>
                    统计分析
                  </Title>
                </div>

                <Select
                  options={statisticsSelctOption}
                  style={{ width: 120 }}
                  defaultValue="oneDay"
                />

                <div
                  className="chart-container"
                  style={{
                    height: 320,
                    background: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <BorrowBarChart />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BookBorrowPage;
