import { Modal, Form, Input } from "antd"
import type { FormInstance } from "antd/lib/form"

const { TextArea } = Input

interface AnnouncementFormModalProps {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  form: FormInstance
}

export default function AnnouncementFormModal({ visible, onCancel, onOk, form }: AnnouncementFormModalProps) {
  return (
    <Modal title="发布公告" open={visible} onOk={onOk} onCancel={onCancel} width={700} okText="发布" cancelText="取消">
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="公告标题" rules={[{ required: true, message: "请输入公告标题" }]}>
          <Input placeholder="请输入公告标题" />
        </Form.Item>

        <Form.Item name="content" label="公告内容" rules={[{ required: true, message: "请输入公告内容" }]}>
          <TextArea rows={6} placeholder="请输入公告内容" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
