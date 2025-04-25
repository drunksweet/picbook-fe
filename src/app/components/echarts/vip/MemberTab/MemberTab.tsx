import React from "react";
import { Button, Tabs } from "antd";
import { MemberBarChart } from "@/components/echarts/vip/MemberBarChart";
import { MemberChartsContainer } from "@/components/echarts/vip/MemberCharts/MemberChartsContainer";
import "./MemberTab.scss";

export default function MemberTab() {
  return (
    <div className="chartOneContainer">
      <Tabs
        className="chartTabs"
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "排名统计",
            children: <MemberBarChart />,
          },
          {
            key: "2",
            label: "图标统计",
            children: <MemberChartsContainer />,
          },
        ]}
      />
    </div>
  );
}
