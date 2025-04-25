import { Button, Card, Row, Col, Tag, Input } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import ActivityCard, { ActivityData } from "../ActivityCard/ActivityCard"
import "./ActivityList.scss"

const { Search } = Input

interface ActivityListProps {
  activities: ActivityData[]
  activeTab: string
  onTabChange: (tab: string) => void
  onSearch: (value: string) => void
  onCreateActivity: () => void
  onViewActivityDetail: (activity: ActivityData) => void
  onEditActivity: (activity: ActivityData) => void
  onCancelActivity: (activity: ActivityData) => void
}

export default function ActivityList({
  activities,
  activeTab,
  onTabChange,
  onSearch,
  onCreateActivity,
  onViewActivityDetail,
  onEditActivity,
  onCancelActivity,
}: ActivityListProps) {
  // 过滤活动
  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((activity) => {
          if (activeTab === "signup") return activity.status === "报名中"
          if (activeTab === "ongoing") return activity.status === "进行中"
          if (activeTab === "ended") return activity.status === "已结束"
          return true
        })

  return (
    <Card className="section-card">
      <div className="section-header">
        <div className="tabs-container">
          <Button type={activeTab === "all" ? "primary" : "default"} onClick={() => onTabChange("all")}>
            所有活动
          </Button>
          <Button type={activeTab === "category" ? "primary" : "default"} onClick={() => onTabChange("category")}>
            分类
          </Button>
          <Search placeholder="亲子互动" onSearch={onSearch} style={{ width: 200, marginLeft: 8 }} />
          <div className="status-tags">
            <Tag color={activeTab === "signup" ? "#1890FF" : "default"} onClick={() => onTabChange("signup")}>
              报名中
            </Tag>
            <Tag color={activeTab === "ongoing" ? "#F59A23" : "default"} onClick={() => onTabChange("ongoing")}>
              进行中
            </Tag>
            <Tag color={activeTab === "ended" ? "#FF4D4F" : "default"} onClick={() => onTabChange("ended")}>
              已结束
            </Tag>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateActivity}>
          去创建
        </Button>
      </div>

      <div className="activity-list">
        <Row gutter={[16, 16]}>
          {filteredActivities.map((activity) => (
            <Col span={12} key={activity.id}>
              <ActivityCard
                activity={activity}
                onViewDetail={onViewActivityDetail}
                onEdit={onEditActivity}
                onCancel={onCancelActivity}
              />
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  )
}
