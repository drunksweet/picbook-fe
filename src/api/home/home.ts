import axiosInstance from "../axios"

// 定义响应数据接口
export interface HomeDataResponse {
  active_users: number
  avg_borrow_duration: number
  hot_book: string
  low_stock_count: number
  month_borrowed: number
  monthly_borrowed: Array<{
    borrow_count: number
    month: string
  }>
  new_users: number
  overdue_books: number
  today_borrowed: number
  total_stock: number
}

// 定义API响应接口
interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 获取首页数据的API函数
export const getHomeData = async (): Promise<HomeDataResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<HomeDataResponse>>("/v1/home/get_statics")

    // 检查响应状态
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("获取首页数据失败:", response.data.msg)
      throw new Error(response.data.msg || "获取数据失败")
    }
  } catch (error) {
    console.error("获取首页数据失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      active_users: 0,
      avg_borrow_duration: 0,
      hot_book: "暂无数据",
      low_stock_count: 0,
      month_borrowed: 0,
      monthly_borrowed: [],
      new_users: 0,
      overdue_books: 0,
      today_borrowed: 0,
      total_stock: 0,
    }
  }
}
