import axiosInstance from "../axios"

// 会员统计数据接口
export interface VipStaticsResponse {
  gold_num: number
  normal_num: number
  silver_num: number
}

// API响应接口
interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 获取会员统计数据
export const getVipStatics = async (): Promise<VipStaticsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<VipStaticsResponse>>("/v1/user/vip_statics")

    // 检查响应状态
    if (response.data.code === 200 && response.data.data) {
      return response.data.data // 返回嵌套在data字段中的数据
    } else {
      console.error("获取会员统计数据失败:", response.data.msg)
      throw new Error(response.data.msg || "获取会员统计数据失败")
    }
  } catch (error) {
    console.error("获取会员统计数据失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      gold_num: 0,
      normal_num: 0,
      silver_num: 0,
    }
  }
}

// 会员搜索请求参数接口
export interface VipSearchRequest {
  is_vip?: boolean
  level?: string
  page: number
  page_size: number
  phone?: string
  user_id?: number
  user_name?: string
  [property: string]: any
}

// 会员信息接口
export interface VipUserInfo {
  gender: string
  id: number
  integral: number
  is_vip: boolean
  name: string
  phone: string
  status: string
  vip_levels: string
}

// 会员搜索响应数据接口
export interface VipSearchResponseData {
  current_page: number
  total_num: number
  total_page: number
  users: VipUserInfo[]
}

// 会员搜索响应接口
export interface VipSearchResponse {
  code: number
  data: VipSearchResponseData
  msg: string
}

// 搜索会员
export const searchVipUsers = async (params: VipSearchRequest): Promise<VipSearchResponse> => {
  try {
    const response = await axiosInstance.get<VipSearchResponse>("/v1/user/search", {
      params,
    })

    return response.data
  } catch (error) {
    console.error("搜索会员失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      code: 500,
      data: {
        current_page: 1,
        total_num: 0,
        total_page: 0,
        users: [],
      },
      msg: "搜索会员失败",
    }
  }
}