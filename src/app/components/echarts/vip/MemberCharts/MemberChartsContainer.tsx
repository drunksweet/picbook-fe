"use client"

import { useState } from "react"
import { Button } from "antd"
import { MemberCharts } from "./MerberCharts"
import styles from "./MemberChartsContainer.module.scss"

type ChartType = "bar" | "pie" | "line" | "doughnut"

export function MemberChartsContainer() {
  const [chartType, setChartType] = useState<ChartType>("pie")

  return (
    <div className={styles.chartContainerWrapper}>
      <div className={styles.chartContent}>
        <div className={styles.chartMain}>
          <MemberCharts chartType={chartType} />
        </div>

        <div className={styles.chartButtons}>
          <Button
            className={`${styles.chartTypeButton} ${chartType === "pie" ? styles.active : ""}`}
            onClick={() => setChartType("pie")}
          >
            饼图
          </Button>
          <Button
            className={`${styles.chartTypeButton} ${chartType === "bar" ? styles.active : ""}`}
            onClick={() => setChartType("bar")}
          >
            柱状图
          </Button>
          <Button
            className={`${styles.chartTypeButton} ${chartType === "line" ? styles.active : ""}`}
            onClick={() => setChartType("line")}
          >
            折线图
          </Button>
          <Button
            className={`${styles.chartTypeButton} ${chartType === "doughnut" ? styles.active : ""}`}
            onClick={() => setChartType("doughnut")}
          >
            环形图
          </Button>
        </div>
      </div>
    </div>
  )
}
