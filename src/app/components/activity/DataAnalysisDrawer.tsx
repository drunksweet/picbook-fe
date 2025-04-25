"use client"

import { Drawer, Space, Button, Tabs, message } from "antd"
import { PieChartOutlined, LineChartOutlined } from "@ant-design/icons"

const { TabPane } = Tabs

interface DataAnalysisDrawerProps {
  visible: boolean
  onClose: () => void
}

export default function DataAnalysisDrawer({ visible, onClose }: DataAnalysisDrawerProps) {
  return (
    <Drawer
      title="数据分析"
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
        <TabPane tab="参与度分析" key="1">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ marginBottom: "20px" }}>
              <PieChartOutlined style={{ fontSize: "100px", color: "#F59A23" }} />
            </div>
            <p>此处将显示活动参与度图表分析</p>
            <p>包括各类活动参与人数、参与率等数据</p>
            <Button type="primary" onClick={() => message.success("数据导出成功")}>
              导出报表
            </Button>
          </div>
        </TabPane>
        <TabPane tab="趋势分析" key="2">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ marginBottom: "20px" }}>
              <LineChartOutlined style={{ fontSize: "100px", color: "#F59A23" }} />
            </div>
            <p>此处将显示活动数据趋势分析</p>
            <p>包括活动数量、参与人数的月度变化趋势</p>
            <Button type="primary" onClick={() => message.success("报告生成成功")}>
              生成分析报告
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </Drawer>
  )
}
