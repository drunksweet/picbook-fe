// app/inventory/page.tsx
"use client";

import React from "react";
import { Button, Table, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import InventoryManagement from "@/components/InventoryManagement/InventoryManagement";
import Banner from "@/components/banner";

export default function InventoryPage() {
  return (
    <>
      <Banner title="库存管理"/>
      <div style={{ padding: 0 }}>
        <InventoryManagement />
      </div>
    </>
  );
}
