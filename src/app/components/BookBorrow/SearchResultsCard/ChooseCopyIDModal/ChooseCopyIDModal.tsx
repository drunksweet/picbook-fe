"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Modal, Form, Input, ConfigProvider, DatePicker, Row, Col, Button, App, Empty, Table } from "antd"
import TangTable from "@/components/TangTable/TangTable"
import type { ColumnsType } from "antd/es/table"
import type { BookItem, CopyIdItem } from "@/api/books/borrow/borrow"
import { getAvailableCopies, borrowBookWithCopyId } from "@/api/books/borrow/borrow"
import dayjs from "dayjs"

interface ChooseCopyIDModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  record?: BookItem
}

const ChooseCopyIDModal: React.FC<ChooseCopyIDModalProps> = ({ visible, onCancel, onSuccess, record }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  // 副本列表状态
  const [copyIds, setCopyIds] = useState<CopyIdItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedCopyId, setSelectedCopyId] = useState<number | null>(null)

  // 当记录变化时重置表单和状态
  useEffect(() => {
    if (visible && record) {
      form.resetFields()
      setCurrentPage(1)
      setCopyIds([])
      setSelectedRowKeys([])
      setSelectedCopyId(null)

      // 加载可借用副本
      fetchAvailableCopies()
    }
  }, [visible, record, form])

  // 获取可借用副本
  const fetchAvailableCopies = async () => {
    if (!record?.book_id) return

    setLoading(true)
    try {
      const result = await getAvailableCopies({
        book_id: record.book_id,
        page: currentPage,
        page_size: pageSize,
      })

      if (result.success) {
        setCopyIds((prev) => (currentPage === 1 ? result.data!.items : [...prev, ...result.data!.items]))
        setHasNextPage(result.data!.hasNextPage)
      } else {
        message.error(result.error || "获取可借用副本失败")
      }
    } catch (error) {
      console.error("获取可借用副本失败:", error)
      message.error("获取可借用副本失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  // 加载更多
  const loadMore = () => {
    if (loading || !hasNextPage) return
    setCurrentPage((prev) => prev + 1)
  }

  // 监听页码变化，加载数据
  useEffect(() => {
    if (visible && record) {
      fetchAvailableCopies()
    }
  }, [currentPage, pageSize, record?.book_id?.toString(), visible])

  // 副本ID表格列配置
  const copyIdColumns: ColumnsType<CopyIdItem> = [
    { title: "序号", dataIndex: "index", align: "center", width: 60 },
    { title: "副本编号", dataIndex: "copy_id", align: "center" },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleSelectCopyId(record)}
          style={{ color: selectedCopyId === record.copy_id ? "#52c41a" : "#F59A23" }}
        >
          {selectedCopyId === record.copy_id ? "已选择" : "选择"}
        </Button>
      ),
    },
  ]

  // 选择副本ID
  const handleSelectCopyId = (record: CopyIdItem) => {
    setSelectedCopyId(record.copy_id)
    setSelectedRowKeys([record.key])
  }

  // 表格行选择变化
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: CopyIdItem[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    if (selectedRows.length > 0) {
      setSelectedCopyId(selectedRows[0].copy_id)
    } else {
      setSelectedCopyId(null)
    }
  }

  // 表格行选择配置
  const rowSelection = {
    type: "radio" as const,
    selectedRowKeys,
    onChange: onSelectChange,
  }

  // 处理表单提交
  const handleSubmit = async () => {
    if (!selectedCopyId) {
      message.warning("请选择一个副本")
      return
    }

    try {
      const values = await form.validateFields()
      setSubmitting(true)

      // 格式化日期
      const expectedReturnTime = values.expected_return_time.format("YYYY-MM-DD")

      // 调用借阅API
      const result = await borrowBookWithCopyId({
        book_id: record?.book_id || "",
        borrower_id: values.borrower_id,
        copy_id: selectedCopyId,
        expected_return_time: expectedReturnTime,
      })

      if (result.success) {
        message.success("借阅成功")
        onSuccess()
        onCancel()
      } else {
        message.error(result.error || "借阅失败")
      }
    } catch (error) {
      console.error("提交表单时出错:", error)
      message.error("提交表单时出错，请稍后重试")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            titleColor: "#F59A23",
          },
        },
      }}
    >
      <Modal
        width={800}
        title={`填写借阅信息 - ${record?.name || ""}`}
        open={visible}
        onCancel={onCancel}
        onOk={handleSubmit}
        okText="借阅"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 4]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="借阅者编号"
                name="borrower_id"
                rules={[{ required: true, message: "请输入借阅者编号" }]}
              >
                <Input placeholder="请输入借阅者编号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="预计归还时间"
                name="expected_return_time"
                rules={[{ required: true, message: "请选择预计归还时间" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="请选择日期"
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <h3>选择可借用副本：</h3>
        </div>

        {copyIds.length > 0 ? (
          <TangTable
            columns={copyIdColumns}
            dataSource={copyIds}
            currentPage={1}
            total={copyIds.length}
            pageSize={copyIds.length}
            onPageChange={() => {}}
            scroll={{ x: "max-content", y: 200 }}
            tableProps={{
              loading: loading,
              rowSelection: rowSelection,
              bordered: true,
            //   pagination: false,
              onRow: (record) => ({
                onClick: () => handleSelectCopyId(record),
              }),
            }}
          />
        ) : (
          <Empty description={loading ? "加载中..." : "暂无可借用副本"} style={{ margin: "20px 0" }} />
        )}

        {hasNextPage && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button onClick={loadMore} loading={loading}>
              加载更多
            </Button>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  )
}

export default ChooseCopyIDModal
