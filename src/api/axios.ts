// lib/axios.ts
import axios from "axios";
import { message } from "antd";
import { eraseCookie } from "src/utils/cookies";

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
    } else {
      // 如果没有token，并且不是登录请求，则取消请求并重定向到登录页面
      const isLoginRequest = config.url?.includes("/login");

      if (!isLoginRequest) {
        // 取消当前请求
        const error = new Error("No authentication token");
        // @ts-ignore
        error.isAuthError = true;
        return Promise.reject(error);
      }
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
    // 处理请求拦截器中的认证错误
    // @ts-ignore
    if (error.isAuthError) {
      // 清除cookie中的token
      eraseCookie("authToken");

      // 重定向到登录页面
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect_to=${encodeURIComponent(
          currentPath
        )}`;
      }
      return Promise.reject(error);
    }

    if (error.response) {
      // 处理401未授权错误
      if (error.response.status === 401) {
        message.error("登录已过期，请重新登录");

        // 清除token和用户信息
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        eraseCookie("authToken"); // 同时清除cookie中的token

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
    } else if (!error.isAuthError) {
      // 避免重复显示错误信息
      message.error("网络错误，请稍后重试");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
