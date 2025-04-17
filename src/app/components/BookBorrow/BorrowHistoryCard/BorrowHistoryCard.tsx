"use client"

import type React from "react"

import { Card, Typography, Tabs, Tag, Button, Empty } from "antd"
import { ClockCircleOutlined } from "@ant-design/icons"
import TangTable from "@/components/TangTable/TangTable"
import type { ColumnsType } from "antd/es/table"
import type { BorrowRecordItem } from "@/api/books/borrow/borrow"
import "./BorrowHistoryCard.scss"

const { Title } = Typography
const { TabPane } = Tabs

interface BorrowHistoryCardProps {
  borrowRecords: BorrowRecordItem[]
  borrowCurrentPage: number
  borrowTotal: number
  borrowPageSize: number
  borrowLoading: boolean
  activeTab: string
  onTabChange: (activeKey: string) => void
  onPageChange: (page: number, size?: number) => void
  onViewDetail: (record: BorrowRecordItem) => void
}

const BorrowHistoryCard: React.FC<BorrowHistoryCardProps> = ({
  borrowRecords,
  borrowCurrentPage,
  borrowTotal,
  borrowPageSize,
  borrowLoading,
  activeTab,
  onTabChange,
  onPageChange,
  onViewDetail,
}) => {
  // 状态中英映射
  const statusEtoCMap: Record<BorrowRecordItem["return_status"], string> = {
    waiting_return: "待归还",
    returned: "已归还",
    overdue: "已逾期",
  }

  // 状态颜色映射
  const statusColorMap: Record<BorrowRecordItem["return_status"], string> = {
    returned: "green",
    waiting_return: "orange",
    overdue: "red",
  }

  // 借阅历史表格列配置
  const borrowHistoryColumns: ColumnsType<BorrowRecordItem> = [
    { title: "序号", dataIndex: "index", align: "center", width: 60 },
    { title: "副本编号", dataIndex: "copy_id", align: "center", width: 100 },
    { title: "书名", dataIndex: "book_id", align: "center", width: 100 },
    { title: "借阅人", dataIndex: "user_name", align: "center", width: 80 },
    {
      title: "应归还时间",
      dataIndex: "should_return_time",
      align: "center",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "return_status",
      align: "center",
      width: 80,
      render: (return_status: BorrowRecordItem["return_status"]) => (
        <Tag color={statusColorMap[return_status]}>{statusEtoCMap[return_status]}</Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 80,
      render: (_, record) => (
        <Button type="link" style={{ color: "#F59A23", padding: "0" }} onClick={() => onViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <Card className="borrow-history-card" variant="outlined">
      <div className="history-header">
        <ClockCircleOutlined style={{ fontSize: 24, color: "#F59A23" }} />
        <Title level={5} style={{ margin: "0 0 0 8px" }}>
          借阅历史记录
        </Title>
        <Tabs defaultActiveKey="1" className="history-tabs" activeKey={activeTab} onChange={onTabChange}>
          <TabPane tab="待归还记录" key="1"></TabPane>
          <TabPane tab="已逾期记录" key="2"></TabPane>
          <TabPane tab="已归还记录" key="3"></TabPane>
          <TabPane tab="全部记录" key="4"></TabPane>
        </Tabs>
      </div>

      <div className="table-responsive">
      {borrowRecords && borrowRecords.length > 0 ? (
          <TangTable
            columns={borrowHistoryColumns}
            dataSource={borrowRecords}
            currentPage={borrowCurrentPage}
            total={borrowTotal}
            pageSize={borrowPageSize}
            onPageChange={onPageChange}
            scroll={{ x: "max-content", y: 49.8 * 8 }}
            tableProps={{ loading: borrowLoading }}
          />
        ) : (
          <div style={{ padding: "20px 0" }}>
            <Empty description={borrowLoading ? "加载中..." : "暂无数据"} />
          </div>
        )}
      </div>
    </Card>
  )
}

export default BorrowHistoryCard
