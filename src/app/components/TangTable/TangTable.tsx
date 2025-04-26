"use client"

import { useState } from "react"
import { Pagination, Table } from "antd"
import type { ColumnsType, TableProps } from "antd/es/table"
import type { PaginationProps } from "antd/es/pagination"

// currentPage pageSize 如果是外部传入 则表示是 受控Table，dataSource为当前页面的数据（需要外部切片数据），需要传入onPageChange函数，
// 否则 全部由默认处理 dataSource为原始所有数据

// 其他参数用来定制table的常规配置
// columns 为 表格列配置

// Generic type for table data
export interface TangTableProps<T extends object = any> {
  //具体看antd
  // 配置 table
  // 表格列配置
  columns: ColumnsType<T>
  // 数据数组
  dataSource: T[]
  // 表格是否可滚动，也可以指定滚动区域的宽、高
  scroll?: { x?: number | string | true; y?: number | string }
  // 表格大小
  tableSize?: "large" | "middle" | "small"

  // 配置pagination
  // Total number of items (for pagination)
  total?: number
  // Whether to show pagination
  showPagination?: boolean
  // Custom pagination props
  paginationProps?: PaginationProps
  // Controlled pagination values
  currentPage?: number
  pageSize?: number
  // Pagination change handlers
  onPageChange?: (page: number, pageSize?: number) => void
  // Additional table props
  tableProps?: Omit<TableProps<T>, "columns" | "dataSource" | "pagination" | "scroll" | "size">
  // Whether to show borders
  bordered?: boolean
  // 是否正在加载
  loading?: boolean
}

export default function TangTable<T extends object = any>({
  columns,
  dataSource,
  scroll,
  tableSize = "small",
  total,
  showPagination = true,
  paginationProps,
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  onPageChange,
  tableProps,
  bordered = false,
  loading = false,
}: TangTableProps<T>) {
  // Internal pagination state (used if not controlled externally)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(10)

  // Determine if pagination is controlled externally
  const isControlled = externalCurrentPage !== undefined && onPageChange !== undefined

  // Use either external or internal pagination values
  const currentPage = isControlled ? externalCurrentPage : internalCurrentPage
  const pageSize = externalPageSize || internalPageSize

  // 只在非受控模式下对数据进行切片
  const displayData = isControlled
    ? dataSource // 受控模式：直接使用传入的数据（已经是当前页的数据）
    : dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize) // 非受控模式：对数据进行切片

  // 调试信息
  console.log("TangTable渲染:", {
    isControlled,
    currentPage,
    pageSize,
    total: total || dataSource.length,
    dataSourceLength: dataSource.length,
    displayDataLength: displayData.length,
  })

  // Handle pagination changes
  const handlePaginationChange = (page: number, size?: number) => {
    const newSize = size || pageSize

    if (isControlled) {
      // 受控模式：调用外部传入的onPageChange回调
      if (onPageChange) {
        console.log("调用外部onPageChange:", page, newSize)
        onPageChange(page, newSize)
      }
    } else {
      // 非受控模式：更新内部状态
      setInternalCurrentPage(page)
      if (size !== undefined && size !== pageSize) {
        setInternalPageSize(size)
      }
    }
  }

  // Calculate total if not provided
  const calculatedTotal = total !== undefined ? total : dataSource.length

  // Pagination component
  const paginationComponent = showPagination ? (
    <Pagination
      align="center"
      current={currentPage}
      defaultCurrent={1}
      pageSize={pageSize}
      total={calculatedTotal}
      showSizeChanger
      showQuickJumper
      size="small"
      showTotal={(total) => `共 ${total} 条`}
      onChange={handlePaginationChange}
      onShowSizeChange={(current, size) => {
        handlePaginationChange(1, size)
      }}
      {...paginationProps}
    />
  ) : null

  return (
    <div className="Tang-table-container">
      <Table<T>
        bordered={bordered}
        columns={columns}
        dataSource={displayData}
        scroll={scroll}
        pagination={false}
        size={tableSize}
        loading={loading}
        {...tableProps}
      />
      {paginationComponent}
    </div>
  )
}
