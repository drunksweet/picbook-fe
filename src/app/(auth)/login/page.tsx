"use client";

import LoginForm from "@/components/login-form/login-form";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/api/login/auth"; // 假设有这个工具函数
import axios from "src/api/axios";

interface CaptchaResponse {
  code: number;
  msg: string;
  data: {
    image: string;
    verification_code_id: string;
  };
}

export default function LoginPage() {
  const [captchaImg, setCaptchaImg] = useState<string>("");
  const [captchaId, setCaptchaId] = useState<string>("");

  const router = useRouter();

  const fetchCaptcha = async () => {
    try {
      const res = await axios.get<CaptchaResponse>(
        "/v1/auth/get_verification_code"
      );
      console.log('console.log(res.data):')
      console.log(res.data)
      if (res.data.code === 200) {
        setCaptchaImg(`data:image/png;base64,${res.data.data.image}`);
        setCaptchaId(res.data.data.verification_code_id);
      }
    } catch (error) {
      console.error("获取验证码失败", error);
    }
  };

  useEffect(() => {
    fetchCaptcha(); // 首次加载验证码
  }, []);

  useEffect(() => {
    // 如果已登录，直接跳转到首页
    if (isLoggedIn()) {
      router.push("/");
    }
  }, []);

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.imageContainer}>
            <img
              src="../../login/library-illustration.png"
              alt="图书馆插图"
              className={styles.illustration}
            />
          </div>
        </div>
        <div className={styles.rightSection}>
          <LoginForm
            onSuccess={handleLoginSuccess}
            verificationImg={captchaImg}
            verificationCodeId={captchaId}
            refreshCaptcha={fetchCaptcha}
          />
        </div>
      </div>
    </main>
  );
}
