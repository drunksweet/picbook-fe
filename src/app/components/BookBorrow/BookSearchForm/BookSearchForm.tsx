"use client"

import type React from "react"

import { Card, Typography, Form, Input, Select, DatePicker, Button, Row, Col, Space } from "antd"
import { SearchOutlined, RedoOutlined } from "@ant-design/icons"
import "./BookSearchForm.scss"

const { Title } = Typography
const { Option } = Select

interface BookSearchFormProps {
  form: any // Form实例
  onSearch: () => void
  onReset: () => void
  loading: boolean
}

const BookSearchForm: React.FC<BookSearchFormProps> = ({ form, onSearch, onReset, loading }) => {
  return (
    <Card className="book-search-form" variant="outlined" >
      <Title level={5} style={{ color: "#F59A23"}}>
        绘本信息
      </Title>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="绘本编号" name="book_id">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="类型" name="category">
              <Select placeholder="请选择" allowClear>
                <Option value="children_story">儿童故事</Option>
                <Option value="science_knowledge">科普知识</Option>
                <Option value="art_enlightenment">艺术启蒙</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{marginTop: '-16px'}}>
            <Form.Item label="书名" name="name">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{marginTop: '-16px'}}>
            <Form.Item label="作者" name="author">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "right",marginTop: '-16px' }}>
            <Space>
              <Button type="primary" icon={<RedoOutlined />} onClick={onReset}>
                重置
              </Button>
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch} loading={loading}>
                搜索
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default BookSearchForm
