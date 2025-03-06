"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import type { EChartsOption } from "echarts"

interface EChartsPieProps {
    data: Array<{ value: number; name: string }>
    height?: string
    width?: string
}

export default function EChartsPie({ data, height = "100%", width = "100%" }: EChartsPieProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const chartInstance = useRef<echarts.ECharts | null>(null)

    useEffect(() => {
        // 只在客户端渲染时初始化图表
        if (!chartRef.current) return

        // 如果已经有实例，先销毁
        if (chartInstance.current) {
            chartInstance.current.dispose()
        }

        // 初始化图表
        const chart = echarts.init(chartRef.current)
        chartInstance.current = chart

        // 配置选项
        const option: EChartsOption = {
            tooltip: {
                trigger: "item",
            },
            legend: {
                // type: "scroll",
                top: "3%",
                padding: 1,
                left: "center",

                itemWidth: 40,
                itemHeight: 15,
                itemGap: 5,
            },
            series: [
                {
                    //   name: "",
                    type: "pie",
                    radius: ["40%", "65%"],
                    center: ["50%", "60%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        // borderColor: ,
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: "center",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: "bold",
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: data,
                },
            ],
            grid: {
                containLabel: true,
            },
        }

        // 设置选项
        chart.setOption(option)

        // 处理窗口大小变化
        const handleResize = () => {
            chart.resize()
        }
        window.addEventListener("resize", handleResize)

        // 立即调整大小以适应容器
        chart.resize()
        // 清理函数
        return () => {
            window.removeEventListener("resize", handleResize)
            if (chartInstance.current) {
                chartInstance.current.dispose()
                chartInstance.current = null
            }
        }
    }, [data])

    return <div ref={chartRef} style={{ width, height }} />
}

