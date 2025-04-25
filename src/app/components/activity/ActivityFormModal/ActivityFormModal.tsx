import { Modal, Form, Input, Select, DatePicker, TimePicker, InputNumber, Row, Col } from "antd"
import { ActivityData } from "../ActivityCard/ActivityCard"
import { FormInstance } from "antd/lib/form"
import dayjs from "dayjs"

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
        <Form.Item name="title" label="活动名称" rules={[{ required: true, message: "请输入活动名称" }]}>
          <Input placeholder="请输入活动名称" />
        </Form.Item>

        <Form.Item name="type" label="活动类型" rules={[{ required: true, message: "请选择活动类型" }]}>
          <Select placeholder="请选择活动类型">
            <Option value="亲子互动">亲子互动</Option>
            <Option value="休闲娱乐">休闲娱乐</Option>
            <Option value="文体活动">文体活动</Option>
            <Option value="知识讲座">知识讲座</Option>
            <Option value="志愿服务">志愿服务</Option>
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
            <Form.Item name="contact" label="联系方式" rules={[{ required: true, message: "请输入联系方式" }]}>
              <Input placeholder="请输入联系方式" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="location" label="活动地点" rules={[{ required: true, message: "请输入活动地点" }]}>
          <Input placeholder="请输入活动地点" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maxParticipants"
              label="最大参与人数"
              rules={[{ required: true, message: "请输入最大参与人数" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="活动描述">
          <TextArea rows={4} placeholder="请输入活动描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
