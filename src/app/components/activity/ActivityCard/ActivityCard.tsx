import { Button } from "antd"
import "./ActivityCard.scss"

export interface ActivityData {
  id: string
  title: string
  type: string
  time: string
  manager: string
  contact: string
  location: string
  status: string
  maxParticipants: number
  currentParticipants: number
  description: string
}

interface ActivityCardProps {
  activity: ActivityData
  onViewDetail: (activity: ActivityData) => void
  onEdit: (activity: ActivityData) => void
  onCancel: (activity: ActivityData) => void
}

export default function ActivityCard({ activity, onViewDetail, onEdit, onCancel }: ActivityCardProps) {
  // 根据状态获取活动卡片的样式类名
  const getActivityCardClass = (status: string) => {
    switch (status) {
      case "报名中":
        return "activity-card signup"
      case "进行中":
        return "activity-card ongoing"
      case "已结束":
        return "activity-card ended"
      case "已取消":
        return "activity-card ended"
      default:
        return "activity-card"
    }
  }

  return (
    <div
      className={getActivityCardClass(activity.status)}
      onClick={() => onViewDetail(activity)}
      style={{ cursor: "pointer" }}
    >
      <div className="activity-header">
        <div className="activity-title">活动名称：{activity.title}</div>
        <div className="activity-status">{activity.status}</div>
      </div>
      <div className="activity-info">
        <div className="info-item">
          <span className="label">事件类型：</span>
          <span className="value">{activity.type}</span>
        </div>
        <div className="info-item">
          <span className="label">活动时间：</span>
          <span className="value">{activity.time}</span>
        </div>
        <div className="info-item">
          <span className="label">负责人：</span>
          <span className="value">{activity.manager}</span>
        </div>
        <div className="info-item">
          <span className="label">联系方式：</span>
          <span className="value">{activity.contact}</span>
        </div>
        <div className="info-item">
          <span className="label">活动地点：</span>
          <span className="value">{activity.location}</span>
        </div>
      </div>
      <div className="activity-actions">
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(activity)
          }}
        >
          修改
        </Button>
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation()
            onCancel(activity)
          }}
        >
          取消
        </Button>
      </div>
    </div>
  )
}
