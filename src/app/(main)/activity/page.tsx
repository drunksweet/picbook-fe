"use client";

import { useState } from "react";
import {
  ConfigProvider,
  App,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Input,
  Tag,
  Space,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SoundOutlined,
  FileTextOutlined,
  UserOutlined,
  NotificationOutlined,
  BarChartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Banner from "@/components/banner";
import "./page.scss";

const { TabPane } = Tabs;
const { Search } = Input;

const ActivityManagementPage = () => {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState("all");

  // 统计数据
  const statistics = [
    {
      title: "发布活动总数",
      value: 14792,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
      trend: 135,
      trendType: "up",
    },
    {
      title: "报名人数",
      value: 4192,
      icon: <UserOutlined />,
      iconBg: "#FFF2F0",
      iconColor: "#FF4D4F",
      trend: 103,
      trendType: "down",
    },
    {
      title: "活动参与率",
      value: "83.12%",
      icon: <BarChartOutlined />,
      iconBg: "#F6FFED",
      iconColor: "#52C41A",
      trend: "1.25%",
      trendType: "up",
    },
    {
      title: "已完成活动数",
      value: 7102,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
      trend: 236,
      trendType: "up",
    },
    {
      title: "报名中活动数",
      value: 5292,
      icon: <NotificationOutlined />,
      iconBg: "#FFFBE6",
      iconColor: "#FAAD14",
      trend: 166,
      trendType: "up",
    },
    {
      title: "发布活动总数",
      value: 14792,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
      trend: 135,
      trendType: "up",
    },
  ];

  // 活动数据
  const activities = [
    {
      id: "1",
      title: "亲子故事分享会",
      type: "亲子互动",
      time: "2024-01-31 10:30-12:30",
      manager: "陈志*",
      contact: "189****4032",
      location: "23幢1单元1楼单元门进入XXXXXXXXXXXXXXXXX",
      status: "报名中",
    },
    {
      id: "2",
      title: "亲子故事分享会",
      type: "亲子互动",
      time: "2024-01-31 10:30-12:30",
      manager: "陈志*",
      contact: "189****4032",
      location: "23幢1单元1楼单元门进入XXXXXXXXXXXXXXXXX",
      status: "进行中",
    },
    {
      id: "3",
      title: "亲子故事分享会",
      type: "亲子互动",
      time: "2024-01-31 10:30-12:30",
      manager: "陈志*",
      contact: "189****4032",
      location: "23幢1单元1楼单元门进入XXXXXXXXXXXXXXXXX",
      status: "已结束",
    },
    {
      id: "4",
      title: "亲子故事分享会",
      type: "亲子互动",
      time: "2024-01-31 10:30-12:30",
      manager: "陈志*",
      contact: "189****4032",
      location: "23幢1单元1楼单元门进入XXXXXXXXXXXXXXXXX",
      status: "报名中",
    },
  ];

  // 通知公告数据
  const announcements = [
    {
      id: "1",
      title: "因电路改造，与2月1日停电的通知",
      content:
        "小区家电站点各维修改造，决定2月1日23时开始小区21、22、23、24、25楼停电。请各位业主提前做好停电准备，设备维修完成，将以第一时间通知大家。",
      time: "2024-01-31 10:11",
    },
    {
      id: "2",
      title: "因电路改造，与2月1日停电的通知",
      content:
        "小区家电站点各维修改造，决定2月1日23时开始小区21、22、23、24、25楼停电。请各位业主提前做好停电准备，设备维修完成，将以第一时间通知大家。",
      time: "2024-01-31 10:11",
    },
    {
      id: "3",
      title: "因电路改造，与2月1日停电的通知",
      content:
        "小区家电站点各维修改造，决定2月1日23时开始小区21、22、23、24、25楼停电。请各位业主提前做好停电准备，设备维修完成，将以第一时间通知大家。",
      time: "2024-01-31 10:11",
    },
    {
      id: "4",
      title: "因电路改造，与2月1日停电的通知",
      content:
        "小区家电站点各维修改造，决定2月1日23时开始小区21、22、23、24、25楼停电。请各位业主提前做好停电准备，设备维修完成，将以第一时间通知大家。",
      time: "2024-01-31 10:11",
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleCreateActivity = () => {
    message.info("创建活动");
  };

  const handleSearch = (value: string) => {
    message.info(`搜索关键词: ${value}`);
  };

  const handleEditActivity = (id: string) => {
    message.info(`编辑活动 ID: ${id}`);
  };

  const handleCancelActivity = (id: string) => {
    message.info(`取消活动 ID: ${id}`);
  };

  const handlePublishAnnouncement = () => {
    message.info("发布公告");
  };

  const handleViewMore = (type: string) => {
    message.info(`查看更多 ${type}`);
  };

  // 根据状态获取活动卡片的样式类名
  const getActivityCardClass = (status: string) => {
    switch (status) {
      case "报名中":
        return "activity-card signup";
      case "进行中":
        return "activity-card ongoing";
      case "已结束":
        return "activity-card ended";
      default:
        return "activity-card";
    }
  };

  // 过滤活动
  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((activity) => {
          if (activeTab === "signup") return activity.status === "报名中";
          if (activeTab === "ongoing") return activity.status === "进行中";
          if (activeTab === "ended") return activity.status === "已结束";
          return true;
        });

  return (
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
        token: {
          colorPrimary: "#F59A23",
          colorLink: "#F59A23",
        },
      }}
    >
      <Banner title="活动管理" />

      <div className="page-content">
        {/* 统计数据卡片 */}
        {/* <div className="statistics-section"> */}
        <Row gutter={32}>
          {statistics.map((stat, index) => (
            <Col span={24 / statistics.length} key={index}>
              <Card className="statistic-card">
                <div className="statistic-header">
                  <div
                    className="icon-wrapper"
                    style={{ backgroundColor: stat.iconBg }}
                  >
                    <span className="icon" style={{ color: stat.iconColor }}>
                      {stat.icon}
                    </span>
                  </div>
                  <div className="statistic-title">{stat.title}</div>
                </div>
                <div className="statistic-value">{stat.value}</div>
                <div className="statistic-footer">
                  <span className="label">较上月</span>
                  <span
                    className={`trend ${
                      stat.trendType === "up" ? "up" : "down"
                    }`}
                  >
                    {stat.trendType === "up" ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    {stat.trend}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        {/* </div> */}

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={16}>
            {/* 常用功能 */}
            <Card className="section-card">
              <div className="function-buttons">
                <Button
                  type="primary"
                  className="function-button"
                  onClick={handleCreateActivity}
                >
                  <FileTextOutlined />
                  活动创建
                </Button>
                <Button type="primary" className="function-button">
                  <UserOutlined />
                  报名管理
                </Button>
                <Button type="primary" className="function-button">
                  <NotificationOutlined />
                  通知发送
                </Button>
                <Button type="primary" className="function-button">
                  <BarChartOutlined />
                  数据分析
                </Button>
                <Button type="primary" className="function-button">
                  <CommentOutlined />
                  用户反馈
                </Button>
              </div>
            </Card>

            {/* 活动列表 */}
            <Card className="section-card" style={{ marginTop: 16 }}>
              <div className="section-header">
                <div className="tabs-container">
                  <Button
                    type={activeTab === "all" ? "primary" : "default"}
                    onClick={() => handleTabChange("all")}
                  >
                    所有活动
                  </Button>
                  <Button
                    type={activeTab === "category" ? "primary" : "default"}
                    onClick={() => handleTabChange("category")}
                  >
                    分类
                  </Button>
                  <Search
                    placeholder="亲子互动"
                    onSearch={handleSearch}
                    style={{ width: 200, marginLeft: 8 }}
                  />
                  <div className="status-tags">
                    <Tag
                      color={activeTab === "signup" ? "#1890FF" : "default"}
                      onClick={() => handleTabChange("signup")}
                    >
                      报名中
                    </Tag>
                    <Tag
                      color={activeTab === "ongoing" ? "#F59A23" : "default"}
                      onClick={() => handleTabChange("ongoing")}
                    >
                      进行中
                    </Tag>
                    <Tag
                      color={activeTab === "ended" ? "#FF4D4F" : "default"}
                      onClick={() => handleTabChange("ended")}
                    >
                      已结束
                    </Tag>
                  </div>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateActivity}
                >
                  去创建
                </Button>
              </div>

              <div className="activity-list">
                <Row gutter={[16, 16]}>
                  {filteredActivities.map((activity) => (
                    <Col span={12} key={activity.id}>
                      <div className={getActivityCardClass(activity.status)}>
                        <div className="activity-header">
                          <div className="activity-title">
                            活动名称：{activity.title}
                          </div>
                          <div className="activity-status">
                            {activity.status}
                          </div>
                        </div>
                        <div className="activity-info">
                          <div className="info-item">
                            <span className="label">事件类型：</span>
                            <span className="value">{activity.type}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">活动时间：</span>
                            <span className="value">{activity.time}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">负责人：</span>
                            <span className="value">{activity.manager}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">联系方式：</span>
                            <span className="value">{activity.contact}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">活动地点：</span>
                            <span className="value">{activity.location}</span>
                          </div>
                        </div>
                        <div className="activity-actions">
                          <Button
                            type="link"
                            onClick={() => handleEditActivity(activity.id)}
                          >
                            修改
                          </Button>
                          <Button
                            type="link"
                            onClick={() => handleCancelActivity(activity.id)}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            {/* 通知公告 */}
            <Card className="section-card">
              <div className="section-header">
                <h3>通知公告</h3>
                <div>
                  <Button type="primary" onClick={handlePublishAnnouncement}>
                    去发布
                  </Button>
                  <Button type="link" onClick={() => handleViewMore("通知")}>
                    更多
                  </Button>
                </div>
              </div>
              <div className="announcement-list">
                {announcements.map((announcement) => (
                  <div className="announcement-item" key={announcement.id}>
                    <div className="announcement-icon">
                      <SoundOutlined />
                    </div>
                    <div className="announcement-content">
                      <div className="announcement-title">
                        {announcement.title}
                      </div>
                      <div className="announcement-text">
                        {announcement.content}
                      </div>
                      <div className="announcement-footer">
                        <span className="time">{announcement.time}</span>
                        <Button type="link">查看详情</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default ActivityManagementPage;
