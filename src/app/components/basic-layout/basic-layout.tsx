"use client";

import React from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  CrownOutlined,
  ReconciliationOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, App as AntApp } from "antd";
import { ConfigProvider } from "antd";
import { useRouter } from "next/navigation";
import "./basic-layout.sass";

const { Header, Content, Footer, Sider } = Layout;

// 定义路由映射
const routeMap: { [key: string]: string } = {
  "1": "/",
  "2": "/inventory",
  "3-1": "/books/borrow",
  "3-2": "/books/donate",
  "4": "/vip",
  "5": "/activity",
  "6": "/volunteer",
};

// 更新后的菜单项配置
const items2: MenuProps["items"] = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "首页",
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: "库存管理",
  },
  {
    key: "3",
    icon: <BookOutlined />,
    label: "绘本管理",
    children: [
      {
        key: "3-1",
        icon: <ShoppingCartOutlined />,
        label: "绘本借阅",
      },
      {
        key: "3-2",
        icon: <GiftOutlined />,
        label: "绘本捐赠",
      },
    ],
  },
  {
    key: "4",
    icon: <CrownOutlined />,
    label: "会员管理",
  },
  {
    key: "5",
    icon: <ReconciliationOutlined />,
    label: "活动管理",
  },
  {
    key: "6",
    icon: <ContactsOutlined />,
    label: "志愿管理",
  },
];

export function AntdLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 处理菜单点击事件
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const path = routeMap[e.key];
    if (path) {
      router.push(path);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "#fdead0",
            siderBg: "#fbd39e",
            lightSiderBg: "#fbd39e",
          },
          Menu: {
            fontSize: 14,
            groupTitleColor: "#b8741a", // 分组标题颜色
            subMenuItemBg: "#fbd39e", // 子菜单项背景
            itemBg: "#fbd39e", // 菜单项背景
            itemHoverBg: "#f9c278", // 悬停背景
            itemSelectedBg: "#f9c278", // 选中背景
            itemSelectedColor: "#b8741a", // 选中文字颜色
          },
        },
      }}
    >
      <AntApp>
        {" "}
        <Layout
          className="fathet-layout"
          style={{
            minHeight: "100vh",
            height: "100vh", // 确保固定高度
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              flex: "0 0 auto",
              height: "5vh",
            }}
          >
            <img src="/pic_book_logo@2x.png" alt="Logo" width={30}></img>
            <h1 className="project-name">“爱孩子的书”绘本馆</h1>
          </Header>
          <div
            style={{ padding: "0 0px", maxHeight: "95vh"}}
          >
            <Layout
              style={{
                padding: "0px 0",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Sider
                style={{ background: "#fdead0", width: "20vw" }}
                width={160}
                theme="light"
              >
                <Menu
                  mode="inline"
                  defaultSelectedKeys={["1"]}
                  defaultOpenKeys={["1"]}
                  style={{ height: "100%" }}
                  items={items2}
                  onClick={handleMenuClick}
                />
              </Sider>
              <Content
                style={{
                  padding: "1rem 1.5rem 5rem 1.5rem",
                  minHeight: 280,
                  backgroundColor: "#efefef",
                }}
              >
                {children}
              </Content>
            </Layout>
          </div>
          {/* <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer> */}
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
}
