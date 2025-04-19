import { eraseCookie } from "./cookies"

// 登出函数
export function logout() {
  // 清除localStorage中的token和用户信息
  localStorage.removeItem("authToken")
  localStorage.removeItem("userInfo")

  // 清除cookie中的token
  eraseCookie("authToken")

  // 重定向到登录页面
  window.location.href = "/login"
}
