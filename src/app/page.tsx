import React from 'react';
import './home.sass';
import { Button } from 'antd';

const Home = () => (
  <div className="home_container">
    <div className='home-left'>
      <div className='button_group'>
        <Button>新增</Button>
        <Button>编辑</Button>
        <Button>删除</Button>
        <Button>新增</Button>
        <Button>编辑</Button>
        <Button>删除</Button>
      </div>
      <div className='data_show'></div>
      <div className='line_chart'></div>
    </div>
    <div className='home-right'></div>
  </div>
);

export default Home;