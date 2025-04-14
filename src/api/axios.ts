// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 支持部署时灵活配置
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // 请求拦截器（可选）
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 你可以在这里添加 token 或其他头部信息
//     // const token = localStorage.getItem('token')
//     // if (token) config.headers.Authorization = `Bearer ${token}`
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 响应拦截器（可选）
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // 你也可以统一处理错误提示
//     console.error("API 请求出错:", error);
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
