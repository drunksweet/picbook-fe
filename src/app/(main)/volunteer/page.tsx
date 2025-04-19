"use client";

import { useState } from "react";
import {
  ConfigProvider,
  App,
  Row,
  Col,
  Card,
  Input,
  Button,
  Space,
  Table,
  Tag,
  Tabs,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Banner from "@/components/banner";
import "./page.scss";

const { TabPane } = Tabs;

const VolunteerManagementPage = () => {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 表格列定义
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center" as const,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center" as const,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 100,
      align: "center" as const,
    },
    {
      title: "联系方式",
      dataIndex: "contact",
      key: "contact",
      width: 120,
      align: "center" as const,
      render: (text: string) => (
        <span style={{ color: "#F59A23" }}>{text}</span>
      ),
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 60,
      align: "center" as const,
    },
    {
      title: "服务时间偏好",
      dataIndex: "timePreference",
      key: "timePreference",
      width: 120,
      align: "center" as const,
    },
    {
      title: "擅长领域",
      dataIndex: "skills",
      key: "skills",
      width: 120,
      align: "center" as const,
    },
    {
      title: "注册时间",
      dataIndex: "registerTime",
      key: "registerTime",
      width: 120,
      align: "center" as const,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" style={{ color: "#F59A23", padding: "0" }}>
            编辑
          </Button>
          <Button type="link" style={{ color: "#F59A23", padding: "0" }}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const data = [
    {
      key: "1",
      index: 1,
      id: "20230201",
      name: "张三",
      contact: "18173456234",
      age: 21,
      timePreference: "上午",
      skills: "前台接待",
      registerTime: "2025-01-05",
    },
    {
      key: "2",
      index: 2,
      id: "20230202",
      name: "李斯",
      contact: "13345679921",
      age: 22,
      timePreference: "上午",
      skills: "绘本整理",
      registerTime: "2025-01-05",
    },
    {
      key: "3",
      index: 3,
      id: "20230203",
      name: "王五",
      contact: "15667233125",
      age: 24,
      timePreference: "中午",
      skills: "活动执行",
      registerTime: "2025-01-05",
    },
    {
      key: "4",
      index: 4,
      id: "20230204",
      name: "赵明",
      contact: "16798634211",
      age: 20,
      timePreference: "上午",
      skills: "前台接待",
      registerTime: "2025-01-05",
    },
    {
      key: "5",
      index: 5,
      id: "20230205",
      name: "刘璐",
      contact: "17277188923",
      age: 19,
      timePreference: "下午",
      skills: "前台接待",
      registerTime: "2025-01-05",
    },
    {
      key: "6",
      index: 6,
      id: "20230206",
      name: "张小玉",
      contact: "15437719885",
      age: 18,
      timePreference: "下午",
      skills: "绘本整理",
      registerTime: "2025-01-05",
    },
    {
      key: "7",
      index: 7,
      id: "20230207",
      name: "于新",
      contact: "18823367899",
      age: 20,
      timePreference: "下午",
      skills: "活动执行",
      registerTime: "2025-01-05",
    },
    {
      key: "8",
      index: 8,
      id: "20230208",
      name: "叶欣然",
      contact: "15567722389",
      age: 22,
      timePreference: "下午",
      skills: "绘本整理",
      registerTime: "2025-01-05",
    },
    {
      key: "9",
      index: 9,
      id: "20230209",
      name: "刘玉",
      contact: "13388897654",
      age: 19,
      timePreference: "晚上",
      skills: "课程辅导",
      registerTime: "2025-01-05",
    },
    {
      key: "10",
      index: 10,
      id: "20230210",
      name: "向晨",
      contact: "13234455551",
      age: 19,
      timePreference: "中午",
      skills: "前台接待",
      registerTime: "2025-01-05",
    },
  ];

  // 简化的志愿者列表数据
  const simpleVolunteerList = [
    { key: "1", name: "张三", contact: "18173456234", age: 21 },
    { key: "2", name: "李斯", contact: "18173456234", age: 22 },
    { key: "3", name: "王五", contact: "15667233125", age: 24 },
    { key: "4", name: "赵明", contact: "16798634211", age: 20 },
    { key: "5", name: "刘璐", contact: "17277188923", age: 19 },
    { key: "6", name: "张小玉", contact: "15437719885", age: 18 },
    { key: "7", name: "于新", contact: "18823367899", age: 20 },
    { key: "8", name: "叶欣然", contact: "15567722389", age: 22 },
  ];

  // 简化的志愿者列表列定义
  const simpleColumns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center" as const,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 80,
      align: "center" as const,
    },
    {
      title: "联系方式",
      dataIndex: "contact",
      key: "contact",
      width: 120,
      align: "center" as const,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 60,
      align: "center" as const,
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      align: "center" as const,
      render: () => (
        <Button type="link" style={{ color: "#F59A23", padding: "0" }}>
          查看
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    message.info(`搜索关键词: ${searchText}`);
  };

  const handleAddVolunteer = () => {
    message.info("添加志愿者");
  };

  const handleQuickAction = () => {
    message.info("快捷操作");
  };

  const handlePrint = () => {
    message.info("打印");
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
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
      <>
        <Banner title="志愿者管理" />
        <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
          <Col span={24}>
            <Card>
              <div className="nav-tabs">
                <Tabs defaultActiveKey="1" type="card" className="custom-tabs">
                  <TabPane tab="志愿者信息" key="1" />
                  <TabPane tab="服务记录" key="2" />
                  <TabPane tab="志愿者招募" key="3" />
                  <TabPane tab="激励机制" key="4" />
                  <TabPane tab="数据/反馈" key="5" />
                </Tabs>
              </div>
            </Card>
          </Col>
          <Col span={18}>
            <Card>
              <div className="volunteer-info-header">
                <div className="title-section">
                  <div className="icon-circle">
                    <span className="icon">👥</span>
                  </div>
                  <h2>志愿者信息表</h2>
                </div>
                <div className="action-buttons">
                  <Button type="primary" className="custom-button">
                    志愿者申请表
                  </Button>
                  <Button className="custom-button">匹配领域</Button>
                  <Button className="custom-button">服务时间偏好</Button>
                </div>
              </div>

              <div className="search-section">
                <div className="left-actions">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddVolunteer}
                  >
                    添加志愿者
                  </Button>
                  <Input
                    placeholder="搜索志愿者"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200, marginLeft: 16 }}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    style={{ marginLeft: 8 }}
                  >
                    搜索
                  </Button>
                </div>
                <div className="right-actions">
                  <Button type="primary" onClick={handleQuickAction}>
                    快捷操作
                  </Button>
                  <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                    style={{ marginLeft: 8 }}
                  >
                    打印
                  </Button>
                </div>
              </div>

              <div className="table-container">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{ x: "max-content" }}
                />
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={100}
                    onChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `${total}条/页`}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="simple-volunteer-list" title="志愿者列表">
              <Table
                columns={simpleColumns}
                dataSource={simpleVolunteerList}
                pagination={{
                  simple: true,
                  current: currentPage,
                  pageSize: 8,
                  total: simpleVolunteerList.length,
                }}
                bordered
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </>
    </ConfigProvider>
  );
};

export default VolunteerManagementPage;
