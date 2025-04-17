"use client"

import type React from "react"

import { Card, Typography, Button } from "antd"
import TangTable from "@/components/TangTable/TangTable"
import type { ColumnsType } from "antd/es/table"
import type { BookItem } from "@/api/books/borrow/borrow"
import "./SearchResultsCard.scss"

const { Title } = Typography

interface SearchResultsCardProps {
  searchResults: BookItem[]
  searchCurrentPage: number
  searchTotal: number
  searchPageSize: number
  searchLoading: boolean
  selectedRowKeys: React.Key[]
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: BookItem[]) => void
  onPageChange: (page: number, size?: number) => void
  onBorrow: () => void
  onCancel: () => void
}

const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  searchResults,
  searchCurrentPage,
  searchTotal,
  searchPageSize,
  searchLoading,
  selectedRowKeys,
  onSelectChange,
  onPageChange,
  onBorrow,
  onCancel,
}) => {
  // 类别中英映射
  const categoryEToCMap: Record<BookItem["category"], string> = {
    children_story: "儿童故事",
    science_knowledge: "科普知识",
    art_enlightenment: "艺术启蒙",
  }

  // 搜索结果表格列配置
  const searchResultColumns: ColumnsType<BookItem> = [
    { title: "序号", dataIndex: "index", align: "center", width: 60 },
    { title: "副本编号", dataIndex: "copy_id", align: "center", width: 100 },
    { title: "书名", dataIndex: "name", align: "center", width: 100 },
    {
      title: "类别",
      dataIndex: "category",
      align: "center",
      width: 100,
      render: (category: BookItem["category"]) => <span>{categoryEToCMap[category]}</span>,
    },
    { title: "出版社", dataIndex: "publisher", align: "center", width: 100 },
    { title: "作者", dataIndex: "author", align: "center", width: 80 },
  ]

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Card className="search-results-card" variant="outlined">
      <div className="results-header">
        <Title level={5} style={{ color: "#F59A23", marginBottom: 12 }}>
          结果：
        </Title>
      </div>
      <div className="table-responsive">
        <TangTable
          columns={searchResultColumns}
          dataSource={searchResults}
          currentPage={searchCurrentPage}
          total={searchTotal}
          pageSize={searchPageSize}
          onPageChange={onPageChange}
          scroll={{ x: "max-content", y: 49 * 2 }}
          tableProps={{
            loading: searchLoading,
            rowSelection: rowSelection,
            bordered: true,
          }}
        />
      </div>
      <div className="action-buttons">
        <Button type="primary" onClick={onBorrow} disabled={selectedRowKeys.length === 0} className="borrow-button">
          借阅
        </Button>
        <Button onClick={onCancel}>取 消</Button>
      </div>
    </Card>
  )
}

export default SearchResultsCard
