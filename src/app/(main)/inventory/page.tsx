// app/inventory/page.tsx
"use client";

import React from "react";
import InventoryManagement from "@/components/InventoryManagement/InventoryManagement";
import Banner from "@/components/banner";

export default function InventoryPage() {
  return (
    <>
      <Banner title="库存管理"/>
      <div>
        <InventoryManagement />
      </div>
    </>
  );
}
