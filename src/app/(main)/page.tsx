"use client";
import React from "react";
import "./home.sass";
import { Button, ConfigProvider } from "antd";
import EChartsPie from "@components/echarts/pie";
import EChartsPlot from "@/components/echarts/plot";
import ScrollView from "@/components/scrollview/scrollview";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/dashboard/dashboard"

const pieData = [
  { value: 1048, name: "儿童绘本" },
  { value: 735, name: "科普绘本" },
  { value: 580, name: "故事绘本" },
  { value: 484, name: "其他" },
];

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
];

const xAxisData = ["Q1", "Q2", "Q3", "Q4"];
const plot_series = [
  {
    name: "Revenue",
    type: "line" as const,
    data: [5000, 6200, 8100, 9300],
    smooth: true,
  },
  {
    name: "Expenses",
    type: "line" as const,
    data: [4200, 5100, 6500, 7800],
    smooth: true,
  },
  {
    name: "Profit",
    type: "line" as const,
    data: [800, 1100, 1600, 1500],
    smooth: true,
  },
];

const Home = () => {
  const router = useRouter();

  // 页面跳转处理函数
  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
  };

  return (
    <div className="home_container">
      <div className="home_left">
        <div className="button_container left_first">
          <div
            style={{ color: "#F59A23", fontSize: "20", padding: "3px 1rem" }}
          >
            常用操作
          </div>
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
                  icon={
                    <img
                      src={button.icon || "/placeholder.svg"}
                      alt={button.text}
                      style={{ maxWidth: "80%" }}
                    />
                  }
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
            <Dashboard />
          </div>
          <div className="data_show_right pie_chart">
            <EChartsPie data={pieData} />
          </div>
        </div>
        <div className="plot_container left_third">
          <div className="plot">
            <EChartsPlot
              xAxisData={xAxisData}
              series={plot_series}
              // title="Quarterly Financial Performance"
            />
          </div>
        </div>
      </div>
      <div className="home_right">
        <div className="title_container">
          <img
            className="message_icon"
            src="/home/message.svg"
            width={"70px"}
            style={{position:"relative", top:"-10px", left:"-10px"}}
            alt="Message Icon"
          ></img>
          <div className="title" style={{position:"relative", top:"10px", left:"-15px"}}>消息通知</div>  
        </div>
        <ScrollView
          className="scrollview_msg"
        />
      </div>
    </div>
  );
};

export default Home;
