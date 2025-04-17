"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ConfigProvider, App, Row, Col, Form } from "antd"
import { useRouter } from "next/navigation"
import Banner from "@/components/banner"
import {
  type BorrowRecordItem,
  type BookItem,
  fetchBorrowRecords,
  searchBooks,
  borrowBook,
  generateMockBorrowRecords,
  generateMockSearchResults,
} from "@/api/books/borrow/borrow"

// 导入拆分后的组件
import BorrowerInfoCard from "@/components/BookBorrow/BorrowerInfoCard/BorrowerInfoCard"
import BookSearchForm from "@/components/BookBorrow/BookSearchForm/BookSearchForm"
import BorrowHistoryCard from "@/components/BookBorrow/BorrowHistoryCard/BorrowHistoryCard"
import SearchResultsCard from "@/components/BookBorrow/SearchResultsCard/SearchResultsCard"
import StatisticsCard from "@/components/BookBorrow/StatisticsCard/StatisticsCard"

import "./page.scss"

const BookBorrowPage = () => {
  const { message, modal } = App.useApp()
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const router = useRouter()

  // 借阅记录状态
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecordItem[]>([])
  const [borrowCurrentPage, setBorrowCurrentPage] = useState<number>(1)
  const [borrowPageSize, setBorrowPageSize] = useState<number>(10)
  const [borrowTotal, setBorrowTotal] = useState<number>(0)
  const [borrowTotalPages, setBorrowTotalPages] = useState<number>(0)
  const [borrowLoading, setBorrowLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("1")

  // 搜索结果状态
  const [searchResults, setSearchResults] = useState<BookItem[]>([])
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1)
  const [searchPageSize, setSearchPageSize] = useState<number>(5)
  const [searchTotal, setSearchTotal] = useState<number>(0)
  const [searchTotalPages, setSearchTotalPages] = useState<number>(0)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedBooks, setSelectedBooks] = useState<BookItem[]>([])

  // 用户信息状态
  const [userId, setUserId] = useState<string>("")

  // 获取借阅记录
  const getBorrowRecords = async () => {
    setBorrowLoading(true)
    try {
      let queryStatus = ""
      switch (activeTab) {
        case "1":
          queryStatus = "waiting_return"
          break
        case "2":
          queryStatus = "overdue"
          break
        case "3":
          queryStatus = "returned"
          break
        default:
          queryStatus = ""
      }

      const result = await fetchBorrowRecords({
        page: borrowCurrentPage,
        page_size: borrowPageSize,
        query_status: queryStatus,
      })

      if (result.success) {
        setBorrowRecords(result.data!.items)
        setBorrowCurrentPage(result.data!.currentPage)
        setBorrowTotalPages(result.data!.totalPages)
        setBorrowTotal(result.data!.total)
      } else {
        message.error(result.error)

        // 如果需要登录，跳转到登录页
        if (result.needLogin) {
          router.push("/login")
          return
        }

        // 使用模拟数据
        const mockData = generateMockBorrowRecords(borrowPageSize)
        setBorrowRecords(mockData.items)
        setBorrowTotalPages(mockData.totalPages)
        setBorrowTotal(mockData.total)
      }
    } catch (error) {
      console.error("获取借阅记录失败:", error)
      message.error("获取借阅记录失败，请稍后重试")

      // 使用模拟数据
      const mockData = generateMockBorrowRecords(borrowPageSize)
      setBorrowRecords(mockData.items)
      setBorrowTotalPages(mockData.totalPages)
      setBorrowTotal(mockData.total)
    } finally {
      setBorrowLoading(false)
    }
  }

  // 搜索图书
  const handleSearch = async () => {
    const formValues = searchForm.getFieldsValue()
    setSearchLoading(true)

    try {
      const result = await searchBooks({
        ...formValues,
        page: searchCurrentPage,
        page_size: searchPageSize,
      })

      if (result.success) {
        setSearchResults(result.data!.items)
        setSearchCurrentPage(result.data!.currentPage)
        setSearchTotalPages(result.data!.totalPages)
        setSearchTotal(result.data!.total)
      } else {
        message.error(result.error)

        // 如果需要登录，跳转到登录页
        if (result.needLogin) {
          router.push("/login")
          return
        }

        // 使用模拟数据
        const mockData = generateMockSearchResults(searchPageSize)
        setSearchResults(mockData.items)
        setSearchTotalPages(mockData.totalPages)
        setSearchTotal(mockData.total)
      }
    } catch (error) {
      console.error("搜索图书失败:", error)
      message.error("搜索图书失败，请稍后重试")

      // 使用模拟数据
      const mockData = generateMockSearchResults(searchPageSize)
      setSearchResults(mockData.items)
      setSearchTotalPages(mockData.totalPages)
      setSearchTotal(mockData.total)
    } finally {
      setSearchLoading(false)
    }
  }

  // 处理借阅
  const handleBorrow = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要借阅的图书")
      return
    }

    const userInfo = form.getFieldsValue()
    if (!userInfo.user_name || !userInfo.contact) {
      message.warning("请填写借阅者信息")
      return
    }

    try {
      // 这里应该调用借阅API
      // 简化处理，实际应该循环处理多本书
      const selectedBook = selectedBooks[0]
      const result = await borrowBook(selectedBook.copy_id, userId || "mock_user_id")

      if (result.success) {
        message.success("借阅成功")
        setSelectedRowKeys([])
        setSelectedBooks([])
        // 刷新借阅记录
        getBorrowRecords()
      } else {
        message.error(result.error || "借阅失败")
      }
    } catch (error) {
      console.error("借阅图书失败:", error)
      message.error("借阅图书失败，请稍后重试")
    }
  }

  // 处理查看详情
  const handleViewDetail = (record: BorrowRecordItem) => {
    const statusEtoCMap: Record<BorrowRecordItem["return_status"], string> = {
      waiting_return: "待归还",
      returned: "已归还",
      overdue: "已逾期",
    }

    modal.info({
      title: "借阅详情",
      content: (
        <div>
          <p>副本编号: {record.copy_id}</p>
          <p>书本编号: {record.book_id}</p>
          <p>借阅人: {record.user_name}</p>
          <p>借阅人ID: {record.user_id}</p>
          <p>应归还时间: {record.should_return_time}</p>
          <p>状态: {statusEtoCMap[record.return_status]}</p>
        </div>
      ),
    })
  }

  // 处理表格选择变化
  const handleSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: BookItem[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedBooks(selectedRows)
  }

  // 处理借阅记录分页变化
  const handleBorrowPageChange = (page: number, size?: number) => {
    const newPageSize = size || borrowPageSize
    setBorrowCurrentPage(page)
    if (size) setBorrowPageSize(size)

    // 重新获取数据
    getBorrowRecords()
  }

  // 处理搜索结果分页变化
  const handleSearchPageChange = (page: number, size?: number) => {
    const newPageSize = size || searchPageSize
    setSearchCurrentPage(page)
    if (size) setSearchPageSize(size)

    // 重新搜索
    handleSearch()
  }

  // 处理标签页切换
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey)
  }

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields()
  }

  // 处理统计周期变化
  const handlePeriodChange = (value: string) => {
    console.log("统计周期变化:", value)
    // 这里可以添加获取不同周期统计数据的逻辑
  }

  // 处理取消选择
  const handleCancelSelection = () => {
    setSelectedRowKeys([])
    setSelectedBooks([])
  }

  // 初始加载数据
  useEffect(() => {
    getBorrowRecords()
  }, [activeTab])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F59A23",
          colorLink: "#F59A23",
        },
      }}
    >
      <Banner title="绘本管理-绘本借阅" />
      <div className="book-borrow-container">
        <div className="page-content">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <BorrowerInfoCard form={form} />
                </Col>
                <Col span={24}>
                  <BookSearchForm
                    form={searchForm}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    loading={searchLoading}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <BorrowHistoryCard
                borrowRecords={borrowRecords}
                borrowCurrentPage={borrowCurrentPage}
                borrowTotal={borrowTotal}
                borrowPageSize={borrowPageSize}
                borrowLoading={borrowLoading}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onPageChange={handleBorrowPageChange}
                onViewDetail={handleViewDetail}
              />
            </Col>

            <Col span={12}>
              <SearchResultsCard
                searchResults={searchResults}
                searchCurrentPage={searchCurrentPage}
                searchTotal={searchTotal}
                searchPageSize={searchPageSize}
                searchLoading={searchLoading}
                selectedRowKeys={selectedRowKeys}
                onSelectChange={handleSelectChange}
                onPageChange={handleSearchPageChange}
                onBorrow={handleBorrow}
                onCancel={handleCancelSelection}
              />
            </Col>
            <Col span={12}>
              <StatisticsCard onPeriodChange={handlePeriodChange} />
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default BookBorrowPage
