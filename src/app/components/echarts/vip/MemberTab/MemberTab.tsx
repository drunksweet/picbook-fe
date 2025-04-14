import React from "react";
import { Button, Tabs } from "antd";
import { MemberBarChart } from "@/components/echarts/vip/MemberBarChart";
import { MemberChartsContainer } from "@/components/echarts/vip/MemberCharts/MemberChartsContainer";
import "./MemberTab.scss";

export default function MemberTab() {
  const chartTypes = [
    { key: "pie", label: "条形图" },
    { key: "bar", label: "柱状图" },
    { key: "line", label: "折线图" },
    { key: "radar", label: "环形图" },
  ];

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
