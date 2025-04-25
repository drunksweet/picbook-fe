import axios from "src/api/axios"
import { message } from "antd"

// 捐赠记录接口
export interface DonationRecord {
  book_name: string
  donate_num: number
  donate_time: string
  phone: string
  user_id: number
  user_name: string
}

// 捐赠记录响应接口
export interface DonationResponse {
  code: number
  data: {
    current_page: number
    donate_records: DonationRecord[]
    total_num: number
    total_page: number
  }
  msg: string
}

// 排名统计接口
export interface RankingRecord {
  donate_num: number
  donate_times: number
  updated_at: string
  user_id: number
  user_name: string
}

// 排名统计响应接口
export interface RankingResponse {
  code: number
  data: {
    rankings: RankingRecord[]
  }
}

/**
 * 获取捐赠记录
 * @param page 页码
 * @param pageSize 每页条数
 * @returns 处理后的响应数据
 */
export const fetchDonationRecords = async (page: number, pageSize: number) => {
  try {


    // 修正API路径和参数名称
    const res = await axios.get<DonationResponse>("/v1/book/donate/list", {
      params: {
        page,
        page_size: pageSize, // 确保参数名称正确
      },
    })

    if (res.data.code === 0 || res.data.code === 200) {
      // 处理数据，添加key和index
      const processedData = res.data.data.donate_records.map((item, index) => ({
        ...item,
        key: index.toString(),
        index: (res.data.data.current_page - 1) * pageSize + index + 1,
        // 添加默认状态，因为API返回的数据中可能没有状态字段
        status: "在库",
      }))

      return {
        success: true,
        data: {
          items: processedData,
          currentPage: res.data.data.current_page,
          totalPages: res.data.data.total_page,
          total: res.data.data.total_num,
        },
      }
    } else {
      return {
        success: false,
        error: res.data.msg || "获取捐赠记录失败",
      }
    }
  } catch (error) {
    console.error("获取捐赠记录失败:", error)
    return {
      success: false,
      error: "获取捐赠记录失败，请稍后重试",
    }
  }
}

/**
 * 获取排名统计
 * @param top 获取前几名
 * @returns 处理后的响应数据
 */
export const fetchRankingStatistics = async (top: number) => {
  try {
    // 从localStorage获取认证token
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      message.error("认证失败，请重新登录")
      return {
        success: false,
        error: "认证失败",
        needLogin: true,
      }
    }

    const res = await axios.get<RankingResponse>("/v1/book/donate/get_ranking", {
      params: { top },
      headers: {
        Authorization: authToken,
      },
    })

    if (res.data.code === 0 || res.data.code === 200) {
      // 处理数据，添加key和rank
      const processedData = res.data.data.rankings.map((item, index) => ({
        ...item,
        key: index.toString(),
        rank: index + 1,
        // 计算总价值和平均价值
        totalValue: item.donate_num * 50, // 假设每本书价值50元
        averageValue: Math.round((item.donate_num * 50) / item.donate_times),
      }))

      return {
        success: true,
        data: processedData,
      }
    } else {
      return {
        success: false,
        error: "获取排名统计失败",
      }
    }
  } catch (error) {
    console.error("获取排名统计失败:", error)
    return {
      success: false,
      error: "获取排名统计失败，请稍后重试",
    }
  }
}

// 生成模拟捐赠记录数据
export const generateMockDonationRecords = (page: number, pageSize: number) => {
  const total = 100
  const totalPages = Math.ceil(total / pageSize)

  const mockData = []
  for (let i = 0; i < pageSize; i++) {
    const index = (page - 1) * pageSize + i
    if (index < total) {
      mockData.push({
        key: index.toString(),
        index: index + 1,
        book_name: `书名${index + 1}`,
        donate_num: Math.floor(Math.random() * 5) + 1,
        donate_time: `2025-01-${(index % 28) + 1}`,
        phone: `1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        user_id: index + 1,
        user_name: `用户${index + 1}`,
        status: ["在库", "借出", "售卖"][Math.floor(Math.random() * 3)],
      })
    }
  }

  return {
    items: mockData,
    currentPage: page,
    totalPages,
    total,
  }
}

// 生成模拟排名统计数据
export const generateMockRankingStatistics = (top: number) => {
  const mockData = []
  for (let i = 0; i < top; i++) {
    const donateNum = Math.floor(Math.random() * 50) + 10
    const donateTimes = Math.floor(Math.random() * 20) + 1
    mockData.push({
      key: i.toString(),
      rank: i + 1,
      user_name: `用户${i + 1}`,
      donate_num: donateNum,
      donate_times: donateTimes,
      updated_at: `2025-01-${(i % 28) + 1}`,
      user_id: i + 1,
      // 添加额外字段用于显示
      totalValue: donateNum * 50,
      averageValue: Math.round((donateNum * 50) / donateTimes),
    })
  }

  return mockData
}
