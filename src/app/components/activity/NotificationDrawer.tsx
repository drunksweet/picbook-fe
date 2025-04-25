"use client"

import { Drawer, Space, Button, Form, Select, message } from "antd"

import type { ActivityData } from "./ActivityCard/ActivityCard"
import TextArea from "antd/lib/input/TextArea"

const { Option } = Select

interface NotificationDrawerProps {
  visible: boolean
  onClose: () => void
  activities: ActivityData[]
}

export default function NotificationDrawer({ visible, onClose, activities }: NotificationDrawerProps) {
  const handleSendNotification = () => {
    message.success("通知发送成功")
    onClose()
  }

  return (
    <Drawer
      title="通知发送"
      width={700}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>关闭</Button>
        </Space>
      }
    >
      <Form layout="vertical">
        <Form.Item name="notifyType" label="通知类型" initialValue="activity">
          <Select>
            <Option value="activity">活动通知</Option>
            <Option value="reminder">活动提醒</Option>
            <Option value="cancel">取消通知</Option>
            <Option value="change">变更通知</Option>
          </Select>
        </Form.Item>

        <Form.Item name="activitySelect" label="选择活动">
          <Select placeholder="请选择活动">
            {activities.map((activity) => (
              <Option key={activity.id} value={activity.id}>
                {activity.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="notifyContent" label="通知内容">
          <TextArea rows={6} placeholder="请输入通知内容" />
        </Form.Item>

        <Form.Item name="notifyTarget" label="通知对象" initialValue="all">
          <Select>
            <Option value="all">所有报名人员</Option>
            <Option value="confirmed">已确认人员</Option>
            <Option value="waiting">待确认人员</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSendNotification}>
            发送通知
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
