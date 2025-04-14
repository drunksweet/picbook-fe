// app/activity/page.tsx
"use client";

import React from "react";
import Banner from "@/components/banner";
import VipManagement from "@/components/vipManagement/VipManagement";


export default function VipPage() {

  return (
    <div>
      <Banner title="会员管理" />
      <VipManagement />
    </div>

  )
}
