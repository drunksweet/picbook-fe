"use client"

import type React from "react"

import { Card, Typography, Form, Input, Row, Col } from "antd"
import "./BorrowerInfoCard.scss"

const { Title } = Typography

interface BorrowerInfoCardProps {
  form: any // Form实例
}

const BorrowerInfoCard: React.FC<BorrowerInfoCardProps> = ({ form }) => {
  return (
    <Card className="borrower-info-card" variant="outlined">
      <Title level={5} style={{ color: "#F59A23", marginBottom: 8 }}>
        借阅者信息
      </Title>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="姓名" name="user_name" rules={[{ required: true, message: "请输入姓名" }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="联系方式" name="contact" rules={[{ required: true, message: "请输入联系方式" }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default BorrowerInfoCard
