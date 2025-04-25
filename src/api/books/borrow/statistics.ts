import axios from "src/api/axios"
import { message } from "antd"

// 定义统计数据接口
export interface StatisticsData {
  art_enlightenment_num: number
  children_story_num: number
  science_knowledge_num: number
}

// 定义API响应接口
export interface StatisticsResponse {
  code: number
  data: StatisticsData
  msg: string
}

// 定义时间范围类型
export type TimePattern = "week" | "month" | "year"

/**
 * 获取借阅统计数据
 * @param pattern 时间范围：week(近一周)、month(近一月)、year(近一年)
 * @returns 处理后的响应数据
 */
export const fetchBorrowStatistics = async (pattern: TimePattern) => {
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

    const res = await axios.get<StatisticsResponse>("/v1/book/borrow/query_statistics", {
      params: { pattern },
      headers: {
        Authorization: authToken,
      },
    })

    if (res.data.code === 0 || res.data.code === 200) {
      return {
        success: true,
        data: res.data.data,
      }
    } else {
      return {
        success: false,
        error: res.data.msg || "获取统计数据失败",
      }
    }
  } catch (error) {
    console.error("获取统计数据失败:", error)
    return {
      success: false,
      error: "获取统计数据失败，请稍后重试",
    }
  }
}

// 生成模拟数据
export const generateMockStatistics = (pattern: TimePattern): StatisticsData => {
  // 根据不同的时间范围生成不同的数据量级
  let multiplier = 1
  switch (pattern) {
    case "week":
      multiplier = 1
      break
    case "month":
      multiplier = 4
      break
    case "year":
      multiplier = 12
      break
  }

  return {
    art_enlightenment_num: Math.floor(Math.random() * 50 * multiplier) + 10,
    children_story_num: Math.floor(Math.random() * 100 * multiplier) + 20,
    science_knowledge_num: Math.floor(Math.random() * 70 * multiplier) + 15,
  }
}
