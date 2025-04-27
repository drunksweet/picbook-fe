"use client"

import { Button, Card } from "antd"
import {
  FileTextOutlined,
  UserOutlined,
  NotificationOutlined,
  BarChartOutlined,
  CommentOutlined,
} from "@ant-design/icons"
import "./FunctionButtons.scss"

interface FunctionButtonsProps {
  onCreateActivity: () => void
  onSignupManagement: () => void
  onNotification: () => void
  onDataAnalysis: () => void
  onFeedback: () => void
}

export default function FunctionButtons({
  onCreateActivity,
  onSignupManagement,
  onNotification,
  onDataAnalysis,
  onFeedback,
}: FunctionButtonsProps) {
  return (
    <Card className="btns-card">
      <div className="function-buttons">
        <Button type="primary" className="function-button" onClick={onCreateActivity}>
          <FileTextOutlined />
          活动创建
        </Button>
        <Button type="primary" className="function-button" onClick={onSignupManagement}>
          <UserOutlined />
          报名管理
        </Button>
        <Button type="primary" className="function-button" onClick={onNotification}>
          <NotificationOutlined />
          通知发送
        </Button>
        <Button type="primary" className="function-button" onClick={onDataAnalysis}>
          <BarChartOutlined />
          数据分析
        </Button>
        <Button type="primary" className="function-button" onClick={onFeedback}>
          <CommentOutlined />
          用户反馈
        </Button>
      </div>
    </Card>
  )
}
