"use client"

import { useState, useRef } from "react"
import { ConfigProvider, App, Row, Col } from "antd"
import { FileTextOutlined, UserOutlined, NotificationOutlined, BarChartOutlined } from "@ant-design/icons"
import { Form } from "antd"
import dayjs from "dayjs"

import Banner from "@/components/banner"
import StatisticCard from "@/components/activity/StatisticCard"
import FunctionButtons from "@/components/activity/FunctionButtons"
import ActivityList, { type ActivityListRef } from "@/components/activity/ActivityList/ActivityList"
import AnnouncementList from "@/components/activity/Announce/AnnouncementList"
import ActivityFormModal from "@/components/activity/ActivityFormModal/ActivityFormModal"
import ActivityDetailModal from "@/components/activity/ActivityDetailModal/ActivityDetailModal"
import CancelActivityModal from "@/components/activity/CancelActivityModal"
import AnnouncementFormModal from "@/components/activity/Announce/AnnouncementFormModal"
import AnnouncementDetailModal from "@/components/activity/Announce/AnnouncementDetailModal"
import SignupManagementDrawer from "@/components/activity/SignupManagementDrawer"
import DataAnalysisDrawer from "@/components/activity/DataAnalysisDrawer"
import FeedbackDrawer from "@/components/activity/FeedbackDrawer"
import NotificationDrawer from "@/components/activity/NotificationDrawer"
import type { ActivityData } from "@/components/activity/ActivityCard/ActivityCard"
import type { AnnouncementData } from "@/components/activity/Announce/AnnouncementItem"
import { createActivity, updateActivity } from "@/api/activity/activity"

import "./page.scss"

