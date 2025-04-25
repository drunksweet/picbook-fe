"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Avatar, List, message } from "antd"
import VirtualList from "rc-virtual-list"
import "./scrollview.scss"

interface ScrollViewProps {
  style?: React.CSSProperties
  className?: string
}

interface NotificationItem {
  id: string
  title: string
  time: string
  content: string
  type: "system" | "return" | "borrow" | "other"
  read: boolean
  avatar?: string
}

// 模拟数据
const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "系统更新通知",
    time: "2025-01-20 10:00",
    content: "系统将于今晚进行更新，请提前保存数据。",
    type: "system",
    read: false,
  },
  {
    id: "2",
    title: "绘本归还提醒",
    time: "2025-01-19 15:30",
    content: "用户张三借阅的《格林童话》将于明天到期，请及时提醒归还。",
    type: "return",
    read: false,
    avatar: "/home/avatar/user1.svg",
  },
  {
    id: "3",
    title: "新书入库通知",
    time: "2025-01-18 14:20",
    content: "新绘本《小王子》已入库，共10本，请及时上架。",
    type: "other",
    read: true,
  },
  {
    id: "4",
    title: "会员注册通知",
    time: "2025-01-18 11:15",
    content: "新会员李四已完成注册，请及时审核。",
    type: "other",
    read: false,
    avatar: "/home/avatar/user2.svg",
  },
  {
    id: "5",
    title: "借阅申请",
    time: "2025-01-17 16:45",
    content: "用户王五申请借阅《小红帽》，请及时处理。",
    type: "borrow",
    read: true,
    avatar: "/home/avatar/user3.svg",
  },
  {
    id: "6",
    title: "系统更新通知",
    time: "2025-01-17 10:00",
    content: "系统将于今晚进行更新，请提前保存数据。",
    type: "system",
    read: true,
  },
  {
    id: "7",
    title: "活动提醒",
    time: "2025-01-16 09:30",
    content: "周末绘本阅读活动将于本周六举行，请做好准备。",
    type: "other",
    read: false,
  },
  {
    id: "8",
    title: "绘本归还提醒",
    time: "2025-01-15 14:20",
    content: "用户赵六借阅的《白雪公主》已逾期3天，请及时催还。",
    type: "return",
    read: false,
    avatar: "/home/avatar/user4.svg",
  },
  {
    id: "9",
    title: "系统更新通知",
    time: "2025-01-15 10:00",
    content: "系统将于今晚进行更新，请提前保存数据。",
    type: "system",
    read: true,
  },
  {
    id: "10",
    title: "库存预警",
    time: "2025-01-14 11:30",
    content: "《小红帽》库存不足，剩余2本，请及时补充。",
    type: "other",
    read: false,
  },
  {
    id: "11",
    title: "系统更新通知",
    time: "2025-01-13 10:00",
    content: "系统将于今晚进行更新，请提前保存数据。",
    type: "system",
    read: true,
  },
  {
    id: "12",
    title: "会员续费通知",
    time: "2025-01-12 16:20",
    content: "会员张三的会员资格将于下周到期，请提醒续费。",
    type: "other",
    read: false,
    avatar: "/home/avatar/user1.svg",
  },
  {
    id: "13",
    title: "系统更新通知",
    time: "2025-01-12 10:00",
    content: "系统将于今晚进行更新，请提前保存数据。",
    type: "system",
    read: true,
  },
  {
    id: "14",
    title: "绘本捐赠通知",
    time: "2025-01-11 14:50",
    content: "收到用户李四捐赠的绘本5本，请及时入库。",
    type: "other",
    read: false,
    avatar: "/home/avatar/user2.svg",
  },
  {
    id: "15",
    title: "系统更新通知",
    time: "2025-01-11 10:00",
    content: "系统将于今晚进行更新，请提前保存数据。",
    type: "system",
    read: true,
  },
]

