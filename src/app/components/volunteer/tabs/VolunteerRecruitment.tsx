"use client"

import { useState } from "react"
import { Row, Col, Card, Button, Input, Table, Pagination, Space, message, Tag, Form, Modal } from "antd"
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import "./VolunteerRecruitment.scss"

const { TextArea } = Input

const VolunteerRecruitment = () => {
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentRecruitment, setCurrentRecruitment] = useState<any>(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

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
      title: "招募ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center" as const,
    },
    {
      title: "招募标题",
      dataIndex: "title",
      key: "title",
      width: 150,
      align: "center" as const,
    },
    {
      title: "招募人数",
      dataIndex: "count",
      key: "count",
      width: 100,
      align: "center" as const,
    },
    {
      title: "招募类型",
      dataIndex: "type",
      key: "type",
      width: 120,
      align: "center" as const,
    },
    {
      title: "发布时间",
      dataIndex: "publishTime",
      key: "publishTime",
      width: 120,
      align: "center" as const,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as const,
      render: (text: string) => {
        const color = text === "招募中" ? "green" : text === "已结束" ? "gray" : "orange"
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            style={{ color: "#F59A23", padding: "0" }}
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            编辑
          </Button>
          <Button
            type="link"
            style={{ color: "#F59A23", padding: "0" }}
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
          <Button type="link" style={{ color: "#F59A23", padding: "0" }} onClick={() => handleViewDetail(record)}>
            查看
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
      id: "R20230201",
      title: "图书馆前台志愿者招募",
      count: 5,
      type: "前台接待",
      publishTime: "2025-01-05",
      status: "招募中",
      description: "招募图书馆前台志愿者，负责接待读者、图书借阅登记等工作。",
    },
    {
      key: "2",
      index: 2,
      id: "R20230202",
      title: "绘本整理志愿者招募",
      count: 3,
      type: "绘本整理",
      publishTime: "2025-01-06",
      status: "招募中",
      description: "招募绘本整理志愿者，负责整理、分类儿童绘本。",
    },
    {
      key: "3",
      index: 3,
      id: "R20230203",
      title: "阅读推广活动志愿者",
      count: 10,
      type: "活动执行",
      publishTime: "2025-01-07",
      status: "招募中",
      description: "招募阅读推广活动志愿者，协助组织开展阅读推广活动。",
    },
    {
      key: "4",
      index: 4,
      id: "R20230204",
      title: "图书馆环境维护志愿者",
      count: 2,
      type: "环境维护",
      publishTime: "2025-01-08",
      status: "已结束",
      description: "招募图书馆环境维护志愿者，负责图书馆环境整理、维护工作。",
    },
    {
      key: "5",
      index: 5,
      id: "R20230205",
      title: "儿童阅读辅导志愿者",
      count: 4,
      type: "阅读辅导",
      publishTime: "2025-01-09",
      status: "招募中",
      description: "招募儿童阅读辅导志愿者，为儿童提供阅读指导和辅导。",
    },
    {
      key: "6",
      index: 6,
      id: "R20230206",
      title: "图书分类整理志愿者",
      count: 6,
      type: "图书整理",
      publishTime: "2025-01-10",
      status: "招募中",
      description: "招募图书分类整理志愿者，负责图书分类、上架等工作。",
    },
    {
      key: "7",
      index: 7,
      id: "R20230207",
      title: "读者活动策划志愿者",
      count: 3,
      type: "活动策划",
      publishTime: "2025-01-11",
      status: "招募中",
      description: "招募读者活动策划志愿者，负责策划、组织读者活动。",
    },
    {
      key: "8",
      index: 8,
      id: "R20230208",
      title: "图书馆导览志愿者",
      count: 2,
      type: "导览服务",
      publishTime: "2025-01-12",
      status: "已结束",
      description: "招募图书馆导览志愿者，为读者提供图书馆导览服务。",
    },
    {
      key: "9",
      index: 9,
      id: "R20230209",
      title: "特殊读者服务志愿者",
      count: 4,
      type: "特殊服务",
      publishTime: "2025-01-13",
      status: "招募中",
      description: "招募特殊读者服务志愿者，为特殊读者提供阅读服务。",
    },
    {
      key: "10",
      index: 10,
      id: "R20230210",
      title: "图书馆宣传志愿者",
      count: 5,
      type: "宣传推广",
      publishTime: "2025-01-14",
      status: "招募中",
      description: "招募图书馆宣传志愿者，负责图书馆活动宣传、推广工作。",
    },
  ]

  // 简化的招募列表数据
  const simpleRecruitmentList = [
    { key: "1", title: "图书馆前台志愿者招募", count: 5, status: "招募中" },
    { key: "2", title: "绘本整理志愿者招募", count: 3, status: "招募中" },
    { key: "3", title: "阅读推广活动志愿者", count: 10, status: "招募中" },
    { key: "4", title: "图书馆环境维护志愿者", count: 2, status: "已结束" },
    { key: "5", title: "儿童阅读辅导志愿者", count: 4, status: "招募中" },
    { key: "6", title: "图书分类整理志愿者", count: 6, status: "招募中" },
    { key: "7", title: "读者活动策划志愿者", count: 3, status: "招募中" },
    { key: "8", title: "图书馆导览志愿者", count: 2, status: "已结束" },
  ]

  // 简化的招募列表列定义
  const simpleColumns = [
    {
      title: "招募标题",
      dataIndex: "title",
      key: "title",
      width: 150,
      align: "center" as const,
      ellipsis: true,
    },
    {
      title: "人数",
      dataIndex: "count",
      key: "count",
      width: 60,
      align: "center" as const,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center" as const,
      render: (text: string) => {
        const color = text === "招募中" ? "green" : "gray"
        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  const handleSearch = () => {
    message.info(`搜索关键词: ${searchText}`)
  }

  const handleAddRecruitment = () => {
    setIsAddModalVisible(true)
  }

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page)
    if (pageSize) setPageSize(pageSize)
  }

  const handleEdit = (record: any) => {
    setCurrentRecruitment(record)
    editForm.setFieldsValue({
      title: record.title,
      count: record.count,
      type: record.type,
      description: record.description,
    })
    setIsEditModalVisible(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除招募信息 "${record.title}" 吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        message.success(`已删除招募信息 "${record.title}"`)
      },
    })
  }

  const handleViewDetail = (record: any) => {
    message.info(`查看招募信息 "${record.title}" 的详细信息`)
  }

  const handleAddModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        message.success("招募信息添加成功！")
        setIsAddModalVisible(false)
        form.resetFields()
      })
      .catch((info) => {
        console.log("验证失败:", info)
      })
  }

  const handleEditModalOk = () => {
    editForm
      .validateFields()
      .then((values) => {
        message.success(`招募信息 "${currentRecruitment.title}" 修改成功！`)
        setIsEditModalVisible(false)
      })
      .catch((info) => {
        console.log("验证失败:", info)
      })
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={18}>
        <Card>
          <div className="recruitment-header">
            <div className="title-section">
              <div className="icon-circle">
                <span className="icon">📢</span>
              </div>
              <h2>志愿者招募管理</h2>
            </div>
            <div className="action-buttons">
              <Button type="primary" className="custom-button" onClick={handleAddRecruitment}>
                发布招募
              </Button>
              <Button className="custom-button">招募统计</Button>
              <Button className="custom-button">申请管理</Button>
            </div>
          </div>

          <div className="search-section">
            <div className="left-actions">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRecruitment}>
                添加招募
              </Button>
              <Input
                placeholder="搜索招募信息"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200, marginLeft: 16 }}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ marginLeft: 8 }}>
                搜索
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
        <Card className="simple-recruitment-list" title="招募信息">
          <Table
            columns={simpleColumns}
            dataSource={simpleRecruitmentList}
            pagination={{
              simple: true,
              current: currentPage,
              pageSize: 8,
              total: simpleRecruitmentList.length,
            }}
            bordered
            size="small"
          />
        </Card>
      </Col>

      {/* 添加招募信息模态框 */}
      <Modal
        title="添加招募信息"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={() => setIsAddModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="招募标题" rules={[{ required: true, message: "请输入招募标题" }]}>
            <Input placeholder="请输入招募标题" />
          </Form.Item>
          <Form.Item name="count" label="招募人数" rules={[{ required: true, message: "请输入招募人数" }]}>
            <Input type="number" placeholder="请输入招募人数" />
          </Form.Item>
          <Form.Item name="type" label="招募类型" rules={[{ required: true, message: "请输入招募类型" }]}>
            <Input placeholder="请输入招募类型" />
          </Form.Item>
          <Form.Item name="description" label="招募描述" rules={[{ required: true, message: "请输入招募描述" }]}>
            <TextArea rows={4} placeholder="请输入招募描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑招募信息模态框 */}
      <Modal
        title="编辑招募信息"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="招募标题" rules={[{ required: true, message: "请输入招募标题" }]}>
            <Input placeholder="请输入招募标题" />
          </Form.Item>
          <Form.Item name="count" label="招募人数" rules={[{ required: true, message: "请输入招募人数" }]}>
            <Input type="number" placeholder="请输入招募人数" />
          </Form.Item>
          <Form.Item name="type" label="招募类型" rules={[{ required: true, message: "请输入招募类型" }]}>
            <Input placeholder="请输入招募类型" />
          </Form.Item>
          <Form.Item name="description" label="招募描述" rules={[{ required: true, message: "请输入招募描述" }]}>
            <TextArea rows={4} placeholder="请输入招募描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  )
}

export default VolunteerRecruitment
