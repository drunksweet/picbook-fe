import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("authToken")

    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = token
    } else {
      // 判断是否是登录相关的请求
      const isAuthRelatedRequest =
        config.url?.includes("/login") || config.url?.includes("/register") || config.url?.includes("/forgot-password")

      // 如果不是登录相关请求，并且当前不在登录页面，则取消请求
      if (!isAuthRelatedRequest && typeof window !== "undefined") {
        const currentPath = window.location.pathname
        const isAuthPage =
          currentPath.includes("/login") ||
          currentPath.includes("/register") ||
          currentPath.includes("/forgot-password")

        if (!isAuthPage) {
          // 取消当前请求
          const error = new Error("No authentication token")
          // @ts-ignore
          error.isAuthError = true
          return Promise.reject(error)
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // 请求已发出，服务器用状态代码响应
      // 超出 2xx 的范围
      console.error("Response Error:", error.response.status, error.response.data)
    } else if (error.request) {
      // 请求已发出，但未收到任何响应
      // `error.request` 是在浏览器中 XMLHttpRequest 的实例，
      // 而在 node.js 中是 http.ClientRequest 的实例
      console.error("Request Error:", error.request)
    } else {
      // 设置请求时发生了一些事情，触发了一个错误
      console.error("Config Error:", error.message)
    }
    console.error("Error config", error.config)
    return Promise.reject(error)
  },
)

export default axiosInstance
