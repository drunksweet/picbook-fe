import { Modal, Button, Divider, Table } from "antd"
import { ActivityData } from "../ActivityCard/ActivityCard"
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
} from "@ant-design/icons"

interface ActivityDetailModalProps {
  visible: boolean
  onCancel: () => void
  activity: ActivityData | null
  signupData: any[]
}

export default function ActivityDetailModal({
  visible,
  onCancel,
  activity,
  signupData,
}: ActivityDetailModalProps) {
  const columns = [
    { title: "序号", dataIndex: "id", key: "id" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "联系方式", dataIndex: "phone", key: "phone" },
    { title: "报名时间", dataIndex: "time", key: "time" },
    { title: "状态", dataIndex: "status", key: "status" },
  ]

  return (
    <Modal
      title="活动详情"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
      width={700}
    >
      {activity && (
        <div>
          <h2>{activity.title}</h2>
          <Divider />
          <p>
            <CalendarOutlined /> 活动时间：{activity.time}
          </p>
          <p>
            <EnvironmentOutlined /> 活动地点：{activity.location}
          </p>
          <p>
            <UserOutlined /> 负责人：{activity.manager}
          </p>
          <p>
            <PhoneOutlined /> 联系方式：{activity.contact}
          </p>
          <p>
            <TeamOutlined /> 参与人数：{activity.currentParticipants}/{activity.maxParticipants}
          </p>
          <Divider />
          <h3>活动描述</h3>
          <p>{activity.description}</p>
          <Divider />
          <h3>报名人员</h3>
          <Table dataSource={signupData} columns={columns} pagination={false} size="small" />
        </div>
      )}
    </Modal>
  )
}
