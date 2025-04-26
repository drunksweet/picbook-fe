"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import styles from "./MemberCharts.module.scss"
import { getVipStatics } from "@/api/vip/vip"

type ChartType = "bar" | "pie" | "line" | "doughnut"

interface MemberChartProps {
  chartType?: ChartType
}

export function MemberCharts({ chartType = "pie" }: MemberChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState([
    { value: 0, name: "普通会员" },
    { value: 0, name: "银卡会员" },
    { value: 0, name: "金卡会员" },
  ])

  // 颜色配置
  const colors = ["#FFB6C1", "#87CEFA", "#FFFACD"]

  // 获取会员数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVipStatics()
        console.log("获取到的会员统计数据:", data)

        // 更新会员数据
        setMemberData([
          { value: data.normal_num || 0, name: "普通会员" },
          { value: data.silver_num || 0, name: "银卡会员" },
          { value: data.gold_num || 0, name: "金卡会员" },
        ])

        setLoading(false)
      } catch (error) {
        console.error("获取会员统计数据失败:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 渲染图表
  useEffect(() => {
    // 如果还在加载或者DOM元素不存在，则不渲染图表
    if (loading || !chartRef.current) return

    // 确保DOM元素已经渲染完成
    setTimeout(() => {
      try {
        // 销毁可能存在的旧实例
        const existingChart = echarts.getInstanceByDom(chartRef.current!)
        if (existingChart) {
          existingChart.dispose()
        }

        // 创建新的图表实例
        const chart = echarts.init(chartRef.current)

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

          case "line":
            // 为每个会员类型生成固定的线图数据，避免随机数据导致的水合不匹配
            const lineData: echarts.LineSeriesOption[] = memberData.map((item) => {
              const baseValue = item.value
              // 使用固定的计算方式而不是随机数
              return {
                name: item.name,
                type: "line",
                stack: "Total",
                areaStyle: {},
                emphasis: {
                  focus: "series",
                },
                data: [
                  Math.round(baseValue * 0.8),
                  Math.round(baseValue * 0.9),
                  Math.round(baseValue * 1.0),
                  Math.round(baseValue * 1.1),
                  Math.round(baseValue * 1.2),
                  Math.round(baseValue * 1.3),
                ],
              }
            })

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
              series: lineData,
            }
            break
        }

        // 设置图表选项
        chart.setOption(option)

        // 添加窗口大小变化的监听器
        const handleResize = () => {
          chart.resize()
        }
        window.addEventListener("resize", handleResize)

        // 清理函数
        return () => {
          chart.dispose()
          window.removeEventListener("resize", handleResize)
        }
      } catch (error) {
        console.error("渲染图表失败:", error)
      }
    }, 100) // 延迟100ms确保DOM已经渲染完成
  }, [chartType, loading, memberData])

  return (
    <div className={styles.chartContainer}>
      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : (
        <>
          <div className={styles.chart} ref={chartRef}></div>
          <div className={styles.chartTitle}>会员级别占比</div>
        </>
      )}
    </div>
  )
}