const ActivityManagementPage = () => {
  const { message } = App.useApp()
  const [activeTab, setActiveTab] = useState("all")
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [activityDetailVisible, setActivityDetailVisible] = useState(false)
  const [announceModalVisible, setAnnounceModalVisible] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<ActivityData | null>(null)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementData | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [signupDrawerVisible, setSignupDrawerVisible] = useState(false)
  const [dataAnalysisDrawerVisible, setDataAnalysisDrawerVisible] = useState(false)
  const [feedbackDrawerVisible, setFeedbackDrawerVisible] = useState(false)
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false)
  const [announcementDetailVisible, setAnnouncementDetailVisible] = useState(false)
  const [form] = Form.useForm()
  const [announceForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 创建对ActivityList的引用
  const activityListRef = useRef<ActivityListRef>(null)

  // 统计数据
  const statistics = [
    {
      title: "发布活动总数",
      value: 14792,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
      trend: 135,
      trendType: "up" as "up" | "down",
    },
    {
      title: "报名人数",
      value: 4192,
      icon: <UserOutlined />,
      iconBg: "#FFF2F0",
      iconColor: "#FF4D4F",
      trend: 103,
      trendType: "down" as "up" | "down",
    },
    {
      title: "活动参与率",
      value: "83.12%",
      icon: <BarChartOutlined />,
      iconBg: "#F6FFED",
      iconColor: "#52C41A",
      trend: "1.25%",
      trendType: "up" as "up" | "down",
    },
    {
      title: "已完成活动数",
      value: 7102,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
      trend: 236,
      trendType: "up" as "up" | "down",
    },
    {
      title: "报名中活动数",
      value: 5292,
      icon: <NotificationOutlined />,
      iconBg: "#FFFBE6",
      iconColor: "#FAAD14",
      trend: 166,
      trendType: "up" as "up" | "down",
    },
    {
      title: "发布活动总数",
      value: 14792,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
      trend: 135,
      trendType: "up" as "up" | "down",
    },
  ]

  // 通知公告数据
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([
    {
      id: "1",
      title: "因电路改造，与2月1日停电的通知",
      content:
        "小区家电站点各维修改造，决定2月1日23时开始小区21、22、23、24、25楼停电。请各位业主提前做好停电准备，设备维修完成，将以第一时间通知大家。",
      time: "2024-01-31 10:11",
    },
    {
      id: "2",
      title: "关于举办春节联欢会的通知",
      content:
        "为丰富社区居民的文化生活，营造和谐喜庆的节日氛围，小区将于2024年2月8日晚上7点在活动中心举办春节联欢会。欢迎各位居民踊跃参与，共度佳节。",
      time: "2024-01-28 15:30",
    },
    {
      id: "3",
      title: "小区安全防范提示",
      content:
        "近期周边地区发生多起入室盗窃案件，提醒各位业主加强安全防范意识，外出时关好门窗，贵重物品妥善保管。发现可疑情况请立即联系物业或报警。",
      time: "2024-01-25 09:45",
    },
    {
      id: "4",
      title: "物业费缴纳温馨提醒",
      content:
        "尊敬的各位业主，2024年第一季度物业费已开始缴纳，请于2月15日前完成缴费。可通过物业APP、微信公众号或到物业服务中心缴纳。",
      time: "2024-01-20 11:23",
    },
  ])

  // 模拟报名数据
  const signupData = [
    { id: 1, name: "张三", phone: "137****1234", time: "2024-01-20 10:15", status: "已确认" },
    { id: 2, name: "李四", phone: "139****5678", time: "2024-01-20 11:30", status: "已确认" },
    { id: 3, name: "王五", phone: "158****9012", time: "2024-01-21 09:25", status: "待确认" },
    { id: 4, name: "赵六", phone: "186****3456", time: "2024-01-21 14:40", status: "待确认" },
    { id: 5, name: "钱七", phone: "135****7890", time: "2024-01-22 16:55", status: "已确认" },
  ]

  // 模拟反馈数据
  const feedbackData = [
    {
      id: 1,
      user: "王先生",
      content: "活动组织得很好，但场地有点小",
      time: "2024-01-25 10:30",
      activity: "亲子故事分享会",
    },
    {
      id: 2,
      user: "李女士",
      content: "希望能增加活动次数，很受欢迎",
      time: "2024-01-26 15:45",
      activity: "社区棋牌比赛",
    },
    {
      id: 3,
      user: "张先生",
      content: "活动内容丰富，但时间安排有点紧",
      time: "2024-01-27 09:20",
      activity: "健康讲座",
    },
    {
      id: 4,
      user: "刘女士",
      content: "希望能提供更多座位，参与人数太多",
      time: "2024-01-28 11:10",
      activity: "广场舞培训",
    },
  ]

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  // 创建活动相关函数
  const showCreateModal = () => {
    form.resetFields()
    setCreateModalVisible(true)
  }

  const handleCreateOk = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // 格式化日期和时间
      const date = values.date.format("YYYY-MM-DD")
      const startTime = values.timeRange[0].format("HH:mm:ss")
      const endTime = values.timeRange[1].format("HH:mm:ss")

      // 构建请求数据
      const requestData = {
        info: {
          activity_name: values.activity_name,
          activity_type: values.activity_type,
          addr: values.addr,
          manager: values.manager,
          phone: values.phone,
          start_time: `${date} ${startTime}`,
          end_time: `${date} ${endTime}`,
        },
      }

      // 调用API创建活动
      const response = await createActivity(requestData)

      message.success("活动创建成功！")
      setCreateModalVisible(false)

      // 刷新活动列表
      if (activityListRef.current) {
        activityListRef.current.refreshList()
      }
    } catch (error) {
      console.error("创建活动失败:", error)
      message.error("创建活动失败，请重试！")
    } finally {
      setLoading(false)
    }
  }

  // 编辑活动相关函数
  const showEditModal = (activity: ActivityData) => {
    setCurrentActivity(activity)

    // 解析时间
    const timeStr = activity.time
    const datePart = timeStr.split(" ")[0]
    const timePart = timeStr.split(" ")[1]
    const startTime = timePart.split("-")[0]
    const endTime = timePart.split("-")[1]

    editForm.setFieldsValue({
      activity_name: activity.title,
      activity_type: activity.type,
      date: dayjs(datePart),
      timeRange: [dayjs(startTime, "HH:mm"), dayjs(endTime, "HH:mm")],
      manager: activity.manager,
      phone: activity.contact,
      addr: activity.location,
      description: activity.description,
    })

    setEditModalVisible(true)
  }

  const handleEditOk = async () => {
    if (!currentActivity) {
      message.error("当前编辑的活动不存在！")
      return
    }

    try {
      setLoading(true)
      const values = await editForm.validateFields()

      // 格式化日期和时间
      const date = values.date.format("YYYY-MM-DD")
      const startTime = values.timeRange[0].format("HH:mm:ss")
      const endTime = values.timeRange[1].format("HH:mm:ss")

      // 构建请求数据
      const requestData = {
        activity_id: Number.parseInt(currentActivity.id),
        info: {
          activity_name: values.activity_name,
          activity_type: values.activity_type,
          addr: values.addr,
          manager: values.manager,
          phone: values.phone,
          start_time: `${date} ${startTime}`,
          end_time: `${date} ${endTime}`,
        },
      }

      // 调用API更新活动
      await updateActivity(requestData)

      message.success("活动修改成功！")
      setEditModalVisible(false)

      // 刷新活动列表
      if (activityListRef.current) {
        activityListRef.current.refreshList()
      }
    } catch (error) {
      console.error("更新活动失败:", error)
      message.error("更新活动失败，请重试！")
    } finally {
      setLoading(false)
    }
  }

  // 取消活动相关函数
  const showCancelModal = (activity: ActivityData) => {
    setCurrentActivity(activity)
    setCancelModalVisible(true)
  }

  const handleCancelActivity = () => {
    message.success("活动已取消！")
    setCancelModalVisible(false)

    // 刷新活动列表
    if (activityListRef.current) {
      activityListRef.current.refreshList()
    }
  }

  // 查看活动详情
  const showActivityDetail = (activity: ActivityData) => {
    setCurrentActivity(activity)
    setActivityDetailVisible(true)
  }

  // 发布公告相关函数
  const showAnnounceModal = () => {
    announceForm.resetFields()
    setAnnounceModalVisible(true)
  }

  const handleAnnounceOk = () => {
    announceForm
      .validateFields()
      .then((values) => {
        const newAnnouncement = {
          id: String(announcements.length + 1),
          title: values.title,
          content: values.content,
          time: dayjs().format("YYYY-MM-DD HH:mm"),
        }

        setAnnouncements([newAnnouncement, ...announcements])
        message.success("公告发布成功！")
        setAnnounceModalVisible(false)
      })
      .catch((info) => {
        console.log("验证失败:", info)
      })
  }

  // 查看公告详情
  const showAnnouncementDetail = (announcement: AnnouncementData) => {
    setCurrentAnnouncement(announcement)
    setAnnouncementDetailVisible(true)
  }

  // 报名管理
  const showSignupManagement = () => {
    setSignupDrawerVisible(true)
  }

  // 数据分析
  const showDataAnalysis = () => {
    setDataAnalysisDrawerVisible(true)
  }

  // 用户反馈
  const showFeedback = () => {
    setFeedbackDrawerVisible(true)
  }

  // 通知发送
  const showNotification = () => {
    setNotificationDrawerVisible(true)
  }

  const handleSearch = (value: string) => {
    message.info(`搜索关键词: ${value}`)
  }

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
        <Row gutter={32}>
          {statistics.map((stat, index) => (
            <Col span={24 / statistics.length} key={index}>
              <StatisticCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
                trend={stat.trend}
                trendType={stat.trendType}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={16}>
            {/* 常用功能 */}
            <FunctionButtons
              onCreateActivity={showCreateModal}
              onSignupManagement={showSignupManagement}
              onNotification={showNotification}
              onDataAnalysis={showDataAnalysis}
              onFeedback={showFeedback}
            />

            {/* 活动列表 */}
            <div style={{ marginTop: 16 }}>
              <ActivityList
                ref={activityListRef}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onSearch={handleSearch}
                onCreateActivity={showCreateModal}
                onViewActivityDetail={showActivityDetail}
                onEditActivity={showEditModal}
                onCancelActivity={showCancelModal}
              />
            </div>
          </Col>

          <Col span={8}>
            {/* 通知公告 */}
            <AnnouncementList
              announcements={announcements}
              onCreateAnnouncement={showAnnounceModal}
              onViewMore={() => message.info("查看更多通知")}
              onViewDetail={showAnnouncementDetail}
            />
          </Col>
        </Row>
      </div>

      {/* 创建活动模态框 */}
      <ActivityFormModal
        title="创建活动"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreateOk}
        form={form}
      />

      {/* 编辑活动模态框 */}
      <ActivityFormModal
        title="编辑活动"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditOk}
        form={editForm}
        initialValues={currentActivity || undefined}
      />

      {/* 活动详情模态框 */}
      <ActivityDetailModal
        visible={activityDetailVisible}
        onCancel={() => setActivityDetailVisible(false)}
        activity={currentActivity}
        signupData={signupData}
      />

      {/* 取消活动模态框 */}
      <CancelActivityModal
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelActivity}
        activity={currentActivity}
      />

      {/* 发布公告模态框 */}
      <AnnouncementFormModal
        visible={announceModalVisible}
        onCancel={() => setAnnounceModalVisible(false)}
        onOk={handleAnnounceOk}
        form={announceForm}
      />

      {/* 公告详情模态框 */}
      <AnnouncementDetailModal
        visible={announcementDetailVisible}
        onCancel={() => setAnnouncementDetailVisible(false)}
        announcement={currentAnnouncement}
      />

      {/* 报名管理抽屉 */}
      <SignupManagementDrawer
        visible={signupDrawerVisible}
        onClose={() => setSignupDrawerVisible(false)}
        signupData={signupData}
      />

      {/* 数据分析抽屉 */}
      <DataAnalysisDrawer visible={dataAnalysisDrawerVisible} onClose={() => setDataAnalysisDrawerVisible(false)} />

      {/* 用户反馈抽屉 */}
      <FeedbackDrawer
        visible={feedbackDrawerVisible}
        onClose={() => setFeedbackDrawerVisible(false)}
        feedbackData={feedbackData}
      />

      {/* 通知发送抽屉 */}
      <NotificationDrawer
        visible={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
        activities={[]}
      />
    </ConfigProvider>
  )
}

export default ActivityManagementPage
