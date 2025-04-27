import axiosInstance from "../axios"

// 请求参数接口
export interface ActivityListRequest {
  /**
   * Page 当前页码，必填项
   */
  page: number
  /**
   * PageSize 每页显示的数量，必填项
   */
  page_size: number
  /**
   * Status 活动状态，可选项,活动状态有pending，ongoing，ended
   */
  status?: string
  [property: string]: any
}

// 活动信息接口
export interface ActivityInfo {
  activity_name: string
  activity_type: string
  addr: string
  end_time: string
  manager: string
  phone: string
  start_time: string
}

// 活动数据接口
export interface ActivityItem {
  activity_id: number
  info: ActivityInfo
}

// 活动列表响应接口
export interface ActivityListResponse {
  activitys: ActivityItem[]
  current_page: number
  total: number
  total_page: number
}

// 创建活动请求接口
export interface CreateActivityRequest {
  info: ActivityInfo
}

// 更新活动请求接口
export interface UpdateActivityRequest {
  activity_id: number
  info: ActivityInfo
}

// 创建活动响应接口
export interface CreateActivityResponse {
  activity_id: number
}

// 活动统计数据接口
export interface ActivityStaticsResponse {
  activity_participation_rate: number
  ended_num: number
  ongoing_num: number
  total_applicants: number
  total_num: number
  upcoming_num: number
}

// API响应接口
interface ApiResponse<T> {
  code: number
  data: T
  msg: string
}

// 获取活动列表
export const getActivityList = async (params: ActivityListRequest): Promise<ActivityListResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ActivityListResponse>>("/v1/activity/query", {
      params,
    })

    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("获取活动列表失败:", response.data.msg)
      throw new Error(response.data.msg || "获取活动列表失败")
    }
  } catch (error) {
    console.error("获取活动列表失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      activitys: [],
      current_page: 1,
      total: 0,
      total_page: 0,
    }
  }
}

// 创建活动
export const createActivity = async (data: CreateActivityRequest): Promise<CreateActivityResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse<CreateActivityResponse>>("/v1/activity/add", data)

    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("创建活动失败:", response.data.msg)
      throw new Error(response.data.msg || "创建活动失败")
    }
  } catch (error) {
    console.error("创建活动失败:", error)
    throw error
  }
}

// 更新活动
export const updateActivity = async (data: UpdateActivityRequest): Promise<void> => {
  try {
    const response = await axiosInstance.put<ApiResponse<{}>>("/v1/activity/update", data)

    if (response.data.code !== 200) {
      console.error("更新活动失败:", response.data.msg)
      throw new Error(response.data.msg || "更新活动失败")
    }
  } catch (error) {
    console.error("更新活动失败:", error)
    throw error
  }
}

// 获取活动统计数据
export const getActivityStatics = async (): Promise<ActivityStaticsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ActivityStaticsResponse>>("/v1/activity/get_statics")

    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("获取活动统计数据失败:", response.data.msg)
      throw new Error(response.data.msg || "获取活动统计数据失败")
    }
  } catch (error) {
    console.error("获取活动统计数据失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      activity_participation_rate: 0,
      ended_num: 0,
      ongoing_num: 0,
      total_applicants: 0,
      total_num: 0,
      upcoming_num: 0,
    }
  }
}

// 状态映射
export const statusMapping: Record<string, string> = {
  pending: "报名中",
  ongoing: "进行中",
  ended: "已结束",
}

// 反向状态映射
export const reverseStatusMapping: Record<string, string> = {
  报名中: "pending",
  进行中: "ongoing",
  已结束: "ended",
}
