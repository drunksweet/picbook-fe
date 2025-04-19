"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { useResizeObserver } from "@/hooks/useResizeObserver"

const BorrowBarChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 使用ResizeObserver监听容器大小变化
  const { width, height } = useResizeObserver(chartRef)

  // 图表数据
  const chartData = [
    { category: "故事类", value: 20 },
    { category: "科普类", value: 15 },
    { category: "益智类", value: 10 },
    { category: "童话类", value: 25 },
  ]

  // 初始化图表
  const initChart = () => {
    if (!chartRef.current) return

    // 创建或获取图表实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // 图表配置
    const option = {
      title: {
        text: "本月借阅数量",
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
        data: chartData.map((item) => item.category),
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 30,
        interval: 5,
      },
      series: [
        {
          name: "借阅数量",
          type: "bar",
          barWidth: "80%",
          data: chartData.map((item, index) => {
            // 为不同类别设置不同颜色
            const colors = [
              { value: item.value, itemStyle: { color: "#ffb6c1" } }, // 故事类 - 粉色
              { value: item.value, itemStyle: { color: "#add8e6" } }, // 科普类 - 蓝色
              { value: item.value, itemStyle: { color: "#ffffe0" } }, // 益智类 - 黄色
              { value: item.value, itemStyle: { color: "#b0e0e6" } }, // 童话类 - 青色
            ]
            return colors[index]
          }),
        },
      ],
    }

    // 设置图表选项
    chartInstance.current.setOption(option)
  }

  // 当组件挂载时初始化图表
  useEffect(() => {
    initChart()

    // 组件卸载时销毁图表
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  // 当容器大小变化时重新调整图表大小
  useEffect(() => {
    if (width && height && chartInstance.current) {
      chartInstance.current.resize()
    }
  }, [width, height])

  return <div ref={chartRef} style={{height:'100%',width:'100%'}} />
}

export default BorrowBarChart

