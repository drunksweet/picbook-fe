"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import styles from "./MemberCharts.module.scss";

type ChartType = "bar" | "pie" | "line" | "doughnut";

interface MemberChartProps {
  chartType?: ChartType;
}

export function MemberCharts({ chartType = "pie" }: MemberChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // 会员数据
  const memberData = [
    { value: 50, name: "普通会员" },
    { value: 30, name: "银卡会员" },
    { value: 20, name: "金卡会员" },
  ];

  // 颜色配置
  const colors = ["#FFB6C1", "#87CEFA", "#FFFACD"];

  // 初始化图表
  useEffect(() => {
    // 确保DOM元素存在
    if (!chartRef.current) return;

    // 创建图表实例
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // 响应式调整
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      chart.dispose();
      chartInstanceRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 只在组件挂载时执行一次

  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart) return;

    let option: echarts.EChartsOption = {};

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
        };
        break;

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
        };
        break;

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
            const baseValue = item.value;
            const data = Array(6)
              .fill(0)
              .map(() => Math.floor(baseValue * (0.8 + Math.random() * 0.4)));

            return {
              name: item.name,
              type: "line",
              stack: "Total",
              areaStyle: {},
              emphasis: {
                focus: "series",
              },
              data: data,
            };
          }),
        };
        break;

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
        };
        break;
    }
    // 使用clear()方法清除之前的图表内容
    chart.clear();
    // 设置新图表选项
    chart.setOption(option);
    // 强制重新渲染图表
    setTimeout(() => {
      chart.resize();
    }, 0);
  }, [chartType]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart} ref={chartRef}></div>
      <div className={styles.chartTitle}>会员级别占比</div>
    </div>
  );
}
