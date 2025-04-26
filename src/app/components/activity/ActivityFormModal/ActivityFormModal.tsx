import { Modal, Form, Input, Select, DatePicker, TimePicker, Row, Col } from "antd"
import type { ActivityData } from "../ActivityCard/ActivityCard"
import type { FormInstance } from "antd/lib/form"

const { TextArea } = Input
const { Option } = Select

interface ActivityFormModalProps {
  title: string
  visible: boolean
  onCancel: () => void
  onOk: () => void
  form: FormInstance
  initialValues?: ActivityData
}

export default function ActivityFormModal({
  title,
  visible,
  onCancel,
  onOk,
  form,
  initialValues,
}: ActivityFormModalProps) {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={700}
      okText={initialValues ? "保存" : "创建"}
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="activity_name" label="活动名称" rules={[{ required: true, message: "请输入活动名称" }]}>
          <Input placeholder="请输入活动名称" />
        </Form.Item>

        <Form.Item name="activity_type" label="活动类型" rules={[{ required: true, message: "请选择活动类型" }]}>
          <Select placeholder="请选择活动类型">
            <Option value="parent_child_interactions">亲子互动</Option>
            <Option value="handmade_diy">手工DIY</Option>
            <Option value="theme_experience">主题体验</Option>
            <Option value="role_play">角色扮演</Option>
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="date" label="活动日期" rules={[{ required: true, message: "请选择活动日期" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="timeRange" label="活动时间" rules={[{ required: true, message: "请选择活动时间" }]}>
              <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="manager" label="负责人" rules={[{ required: true, message: "请输入负责人姓名" }]}>
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="联系方式" rules={[{ required: true, message: "请输入联系方式" }]}>
              <Input placeholder="请输入联系方式" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="addr" label="活动地点" rules={[{ required: true, message: "请输入活动地点" }]}>
          <Input placeholder="请输入活动地点" />
        </Form.Item>

        <Form.Item name="description" label="活动描述">
          <TextArea rows={4} placeholder="请输入活动描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
