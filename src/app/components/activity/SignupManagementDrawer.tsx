"use client"

import { Drawer, Space, Button, Tabs, Table, Row, Col, Card, Statistic, message } from "antd"

const { TabPane } = Tabs

interface SignupManagementDrawerProps {
  visible: boolean
  onClose: () => void
  signupData: any[]
}

export default function SignupManagementDrawer({ visible, onClose, signupData }: SignupManagementDrawerProps) {
  const columns = [
    { title: "序号", dataIndex: "id", key: "id" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "联系方式", dataIndex: "phone", key: "phone" },
    { title: "报名时间", dataIndex: "time", key: "time" },
    { title: "状态", dataIndex: "status", key: "status" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => message.success(`已确认${record.name}的报名`)}>
            确认
          </Button>
          <Button type="link" size="small" onClick={() => message.success(`已取消${record.name}的报名`)}>
            取消
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Drawer
      title="报名管理"
      width={700}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>关闭</Button>
        </Space>
      }
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="报名审核" key="1">
          <Table dataSource={signupData} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>
        <TabPane tab="报名统计" key="2">
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="今日新增报名" value={12} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="待审核报名" value={8} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="已确认报名" value={45} />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Drawer>
  )
}
