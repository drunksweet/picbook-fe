import { Card } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import type { ReactNode } from "react"
import "./StatisticCard.scss"

interface StatisticCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconBg: string
  iconColor: string
  trend?: string | number
  trendType?: "up" | "down"
  loading?: boolean
}

export default function StatisticCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendType,
  loading = false,
}: StatisticCardProps) {
  return (
    <Card className="statistic-card" loading={loading}>
      <div className="statistic-header">
        <div className="icon-wrapper" style={{ backgroundColor: iconBg }}>
          <span className="icon" style={{ color: iconColor }}>
            {icon}
          </span>
        </div>
        <div className="statistic-title">{title}</div>
      </div>
      <div className="statistic-value">{value}</div>
      {trend !== undefined && trendType !== undefined && (
        <div className="statistic-footer">
          <div className={`trend ${trendType}`}>
            {trendType === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {trend}
          </div>
        </div>
      )}
    </Card>
  )
}
