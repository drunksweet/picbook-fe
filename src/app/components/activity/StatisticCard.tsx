import { Card} from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import type { ReactNode } from "react"
import "./StatisticCard.scss"

interface StatisticCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconBg: string
  iconColor: string
  trend: string | number
  trendType: "up" | "down"
}

export default function StatisticCard({ title, value, icon, iconBg, iconColor, trend, trendType }: StatisticCardProps) {
  return (
    <Card className="statistic-card">
      <div className="statistic-header">
        <div className="icon-wrapper" style={{ backgroundColor: iconBg }}>
          <span className="icon" style={{ color: iconColor }}>
            {icon}
          </span>
        </div>
        <div className="statistic-title">{title}</div>
      </div>
      <div className="statistic-value">{value}</div>
      <div className="statistic-footer">
        <span className="label">较上月</span>
        <span className={`trend ${trendType === "up" ? "up" : "down"}`}>
          {trendType === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {trend}
        </span>
      </div>
    </Card>
  )
}
