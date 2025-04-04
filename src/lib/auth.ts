export function isLoggedIn() {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('authToken');
}

export async function login(username: string, password: string, code: string) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, code })
    });
    const data = await response.json();
    if (data.success) {
      // 确保在浏览器环境中才使用localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', data.token);
      }
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// 添加登出功能
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}