"use client"

import { useState } from "react"
import { Row, Col, Card, Button, Input, Table, Pagination, Space, message, Tag } from "antd"
import { SearchOutlined, PrinterOutlined } from "@ant-design/icons"
import "./ServiceRecords.scss"

const ServiceRecords = () => {
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
      title: "服务时长",
      dataIndex: "serviceHours",
      key: "serviceHours",
      width: 100,
      align: "center" as const,
    },
    {
      title: "服务次数",
      dataIndex: "serviceCount",
      key: "serviceCount",
      width: 100,
      align: "center" as const,
    },
    {
      title: "服务类型",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 120,
      align: "center" as const,
    },
    {
      title: "服务评价",
      dataIndex: "evaluation",
      key: "evaluation",
      width: 120,
      align: "center" as const,
      render: (text: string) => {
        const color = text === "优秀" ? "green" : text === "良好" ? "blue" : "orange"
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" style={{ color: "#F59A23", padding: "0" }} onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ]

  // 模拟数据
  const data = [
    {
      key: "1",
      index: 1,
      id: "20230201",
      name: "张三",
      serviceHours: "100h",
      serviceCount: 21,
      serviceType: "前台接待",
      evaluation: "优秀",
    },
    {
      key: "2",
      index: 2,
      id: "20230202",
      name: "李斯",
      serviceHours: "50h",
      serviceCount: 10,
      serviceType: "绘本整理",
      evaluation: "良好",
    },
    {
      key: "3",
      index: 3,
      id: "20230203",
      name: "王五",
      serviceHours: "86h",
      serviceCount: 15,
      serviceType: "活动执行",
      evaluation: "优秀",
    },
    {
      key: "4",
      index: 4,
      id: "20230204",
      name: "赵明",
      serviceHours: "66h",
      serviceCount: 12,
      serviceType: "前台接待",
      evaluation: "良好",
    },
    {
      key: "5",
      index: 5,
      id: "20230205",
      name: "刘璐",
      serviceHours: "25h",
      serviceCount: 5,
      serviceType: "前台接待",
      evaluation: "一般",
    },
    {
      key: "6",
      index: 6,
      id: "20230206",
      name: "张小玉",
      serviceHours: "20h",
      serviceCount: 4,
      serviceType: "绘本整理",
      evaluation: "良好",
    },
    {
      key: "7",
      index: 7,
      id: "20230207",
      name: "于新",
      serviceHours: "20h",
      serviceCount: 4,
      serviceType: "活动执行",
      evaluation: "优秀",
    },
    {
      key: "8",
      index: 8,
      id: "20230208",
      name: "叶欣然",
      serviceHours: "25h",
      serviceCount: 5,
      serviceType: "绘本整理",
      evaluation: "良好",
    },
    {
      key: "9",
      index: 9,
      id: "20230209",
      name: "刘玉",
      serviceHours: "20h",
      serviceCount: 4,
      serviceType: "课程辅导",
      evaluation: "优秀",
    },
    {
      key: "10",
      index: 10,
      id: "20230210",
      name: "向晨",
      serviceHours: "20h",
      serviceCount: 4,
      serviceType: "前台接待",
      evaluation: "良好",
    },
  ]

  // 简化的志愿者列表数据
  const simpleVolunteerList = [
    { key: "1", name: "张三", serviceHours: "100h", evaluation: "优秀" },
    { key: "2", name: "李斯", serviceHours: "50h", evaluation: "良好" },
    { key: "3", name: "王五", serviceHours: "86h", evaluation: "优秀" },
    { key: "4", name: "赵明", serviceHours: "66h", evaluation: "良好" },
    { key: "5", name: "刘璐", serviceHours: "25h", evaluation: "一般" },
    { key: "6", name: "张小玉", serviceHours: "20h", evaluation: "良好" },
    { key: "7", name: "于新", serviceHours: "20h", evaluation: "优秀" },
    { key: "8", name: "叶欣然", serviceHours: "25h", evaluation: "良好" },
  ]

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
      title: "服务时长",
      dataIndex: "serviceHours",
      key: "serviceHours",
      width: 80,
      align: "center" as const,
    },
    {
      title: "评价",
      dataIndex: "evaluation",
      key: "evaluation",
      width: 80,
      align: "center" as const,
      render: (text: string) => {
        const color = text === "优秀" ? "green" : text === "良好" ? "blue" : "orange"
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_:any, record:any) => (
        <Button type="link" style={{ color: "#F59A23", padding: "0" }} onClick={() => handleViewDetail(record)}>
          查看
        </Button>
      ),
    },
  ]

  const handleSearch = () => {
    message.info(`搜索关键词: ${searchText}`)
  }

  const handlePrint = () => {
    message.info("打印服务记录")
  }

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page)
    if (pageSize) setPageSize(pageSize)
  }

  const handleViewDetail = (record: any) => {
    message.info(`查看志愿者 ${record.name} 的服务详情`)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={18}>
        <Card>
          <div className="service-records-header">
            <div className="title-section">
              <div className="icon-circle">
                <span className="icon">📋</span>
              </div>
              <h2>服务记录表</h2>
            </div>
            <div className="action-buttons">
              <Button type="primary" className="custom-button">
                导出记录
              </Button>
              <Button className="custom-button">按时间筛选</Button>
              <Button className="custom-button">按类型筛选</Button>
            </div>
          </div>

          <div className="search-section">
            <div className="left-actions">
              <Input
                placeholder="搜索志愿者或服务类型"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ marginLeft: 8 }}>
                搜索
              </Button>
            </div>
            <div className="right-actions">
              <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
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
                showTotal={(total) => `共 ${total} 条记录`}
              />
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="simple-volunteer-list" title="服务排行榜">
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
  )
}

export default ServiceRecords
