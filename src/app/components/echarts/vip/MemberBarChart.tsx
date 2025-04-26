"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import styles from "./Charts.module.scss"
import type { MemberData } from "@/components/vipManagement/VipManagement"

interface MemberBarChartProps {
  memberData: MemberData[]
  loading?: boolean
}

export function MemberBarChart({ memberData, loading = false }: MemberBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || loading || !memberData.length) return

    // 销毁可能存在的旧实例
    const existingChart = echarts.getInstanceByDom(chartRef.current)
    if (existingChart) {
      existingChart.dispose()
    }

    const chart = echarts.init(chartRef.current)

    // 按积分排序并取前10名会员
    const sortedData = [...memberData].sort((a, b) => b.points - a.points).slice(0, 10)

    // 准备图表数据
    const names = sortedData.map((member) => member.name)
    const points = sortedData.map((member) => member.points)

    // 根据会员级别设置不同颜色
    const colorMap: Record<string, string> = {
      gold: "#FFFACD",
      silver: "#87CEFA",
      normal: "#FFB6C1",
    }

    // 为每个柱状图设置颜色
    const itemColors = sortedData.map((member) => colorMap[member.level] || "#5DADE2")

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex
          const member = sortedData[dataIndex]
          return `${member.name}<br/>积分: ${member.points}<br/>级别: ${member.level}`
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: names,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              fontSize: 10,
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "积分",
          nameTextStyle: {
            padding: [0, 0, 0, 30],
          },
        },
      ],
      series: [
        {
          name: "积分数量",
          type: "bar",
          barWidth: "60%",
          data: points,
          itemStyle: {
            color: (params: any) => itemColors[params.dataIndex],
          },
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
          },
        },
      ],
    }

    chart.setOption(option)

    // 响应式调整
    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      chart.dispose()
      window.removeEventListener("resize", handleResize)
    }
  }, [memberData, loading])

  return (
    <div className={styles.chartContainer}>
      {loading ? (
        <div style={{ height: "247px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          加载中...
        </div>
      ) : !memberData.length ? (
        <div style={{ height: "247px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          暂无会员数据
        </div>
      ) : (
        <div className={styles.barChart} ref={chartRef}></div>
      )}
      <div className={styles.chartTitle}>会员积分排行</div>
    </div>
  )
}
