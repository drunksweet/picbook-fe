// app/inventory/page.tsx
"use client";

import Banner from "@/components/banner";
import React from "react";



export default function InventoryPage() {
  // 新增库存操作
  const handleAddInventory = () => {
    // 这里可以添加跳转新增页面逻辑
    alert("打开新增库存表单");
  };

  return (
    <Banner title="绘本管理-绘本捐赠"/>
  );
}