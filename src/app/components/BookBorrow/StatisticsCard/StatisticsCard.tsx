"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, Typography, Select, Spin } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import BorrowBarChart from "@/components/echarts/borrow_bar/BorrowBarChart";
import "./StatisticsCard.scss";
import {
  fetchBorrowStatistics,
  generateMockStatistics,
  type TimePattern,
  type StatisticsData,
} from "@/api/books/borrow/statistics";
const { Title } = Typography;

interface StatisticsCardProps {
  onPeriodChange?: (value: string) => void;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ onPeriodChange }) => {
  const [pattern, setPattern] = useState<TimePattern>("week");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<StatisticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 统计选项
  const statisticsSelctOption = [
    { value: "week", label: <span>近一周</span> },
    { value: "month", label: <span>近一月</span> },
    { value: "year", label: <span>近一月</span> },
  ];

  // 获取统计数据
  const getStatisticsData = async (selectedPattern: TimePattern) => {
    try {
      const result = await fetchBorrowStatistics(selectedPattern);

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "获取统计数据失败");
        // 使用模拟数据
        const mockData = generateMockStatistics(selectedPattern);
        setData(mockData);
      }
    } catch (err) {
      console.error("获取统计数据出错:", err);
      setError("获取统计数据出错，请稍后重试");
      // 使用模拟数据
      const mockData = generateMockStatistics(selectedPattern);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // 处理时间范围变化
  const handlePatternChange = (value: TimePattern) => {
    setPattern(value);
    getStatisticsData(value);

    // 如果提供了外部回调，则调用
    if (onPeriodChange) {
      onPeriodChange(value);
    }
  };

  // 初始加载数据
  useEffect(() => {
    getStatisticsData(pattern);
  }, []);

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
          defaultValue="week"
          onChange={handlePatternChange}
        />
      </div>

      <div className="chart-container">

          <BorrowBarChart data={data || undefined} loading={loading} />

      </div>
    </Card>
  );
};

export default StatisticsCard;
