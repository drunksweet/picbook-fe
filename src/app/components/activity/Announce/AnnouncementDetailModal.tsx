"use client"

import { Modal, Button, Divider } from "antd"
import type { AnnouncementData } from "./AnnouncementItem"

interface AnnouncementDetailModalProps {
  visible: boolean
  onCancel: () => void
  announcement: AnnouncementData | null
}

export default function AnnouncementDetailModal({ visible, onCancel, announcement }: AnnouncementDetailModalProps) {
  return (
    <Modal
      title="公告详情"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
      width={600}
    >
      {announcement && (
        <div>
          <h2>{announcement.title}</h2>
          <p style={{ color: "#999", fontSize: "12px" }}>发布时间：{announcement.time}</p>
          <Divider />
          <p style={{ whiteSpace: "pre-wrap" }}>{announcement.content}</p>
        </div>
      )}
    </Modal>
  )
}
