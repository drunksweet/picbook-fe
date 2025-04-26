import { setCookie } from "./cookies"

/**
 * 处理登录成功后的操作
 * @param token 登录成功后获取的token
 * @param userInfo 用户信息
 */
export function handleLoginSuccess(token: string, userInfo: any) {
  // 保存token到localStorage和cookie
  localStorage.setItem("authToken", token)
  setCookie("authToken", token, 7) // 保存7天

  // 保存用户信息
  localStorage.setItem("userInfo", JSON.stringify(userInfo))

  // 获取重定向URL
  const urlParams = new URLSearchParams(window.location.search)
  const redirectTo = urlParams.get("redirect_to") || "/"

  // 重定向到原始请求页面
  window.location.href = redirectTo
}

/**
 * 检查用户是否已登录
 */
export function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("authToken")
  return !!token
}
