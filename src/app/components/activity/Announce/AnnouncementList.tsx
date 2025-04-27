"use client"

import { Button, Card } from "antd"
import AnnouncementItem, { type AnnouncementData } from "./AnnouncementItem"
import "./AnnouncementList.scss"

interface AnnouncementListProps {
  announcements: AnnouncementData[]
  onCreateAnnouncement: () => void
  onViewMore: () => void
  onViewDetail: (announcement: AnnouncementData) => void
}

export default function AnnouncementList({
  announcements,
  onCreateAnnouncement,
  onViewMore,
  onViewDetail,
}: AnnouncementListProps) {
  return (
    <Card className="annouce-card">
      <div className="section-header">
        <h3>通知公告</h3>
        <div>
          <Button type="primary" onClick={onCreateAnnouncement}>
            去发布
          </Button>
          <Button type="link" onClick={onViewMore}>
            更多
          </Button>
        </div>
      </div>
      <div className="announcement-list">
        {announcements.map((announcement) => (
          <AnnouncementItem key={announcement.id} announcement={announcement} onViewDetail={onViewDetail} />
        ))}
      </div>
    </Card>
  )
}
