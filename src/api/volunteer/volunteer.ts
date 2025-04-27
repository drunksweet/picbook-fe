import axiosInstance from "../axios"

// 志愿者查询请求参数接口
export interface VolunteerQueryRequest {
  id?: number
  page: number
  page_size: number
  [property: string]: any
}

// 志愿者信息接口
export interface VolunteerInfo {
  age: number
  createdAt: string
  expertiseArea: string
  id: number
  name: string
  phone: string
  serviceTimePreference: string
}

// 志愿者查询响应接口
export interface VolunteerQueryResponse {
  current_page: number
  total: number
  total_page: number
  volunteers: VolunteerInfo[]
}

// 创建志愿者请求接口
export interface CreateVolunteerRequest {
  age: number
  expertiseArea: string
  name: string
  phone: string
  serviceTimePreference: string
}

// 创建志愿者响应接口
export interface CreateVolunteerResponse {
  volunteer_id: number
}

// 志愿者申请查询请求参数接口
export interface VolunteerApplicationRequest {
  page: number
  page_size: number
  [property: string]: any
}

// 志愿者申请信息接口
export interface VolunteerApplication {
  age: number
  id: number
  name: string
  phone: string
}

// 志愿者申请查询响应接口
export interface VolunteerApplicationResponse {
  applications: VolunteerApplication[]
  current_page: number
  total: number
  total_page: number
}

// API响应接口
interface ApiResponse<T> {
  code: number
  data: T
  msg: string
}

// 获取志愿者列表
export const getVolunteerList = async (params: VolunteerQueryRequest): Promise<VolunteerQueryResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<VolunteerQueryResponse>>("/v1/volunteer/query", {
      params,
    })

    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("获取志愿者列表失败:", response.data.msg)
      throw new Error(response.data.msg || "获取志愿者列表失败")
    }
  } catch (error) {
    console.error("获取志愿者列表失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      current_page: 1,
      total: 0,
      total_page: 0,
      volunteers: [],
    }
  }
}

// 创建志愿者
export const createVolunteer = async (data: CreateVolunteerRequest): Promise<CreateVolunteerResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse<CreateVolunteerResponse>>("/v1/volunteer/create", data)

    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("创建志愿者失败:", response.data.msg)
      throw new Error(response.data.msg || "创建志愿者失败")
    }
  } catch (error) {
    console.error("创建志愿者失败:", error)
    throw error
  }
}

// 获取志愿者申请列表
export const getVolunteerApplicationList = async (
  params: VolunteerApplicationRequest,
): Promise<VolunteerApplicationResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<VolunteerApplicationResponse>>(
      "/v1/volunteer/list_application",
      {
        params,
      },
    )

    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      console.error("获取志愿者申请列表失败:", response.data.msg)
      throw new Error(response.data.msg || "获取志愿者申请列表失败")
    }
  } catch (error) {
    console.error("获取志愿者申请列表失败:", error)
    // 返回默认数据，避免页面崩溃
    return {
      applications: [],
      current_page: 1,
      total: 0,
      total_page: 0,
    }
  }
}
