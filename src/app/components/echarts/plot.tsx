"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import type { EChartsOption } from "echarts"

interface EChartsPlotProps {
  xAxisData: string[]
  series: Array<{
    name: string
    data: number[]
    type: "line" | "bar" | "scatter"
    smooth?: boolean
  }>
  height?: string
  width?: string
  title?: string
  backgroundColor?: string
}

export default function EChartsPlot({ xAxisData, series, height = "100%", width = "100%", title }: EChartsPlotProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    // Only initialize chart on client-side rendering
    if (!chartRef.current) return

    // Dispose existing instance if it exists
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // Initialize chart
    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    // Chart configuration
    const option: EChartsOption = {
      title: title
        ? {
            text: title,
            left: "center",
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: series.map((item) => item.name),
        top: title ? 30 : 10,
        left: "center",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: title ? 80 : 60,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: series,
      color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4"],
    }

    // Set options
    chart.setOption(option)

    // Handle window resize
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener("resize", handleResize)

    // Immediately resize to fit container
    chart.resize()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [xAxisData, series, title])

  return <div ref={chartRef} style={{ width, height }} />
}

