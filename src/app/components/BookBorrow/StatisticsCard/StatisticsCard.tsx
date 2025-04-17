"use client"

import type React from "react"

import { Card, Typography, Select } from "antd"
import { BarChartOutlined } from "@ant-design/icons"
import BorrowBarChart from "@/components/echarts/borrow_bar/BorrowBarChart"
import "./StatisticsCard.scss"

const { Title } = Typography

interface StatisticsCardProps {
  onPeriodChange?: (value: string) => void
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ onPeriodChange }) => {
  // 统计选项
  const statisticsSelctOption = [
    { value: "oneDay", label: <span>近一天</span> },
    { value: "oneWeek", label: <span>近一周</span> },
    { value: "towWeek", label: <span>近两周</span> },
    { value: "oneMonth", label: <span>近一月</span> },
  ]

  return (
    <Card className="statistics-card" variant="outlined">
      <div className="statistics-header">
        <BarChartOutlined style={{ fontSize: 24, color: "#F59A23" }} />
        <Title level={5} style={{ margin: "0 0 0 8px" }}>
          统计分析
        </Title>
        <Select
          options={statisticsSelctOption}
          style={{ width: 120, margin: "0 24px" }}
          defaultValue="oneDay"
          onChange={onPeriodChange}
        />
      </div>

      <div className="chart-container">
        <BorrowBarChart />
      </div>
    </Card>
  )
}

export default StatisticsCard
