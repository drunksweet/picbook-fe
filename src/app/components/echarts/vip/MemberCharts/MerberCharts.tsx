"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import styles from "./MemberCharts.module.scss"

type ChartType = "bar" | "pie" | "line" | "doughnut"

interface MemberChartProps {
  chartType?: ChartType
}

export function MemberCharts({ chartType = "pie" }: MemberChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<echarts.ECharts | null>(null)

  // 会员数据
  const memberData = [
    { value: 50, name: "普通会员" },
    { value: 30, name: "银卡会员" },
    { value: 20, name: "金卡会员" },
  ]

  // 颜色配置
  const colors = ["#FFB6C1", "#87CEFA", "#FFFACD"]

  useEffect(() => {
    if (chartRef.current) {
      // 如果已经有图表实例，则销毁它
      if (chart) {
        chart.dispose()
      }

      // 创建新的图表实例
      const newChart = echarts.init(chartRef.current)
      setChart(newChart)

      // 响应式调整
      const handleResize = () => {
        newChart.resize()
      }
      window.addEventListener("resize", handleResize)

      return () => {
        newChart.dispose()
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  useEffect(() => {
    if (chart) {
      let option: echarts.EChartsOption = {}

      switch (chartType) {
        case "pie":
          option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            legend: {
              orient: "horizontal",
              top: 0,
              data: memberData.map((item) => item.name),
              textStyle: {
                color: "#333",
              },
            },
            color: colors,
            series: [
              {
                name: "会员级别",
                type: "pie",
                radius: ["0%", "70%"],
                center: ["50%", "60%"],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: "18",
                    fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: memberData,
              },
            ],
          }
          break

        case "bar":
          option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
              },
            },
            legend: {
              data: memberData.map((item) => item.name),
              top: 0,
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              top: "15%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              data: ["会员级别"],
            },
            yAxis: {
              type: "value",
            },
            color: colors,
            series: memberData.map((item) => ({
              name: item.name,
              type: "bar",
              stack: "total",
              label: {
                show: true,
                position: "inside",
                formatter: "{c}",
              },
              emphasis: {
                focus: "series",
              },
              data: [item.value],
            })),
          }
          break

        case "line":
          option = {
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: memberData.map((item) => item.name),
              top: 0,
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              top: "15%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: ["一月", "二月", "三月", "四月", "五月", "六月"],
            },
            yAxis: {
              type: "value",
            },
            color: colors,
            series: memberData.map((item) => {
              // 生成随机数据模拟趋势
              const baseValue = item.value
              const data = Array(6)
                .fill(0)
                .map(() => Math.floor(baseValue * (0.8 + Math.random() * 0.4)))

              return {
                name: item.name,
                type: "line",
                stack: "Total",
                areaStyle: {},
                emphasis: {
                  focus: "series",
                },
                data: data,
              }
            }),
          }
          break

        case "doughnut":
          option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            legend: {
              orient: "horizontal",
              top: 0,
              data: memberData.map((item) => item.name),
              textStyle: {
                color: "#333",
              },
            },
            color: colors,
            series: [
              {
                name: "会员级别",
                type: "pie",
                radius: ["40%", "70%"],
                center: ["50%", "60%"],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: "18",
                    fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: memberData,
              },
            ],
          }
          break
      }

      chart.setOption(option)
    }
  }, [chart, chartType])

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart} ref={chartRef}></div>
      <div className={styles.chartTitle}>会员级别占比</div>
    </div>
  )
}
