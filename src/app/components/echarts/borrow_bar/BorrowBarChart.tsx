"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { useResizeObserver } from "@/hooks/useResizeObserver"
import type { StatisticsData } from "@/api/books/borrow/statistics"

interface BorrowBarChartProps {
  data?: StatisticsData
  loading?: boolean
}

const BorrowBarChart: React.FC<BorrowBarChartProps> = ({ data, loading = false }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 使用ResizeObserver监听容器大小变化
  const { width, height } = useResizeObserver(chartRef)

  // 类别名称映射
  const categoryNameMap: Record<string, string> = {
    art_enlightenment_num: "艺术启蒙",
    children_story_num: "儿童故事",
    science_knowledge_num: "科普知识",
  }

  // 颜色映射
  const colorMap: Record<string, string> = {
    art_enlightenment_num: "#ffb6c1", // 粉色
    children_story_num: "#add8e6", // 蓝色
    science_knowledge_num: "#ffffe0", // 黄色
  }

  // 初始化或更新图表
  const updateChart = () => {
    if (!chartRef.current) return

    // 创建或获取图表实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // 如果正在加载，显示加载状态
    if (loading) {
      chartInstance.current.showLoading({
        text: "数据加载中...",
        maskColor: "rgba(255, 255, 255, 0.8)",
        textColor: "#F59A23",
      })
      return
    } else {
      chartInstance.current.hideLoading()
    }

    // 如果没有数据，显示默认状态
    if (!data) {
      chartInstance.current.setOption({
        title: {
          text: "暂无数据",
          left: "center",
          top: "center",
          textStyle: {
            color: "#999",
            fontSize: 16,
          },
        },
      })
      return
    }

    // 准备数据
    const categories: string[] = []
    const values: { value: number; itemStyle: { color: string } }[] = []

    // 转换API数据为图表数据
    Object.entries(data).forEach(([key, value]) => {
      const category = categoryNameMap[key] || key
      const color = colorMap[key] || "#b0e0e6" // 默认青色

      categories.push(category)
      values.push({
        value,
        itemStyle: { color },
      })
    })

    // 图表配置
    const option = {
      title: {
        text: "借阅类别统计",
        left: "center",
        textStyle: {
          color: "#333",
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        // 动态计算最大值，确保有一定的留白
        max: (value: { max: number }) => Math.ceil(value.max * 1.2),
        // 动态计算间隔
        interval: (value: { max: number }) => Math.ceil(value.max / 5),
      },
      series: [
        {
          name: "借阅数量",
          type: "bar",
          barWidth: "60%",
          data: values,
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
            color: "#666",
          },
        },
      ],
    }

    // 设置图表选项
    chartInstance.current.setOption(option, true)
  }

  // 当组件挂载时初始化图表
  useEffect(() => {
    updateChart()

    // 组件卸载时销毁图表
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  // 当数据或加载状态变化时更新图表
  useEffect(() => {
    updateChart()
  }, [data, loading])

  // 当容器大小变化时重新调整图表大小
  useEffect(() => {
    if (width && height && chartInstance.current) {
      chartInstance.current.resize()
    }
  }, [width, height])

  return <div ref={chartRef} style={{ height: "100%", width: "100%" }} />
}

export default BorrowBarChart
