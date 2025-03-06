"use client"
import React from 'react';
import './home.sass';
import { Button } from 'antd';
import EChartsPie from "@components/echarts/pie"
import { color } from 'echarts';
import { useRouter } from "next/navigation"

const pieData = [
  { value: 1048, name: "儿童绘本" },
  { value: 735, name: "科普绘本" },
  { value: 580, name: "故事绘本" },
  { value: 484, name: "其他" },
]

const Home = () => {
  const router = useRouter()

  // 页面跳转处理函数
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="home_container">
      <div className='home-left'>
        <div className='button_container left_first'>
          <div style={{ color: "#F59A23", fontSize: "20", padding: "3px 1rem" ,}}>常用操作</div>
          <div className="button_group">
            <Button style={{
              width: '16%',
              height: '100%',
              background: 'white',
              color: 'black',
              fontSize: '12px',
              lineHeight: '1'
            }} onClick={() => handleNavigation("/inventory")}>库存管理</Button>
            <Button style={{
              width: '16%',
              height: '20px',
              background: 'green',
              color: 'white',
              fontSize: '12px',
              padding: '0 8px',
              lineHeight: '1'
            }} onClick={() => handleNavigation("/vip")}>会员管理</Button>
            <Button style={{
              width: '16%',
              height: '20px',
              background: 'green',
              color: 'white',
              fontSize: '12px',
              padding: '0 8px',
              lineHeight: '1'
            }} onClick={() => handleNavigation("/activity")}>活动管理</Button>
            <Button style={{
              width: '16%',
              height: '20px',
              background: 'green',
              color: 'white',
              fontSize: '12px',
              padding: '0 8px',
              lineHeight: '1'
            }} onClick={() => handleNavigation("/books/borrow")}>绘本借阅</Button>
            <Button style={{
              width: '16%',
              height: '20px',
              background: 'green',
              color: 'white',
              fontSize: '12px',
              padding: '0 8px',
              lineHeight: '1'
            }} onClick={() => handleNavigation("/volunteer")}>志愿管理</Button>
            <Button style={{
              width: '16%',
              height: '20px',
              background: 'green',
              color: 'white',
              fontSize: '12px',
              padding: '0 8px',
              lineHeight: '1'
            }} onClick={() => handleNavigation("/books/donate")}>绘本捐赠</Button>
          </div>
        </div>

        <div className='data_show'>
          <div className='data_show_left data_grid'>
            left
          </div>
          <div className='data_show_right pie_chart'>
            <EChartsPie data={pieData} />
          </div>
        </div>
        <div className='line_chart'></div>
      </div>
      <div className='home-right'></div>
    </div>
  )

}



export default Home;