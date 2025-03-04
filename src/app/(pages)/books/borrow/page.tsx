// app/inventory/page.tsx
"use client";

import React from "react";


export default function BookBorrowPage() {
  // 新增库存操作
  const handleAddInventory = () => {
    // 这里可以添加跳转新增页面逻辑
    alert("打开新增库存表单");
  };

  return (
    <div style={{ padding: 24 }}>
      绘本借阅
    </div>
  );
}