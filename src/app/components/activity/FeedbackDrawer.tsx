"use client"

import { Drawer, Space, Button, List, message } from "antd"

interface FeedbackDrawerProps {
  visible: boolean
  onClose: () => void
  feedbackData: any[]
}

export default function FeedbackDrawer({ visible, onClose, feedbackData }: FeedbackDrawerProps) {
  return (
    <Drawer
      title="用户反馈"
      width={700}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>关闭</Button>
        </Space>
      }
    >
      <List
        itemLayout="vertical"
        dataSource={feedbackData}
        pagination={{ pageSize: 5 }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            extra={
              <Button type="link" onClick={() => message.success(`已回复${item.user}的反馈`)}>
                回复
              </Button>
            }
          >
            <List.Item.Meta title={`${item.user}对"${item.activity}"的反馈`} description={item.time} />
            {item.content}
          </List.Item>
        )}
      />
    </Drawer>
  )
}
