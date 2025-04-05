import axios from "@/lib/axios";
interface LoginProps {
  userId: string;
  password: string;
  verificationCode: string;
  verificationCodeId: string;
}

export function isLoggedIn() {
  // 检查是否在浏览器环境中
  if (typeof window === "undefined") {
    return false;
  }
  return !!localStorage.getItem("authToken");
}

export async function login({
  userId,
  password,
  verificationCode,
  verificationCodeId,
}: LoginProps) {
  console.log("1111111");
  console.log({
    user_id: userId,
    password,
    verification_code: verificationCode,
    verification_code_id: verificationCodeId,
  });
  try {
    const response = await axios.post(
      "/v1/auth/login",
      {
        user_id: userId,
        password,
        verification_code: verificationCode,
        verification_code_id: verificationCodeId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("222222");
    console.log("Login response:", response.data);
    if (response.data.success) {
      // 确保在浏览器环境中才使用localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", response.data.token);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

// 添加登出功能
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}
