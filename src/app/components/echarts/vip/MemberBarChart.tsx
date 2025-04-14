"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import styles from "./Charts.module.scss"

export function MemberBarChart() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["会员1", "会员2", "会员3", "会员4", "会员5", "会员6", "会员7", "会员8", "会员9"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "积分数量",
            type: "bar",
            barWidth: "60%",
            data: [50, 180, 300, 90, 200, 400, 30, 180, 300],
            itemStyle: {
              color: "#5DADE2",
            },
          },
        ],
      }

      chart.setOption(option)

      // 响应式调整
      window.addEventListener("resize", () => {
        chart.resize()
      })

      return () => {
        chart.dispose()
        window.removeEventListener("resize", () => {
          chart.resize()
        })
      }
    }
  }, [])

  return (
    <div className={styles.chartContainer}>
      <div className={styles.barChart} ref={chartRef}></div>
      <div className={styles.chartTitle}>会员积分分布</div>
    </div>
  )
}
