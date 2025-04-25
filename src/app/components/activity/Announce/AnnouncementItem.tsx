"use client"

import { Button } from "antd"
import { SoundOutlined } from "@ant-design/icons"
import "./AnnouncementItem.scss"

export interface AnnouncementData {
  id: string
  title: string
  content: string
  time: string
}

interface AnnouncementItemProps {
  announcement: AnnouncementData
  onViewDetail: (announcement: AnnouncementData) => void
}

export default function AnnouncementItem({ announcement, onViewDetail }: AnnouncementItemProps) {
  return (
    <div className="announcement-item" onClick={() => onViewDetail(announcement)} style={{ cursor: "pointer" }}>
      <div className="announcement-icon">
        <SoundOutlined />
      </div>
      <div className="announcement-content">
        <div className="announcement-title">{announcement.title}</div>
        <div className="announcement-text">{announcement.content}</div>
        <div className="announcement-footer">
          <span className="time">{announcement.time}</span>
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(announcement)
            }}
          >
            查看详情
          </Button>
        </div>
      </div>
    </div>
  )
}
