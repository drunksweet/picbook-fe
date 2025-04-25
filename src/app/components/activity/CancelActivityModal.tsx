import { Modal } from "antd"
import type { ActivityData } from "./ActivityCard"

interface CancelActivityModalProps {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  activity: ActivityData | null
}

export default function CancelActivityModal({ visible, onCancel, onOk, activity }: CancelActivityModalProps) {
  return (
    <Modal title="取消活动" open={visible} onOk={onOk} onCancel={onCancel} okText="确认取消" cancelText="返回">
      <p>您确定要取消"{activity?.title}"活动吗？</p>
      <p>取消后将通知所有已报名人员，且无法恢复。</p>
    </Modal>
  )
}
