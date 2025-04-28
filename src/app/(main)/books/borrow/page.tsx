"use client"

import { useState, useEffect } from "react"
import { ConfigProvider, App, Row, Col, Form } from "antd"
import Banner from "@/components/banner"
import {
  type BorrowRecordItem,
  type BookItem,
  fetchBorrowRecords,
  searchBooks,
  generateMockBorrowRecords,
  generateMockSearchResults,
} from "@/api/books/borrow/borrow"
import BookSearchForm from "@/components/BookBorrow/BookSearchForm/BookSearchForm"
import BorrowHistoryCard from "@/components/BookBorrow/BorrowHistoryCard/BorrowHistoryCard"
import SearchResultsCard from "@/components/BookBorrow/SearchResultsCard/SearchResultsCard"
import StatisticsCard from "@/components/BookBorrow/StatisticsCard/StatisticsCard"

import "./page.scss"

const BookBorrowPage = () => {
  const { message, modal } = App.useApp()
  const [searchForm] = Form.useForm()

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
  const [searchPageSize, setSearchPageSize] = useState<number>(10)
  const [searchTotal, setSearchTotal] = useState<number>(0)
  const [searchTotalPages, setSearchTotalPages] = useState<number>(0)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  // 获取借阅记录✅
  const getBorrowRecords = async (page = borrowCurrentPage, pageSize = borrowPageSize) => {
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

      console.log("获取借阅记录，参数:", { page, pageSize, queryStatus })

      const result = await fetchBorrowRecords({
        page: page,
        page_size: pageSize,
        query_status: queryStatus,
      })

      if (result.success) {
        console.log("获取借阅记录成功:", result.data)
        setBorrowRecords(result.data!.items)
        setBorrowCurrentPage(result.data!.currentPage)
        setBorrowTotalPages(result.data!.totalPages)
        setBorrowTotal(result.data!.total)
      } else {
        message.error(result.error)

        // 使用模拟数据
        const mockData = generateMockBorrowRecords(pageSize)
        setBorrowRecords(mockData.items)
        setBorrowTotalPages(mockData.totalPages)
        setBorrowTotal(mockData.total)
        setBorrowCurrentPage(page)
      }
    } catch (error) {
      console.error("获取借阅记录失败:", error)
      message.error("获取借阅记录失败，请稍后重试")

      // 使用模拟数据
      const mockData = generateMockBorrowRecords(pageSize)
      setBorrowRecords(mockData.items)
      setBorrowTotalPages(mockData.totalPages)
      setBorrowTotal(mockData.total)
      setBorrowCurrentPage(page)
    } finally {
      setBorrowLoading(false)
    }
  }

  // 搜索图书✅
  const handleSearch = async (page = searchCurrentPage, pageSize = searchPageSize) => {
    const formValues = searchForm.getFieldsValue()
    setSearchLoading(true)

    try {
      console.log("搜索图书，参数:", { ...formValues, page, pageSize })

      const result = await searchBooks({
        ...formValues,
        page: page,
        page_size: pageSize,
      })

      if (result.success) {
        console.log("搜索图书成功:", result.data)
        setSearchResults(result.data!.items)
        setSearchCurrentPage(result.data!.currentPage)
        setSearchTotalPages(result.data!.totalPages)
        setSearchTotal(result.data!.total)
      } else {
        message.error(result.error)

        // 使用模拟数据
        const mockData = generateMockSearchResults(pageSize)
        setSearchResults(mockData.items)
        setSearchTotalPages(mockData.totalPages)
        setSearchTotal(mockData.total)
        setSearchCurrentPage(page)
      }
    } catch (error) {
      console.error("搜索图书失败:", error)
      message.error("搜索图书失败，请稍后重试")

      // 使用模拟数据
      const mockData = generateMockSearchResults(pageSize)
      setSearchResults(mockData.items)
      setSearchTotalPages(mockData.totalPages)
      setSearchTotal(mockData.total)
      setSearchCurrentPage(page)
    } finally {
      setSearchLoading(false)
    }
  }

  // 处理查看详情✅
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

  // 处理借阅记录分页变化
  const handleBorrowPageChange = (page: number, size?: number) => {
    const newPageSize = size || borrowPageSize

    // 更新状态
    setBorrowCurrentPage(page)
    if (size) setBorrowPageSize(newPageSize)

    // 直接传递新的页码和页面大小给数据获取函数
    getBorrowRecords(page, newPageSize)
  }

  // 处理搜索结果分页变化
  const handleSearchPageChange = (page: number, size?: number) => {
    const newPageSize = size || searchPageSize

    // 更新状态
    setSearchCurrentPage(page)
    if (size) setSearchPageSize(newPageSize)

    // 直接传递新的页码和页面大小给数据获取函数
    handleSearch(page, newPageSize)
  }

  // 处理标签页切换
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey)
    // 切换标签页时重置为第一页
    setBorrowCurrentPage(1)
  }

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields() // 重置表单字段
    setSearchCurrentPage(1) // 重置页码到第一页
    handleSearch(1, searchPageSize) // 使用重置后的表单值执行搜索
  }

  // 处理统计周期变化
  const handlePeriodChange = (value: string) => {
    console.log("统计周期变化:", value)
    // 这里可以添加获取不同周期统计数据的逻辑
  }

  // 初始加载数据
  useEffect(() => {
    getBorrowRecords(1, borrowPageSize)
  }, [activeTab])

  // 初始加载搜索数据
  useEffect(() => {
    handleSearch(1, searchPageSize)
  }, [])

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
              <BookSearchForm
                form={searchForm}
                onSearch={() => handleSearch(1, searchPageSize)}
                onReset={handleReset}
                loading={searchLoading}
              />
              <SearchResultsCard
                searchResults={searchResults}
                searchCurrentPage={searchCurrentPage}
                searchTotal={searchTotal}
                searchPageSize={searchPageSize}
                searchLoading={searchLoading}
                onPageChange={handleSearchPageChange}
              />
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
              <StatisticsCard onPeriodChange={handlePeriodChange} />
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default BookBorrowPage
