"use client";

import type React from "react"
import styles from "./dashboard.module.scss"

// Define types for our statistics data
export interface StatisticsData {
    totalCount: number
    todayBorrowings: number
    monthBorrowings: number
    activeUsers: number
    topBook: string
    averageBorrowDays: number
    newUsers: number
    insufficientInventory: number
    overdueBooks: number
  }
  
  // Default data (can be replaced with API data)
  const defaultData: StatisticsData = {
    totalCount: 100,
    todayBorrowings: 15,
    monthBorrowings: 50,
    activeUsers: 30,
    topBook: "《小红帽》",
    averageBorrowDays: 7,
    newUsers: 10,
    insufficientInventory: 5,
    overdueBooks: 3,
  }
  
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
    data?: StatisticsData
    loading?: boolean
  }
  
  const StatsDashboard: React.FC<StatsDashboardProps> = ({ data = defaultData, loading = false }) => {
    if (loading) {
      return <div className={styles.loading}>Loading statistics...</div>
    }
  
    return (
      <div className={styles.dashboard}>
        <div className={styles.grid}>
          <StatCard title="统计总数" value={data.totalCount} />
          <StatCard title="今日借阅" value={data.todayBorrowings} />
          <StatCard title="本月借阅" value={data.monthBorrowings} />
          <StatCard title="活跃用户" value={data.activeUsers} />
          <StatCard title="热门接本Top1" value={data.topBook} isSpecial={true} />
          <StatCard title="平均借阅时长（天）" value={data.averageBorrowDays} />
          <StatCard title="新增用户数" value={data.newUsers} />
          <StatCard title="给本库存不足数量" value={data.insufficientInventory} />
          <StatCard title="逾期未还总本数" value={data.overdueBooks} />
        </div>
      </div>
    )
  }
  
  export default StatsDashboard
  