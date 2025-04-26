"use client"

import type React from "react"
import styles from "./dashboard.module.sass"
import type { HomeDataResponse } from "@/api/home/home"

interface StatCardProps {
  title: string
  value: string | number
  isSpecial?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ title, value, isSpecial = false }) => (
  <div className={styles.card}>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={`${styles.cardValue} ${isSpecial ? styles.specialValue : ""}`}>{value}</p>
    </div>
  </div>
)

interface StatsDashboardProps {
  data?: HomeDataResponse | null
  loading?: boolean
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ data, loading = false }) => {
  if (loading) {
    return <div className={styles.loading}>加载中...</div>
  }

  // 如果没有数据，使用默认值
  const totalCount = data?.total_stock ?? 0
  const todayBorrowings = data?.today_borrowed ?? 0
  const monthBorrowings = data?.month_borrowed ?? 0
  const activeUsers = data?.active_users ?? 0
  const topBook = data?.hot_book ?? "暂无数据"
  const averageBorrowDays = data?.avg_borrow_duration ?? 0
  const newUsers = data?.new_users ?? 0
  const insufficientInventory = data?.low_stock_count ?? 0
  const overdueBooks = data?.overdue_books ?? 0

  return (
    <div className={styles.dashboard}>
      <div className={styles.grid}>
        <StatCard title="统计总数" value={totalCount} />
        <StatCard title="今日借阅" value={todayBorrowings} />
        <StatCard title="本月借阅" value={monthBorrowings} />
        <StatCard title="活跃用户" value={activeUsers} />
        <StatCard title="热门绘本Top1" value={topBook} isSpecial={true} />
        <StatCard title="平均借阅时长（天）" value={averageBorrowDays} />
        <StatCard title="新增用户数" value={newUsers} />
        <StatCard title="绘本库存不足数量" value={insufficientInventory} />
        <StatCard title="逾期未还总本数" value={overdueBooks} />
      </div>
    </div>
  )
}

export default StatsDashboard
