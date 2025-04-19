// lib/axios.ts
import axios from "axios";
import { message } from "antd"
import { eraseCookie } from "src/utils/cookies"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 支持部署时灵活配置
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("authToken");

    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 处理401未授权错误
      if (error.response.status === 401) {
        message.error("登录已过期，请重新登录");

        // 清除token和用户信息
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        eraseCookie("authToken") // 同时清除cookie中的token

        // 重定向到登录页面
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect_to=${encodeURIComponent(
            currentPath
          )}`;
        }
      } else {
        // 处理其他错误
        message.error(error.response.data?.msg || "请求失败");
      }
    } else {
      message.error("网络错误，请稍后重试");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
