"use client"

import type React from "react"

import { useState } from "react"
import { User, Lock, Eye, EyeOff, Shield } from "lucide-react"
import styles from "./login-form.module.scss"
import { login } from "src/lib/auth"

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 这里添加实际的登录逻辑
      const success = await login(username, password, verificationCode);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>
        "爱孩子的书" <span className={styles.subtitle}>绘本馆</span>
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <User className={styles.icon} size={20} />
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <Lock className={styles.icon} size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className={styles.inputGroup}>
          <Shield className={styles.icon} size={20} />
          <input
            type="text"
            placeholder="验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.captcha}>b c 4 e</div>
        </div>

        <button type="submit" className={styles.loginButton}>
          登 录
        </button>

        <div className={styles.forgotPassword}>
          <a href="#">忘记密码?</a>
        </div>
      </form>
    </div>
  )
}