// 生成更多模拟数据的函数
const generateMoreData = (count: number): NotificationItem[] => {
  const types = ["system", "return", "borrow", "other"]
  const titles = ["系统更新通知", "绘本归还提醒", "借阅申请", "会员注册通知", "库存预警", "活动提醒", "新书入库通知"]
  const contents = [
    "系统将于今晚进行更新，请提前保存数据。",
    "用户{name}借阅的《{book}》将于明天到期，请及时提醒归还。",
    "用户{name}申请借阅《{book}》，请及时处理。",
    "新会员{name}已完成注册，请及时审核。",
    "《{book}》库存不足，剩余{num}本，请及时补充。",
    "周末绘本阅读活动将于本周六举行，请做好准备。",
    "新绘本《{book}》已入库，共{num}本，请及时上架。",
  ]
  const names = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九"]
  const books = ["小红帽", "白雪公主", "格林童话", "小王子", "丑小鸭", "灰姑娘", "三只小猪"]

  const result: NotificationItem[] = []

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * types.length)
    const type = types[typeIndex] as "system" | "return" | "borrow" | "other"
    const titleIndex = Math.floor(Math.random() * titles.length)
    const title = titles[titleIndex]

    const contentIndex = Math.floor(Math.random() * contents.length)
    let content = contents[contentIndex]

    const nameIndex = Math.floor(Math.random() * names.length)
    const name = names[nameIndex]

    const bookIndex = Math.floor(Math.random() * books.length)
    const book = books[bookIndex]

    const num = Math.floor(Math.random() * 10) + 1

    content = content.replace("{name}", name).replace("{book}", book).replace("{num}", num.toString())

    // 生成随机日期，最近30天内
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0")
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0")
    const time = `${year}-${month}-${day} ${hours}:${minutes}`

    const avatar = type === "system" ? undefined : `/home/avatar/user${Math.floor(Math.random() * 4) + 1}.svg`

    result.push({
      id: `generated-${mockNotifications.length + i}`,
      title,
      time,
      content,
      type,
      read: Math.random() > 0.7, // 30% 概率已读
      avatar,
    })
  }

  return result
}

export default function ScrollView({ style, className = "tang_scrollview" }: ScrollViewProps) {
  const [data, setData] = useState<NotificationItem[]>([])
  const [height, setHeight] = useState(0) // 用于存储父容器的高度
  const listRef = useRef<HTMLDivElement>(null) // 用于获取父容器的引用

  const appendData = (showMessage = true) => {
    // 生成20条新的模拟数据
    const newData = generateMoreData(20)
    setData(data.concat(newData))
    showMessage && message.success(`${newData.length} 条新消息已加载!`)
  }

  useEffect(() => {
    // 初始加载模拟数据
    setData(mockNotifications)
  }, [])

  useEffect(() => {
    // 动态获取父容器的高度
    if (listRef.current) {
      setHeight(listRef.current.clientHeight)
    }

    // 监听窗口大小变化，动态调整高度
    const handleResize = () => {
      if (listRef.current) {
        setHeight(listRef.current.clientHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    // 清理事件监听器
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      Math.abs(
        Number(e.currentTarget.scrollHeight) - Number(e.currentTarget.scrollTop) - Number(e.currentTarget.clientHeight),
      ) <= 1
    ) {
      appendData()
    }
  }

  // 根据消息类型获取图标
  const getIconByType = (type: string) => {
    switch (type) {
      case "system":
        return "/home/icons/system.svg"
      case "return":
        return "/home/icons/return.svg"
      case "borrow":
        return "/home/icons/borrow.svg"
      default:
        return "/home/icons/notification.svg"
    }
  }

  return (
    <div ref={listRef} className={className} style={{ ...style, height: "100%" }}>
      <List className="notification-list">
        <VirtualList
          data={data}
          height={height} // 使用动态计算的高度
          itemHeight={80} // 调整每项的高度
          itemKey="id"
          onScroll={onScroll}
        >
          {(item: NotificationItem) => (
            <List.Item key={item.id} className={`notification-item ${!item.read ? "unread" : ""}`}>
              <List.Item.Meta
                // avatar={
                //   item.avatar ? (
                //     <Avatar src={item.avatar} />
                //   ) : (
                //     <Avatar icon={<img src={getIconByType(item.type) || "/placeholder.svg"} alt={item.type} />} />
                //   )
                // }
                title={<div className="notification-title">{item.title}</div>}
                description={
                  <div className="notification-content">
                    <div className="notification-time">{item.time}</div>
                    <div className="notification-text">{item.content}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  )
}
