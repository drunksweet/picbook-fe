"use client"
import "./home.sass"
import { Button, ConfigProvider } from "antd"
import EChartsPie from "@/components/echarts/home/pie"
import EChartsPlot from "@/components/echarts/home/plot"
import ScrollView from "@/components/scrollview/scrollview"
import { useRouter } from "next/navigation"
import Dashboard from "@/components/dashboard/dashboard"
import { useState, useEffect } from "react"
import { getHomeData, type HomeDataResponse } from "@/api/home/home"

const pieData = [
  { value: 1048, name: "儿童绘本" },
  { value: 735, name: "科普绘本" },
  { value: 580, name: "故事绘本" },
  { value: 484, name: "其他" },
]

// 定义按钮数据
const buttonData = [
  {
    icon: "/home/button/btn_inventory.svg",
    text: "库存管理",
    path: "/inventory",
  },
  {
    icon: "/home/button/btn_vip.svg",
    text: "会员管理",
    path: "/vip",
  },
  {
    icon: "/home/button/btn_activity.svg",
    text: "活动管理",
    path: "/activity",
  },
  {
    icon: "/home/button/btn_borrow.svg",
    text: "绘本借阅",
    path: "/books/borrow",
  },
  {
    icon: "/home/button/btn_volunteer.svg",
    text: "志愿管理",
    path: "/volunteer",
  },
  {
    icon: "/home/button/btn_donate.svg",
    text: "绘本捐赠",
    path: "/books/donate",
  },
]

const Home = () => {
  const router = useRouter()

  const [homeData, setHomeData] = useState<HomeDataResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData()
        console.log("获取到的首页数据:", data) // 添加日志便于调试
        setHomeData(data)
        setLoading(false)
      } catch (error) {
        console.error("获取首页数据失败:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getMonthlyData = () => {
    // 获取当前日期
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // JavaScript月份从0开始

    // 生成最近6个月的月份列表
    const last6Months: any[] = []
    for (let i = 0; i < 6; i++) {
      let month = currentMonth - i
      let year = currentYear

      if (month <= 0) {
        month += 12
        year -= 1
      }

      // 格式化为 "YYYY-MM" 格式
      const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`
      last6Months.unshift(formattedMonth) // 添加到数组开头，保持时间顺序
    }

    // 准备图表数据
    const xAxisData = last6Months.map((monthStr) => {
      const month = Number.parseInt(monthStr.split("-")[1])
      return `${month}月`
    })

    // 初始化数据数组，默认全部为0
    const borrowCounts = new Array(6).fill(0)

    // 如果有API数据，则填充对应月份的数据
    if (homeData && homeData.monthly_borrowed && homeData.monthly_borrowed.length > 0) {
      homeData.monthly_borrowed.forEach((item) => {
        const index = last6Months.indexOf(item.month)
        if (index !== -1) {
          borrowCounts[index] = item.borrow_count
        }
      })
    }

    return {
      xAxisData,
      series: [
        {
          name: "借阅量",
          type: "line" as const,
          data: borrowCounts,
          smooth: true,
        },
      ],
    }
  }

  const { xAxisData: monthlyXAxis, series: monthlySeries } = getMonthlyData()

  // 页面跳转处理函数
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // 按钮样式
  const buttonStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    width: "16%",
    height: "100%",
    color: "black",
    fontSize: "12px",
    lineHeight: "1",
  }

  return (
    <div className="home_container">
      <div className="home_left">
        <div className="button_container left_first">
          <div style={{ color: "#F59A23", fontSize: "20", padding: "3px 1rem" }}>常用操作</div>
          <div className="button_group">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBg: "white",
                    defaultHoverBg: "#fac278",
                    defaultBorderColor: "#F59A23",
                    defaultHoverBorderColor: "#F59A23",
                  },
                },
              }}
            >
              {buttonData.map((button, index) => (
                <Button
                  key={index}
                  icon={<img src={button.icon || "/placeholder.svg"} alt={button.text} style={{ maxWidth: "80%" }} />}
                  style={{
                    ...buttonStyle,
                  }}
                  onClick={() => handleNavigation(button.path)}
                >
                  {button.text}
                </Button>
              ))}
            </ConfigProvider>
          </div>
        </div>

        <div className="data_show left_second">
          <div className="data_show_left data_grid">
            <Dashboard data={homeData} loading={loading} />
          </div>
          <div className="data_show_right pie_chart">
            <EChartsPie data={pieData} />
          </div>
        </div>
        <div className="plot_container left_third">
          <div className="plot">
            <EChartsPlot xAxisData={monthlyXAxis} series={monthlySeries} title="月度借阅统计" />
          </div>
        </div>
      </div>
      <div className="home_right">
        <div className="title_container">
          <img
            className="message_icon"
            src="/home/message.svg"
            width={"70px"}
            style={{ position: "relative", top: "-10px", left: "-10px" }}
            alt="Message Icon"
          ></img>
          <div className="title" style={{ position: "relative", top: "10px", left: "-15px" }}>
            消息通知
          </div>
        </div>
        <ScrollView className="scrollview_msg" />
      </div>
    </div>
  )
}

export default Home
