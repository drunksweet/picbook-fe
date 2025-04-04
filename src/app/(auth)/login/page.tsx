"use client";

import LoginForm from "@/components/login-form/login-form";
import styles from "./page.module.scss"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLoggedIn } from "@/lib/auth"; // 假设有这个工具函数

export default function LoginPage() {
  const router = useRouter();

  // useEffect(() => {
  //   // 如果已登录，直接跳转到首页
  //   if (isLoggedIn()) {
  //     router.push("/");
  //   }
  // }, []);

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.imageContainer}>
            <img src="../../login/library-illustration.png" alt="图书馆插图" className={styles.illustration} />
          </div>
        </div>
        <div className={styles.rightSection}>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </main>
  )
}

