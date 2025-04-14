"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Flex, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./login-form.scss";
import { login } from "src/api/auth";
interface LoginFormProps {
  onSuccess: () => void;
  verificationImg: string;
  verificationCodeId: string;
  refreshCaptcha: () => void;
}

export default function LoginForm({
  onSuccess,
  verificationImg,
  verificationCodeId,
  refreshCaptcha,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    userId: string;
    password: string;
    verificationCode: string;
  }) => {
    try {
      const success = await login({ ...values, verificationCodeId });
      console.log(success);
      if (success) {
        console.log("onSuccess");
        onSuccess();
      }
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  return (
    <div className="formContainer">
      <h1 className="title">
        "爱孩子的书" <span className="subtitle">绘本馆</span>
      </h1>

      <Form
        form={form}
        className="form"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="userId"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input
            className="input"
            prefix={<UserOutlined className="icon" />}
            placeholder="用户名"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input
            className="input"
            prefix={<LockOutlined className="icon" />}
            type={showPassword ? "text" : "password"}
            placeholder="密码"
            suffix={
              <Button
                type="text"
                className="toggleButton"
                onClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              />
            }
          />
        </Form.Item>

        <Form.Item
          name="verificationCode"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <Row gutter={0}>
            <Col span={18}>
              <Input
                className="input"
                prefix={<SafetyCertificateOutlined className="icon" />}
                placeholder="验证码"
                // suffix={}
              />
            </Col>
            <Col span={6}>
              <div className="captcha">
                <img
                  className="captchaImg"
                  src={verificationImg}
                  alt="验证码"
                  onClick={refreshCaptcha}
                />
              </div>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item style={{ paddingTop: "30px" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="loginButton"
            block
          >
            登 录
          </Button>
        </Form.Item>

        <div className="forgotPassword">
          <a href="#">忘记密码?</a>
        </div>
      </Form>
    </div>
  );
}
