"use client"

import { useState, useRef, useEffect } from "react"
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
import { createActivity, updateActivity, getActivityStatics } from "@/api/activity/activity"

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
  const [statisticsLoading, setStatisticsLoading] = useState(false)
  const [statisticsData, setStatisticsData] = useState({
    total_num: 0,
    total_applicants: 0,
    activity_participation_rate: 0,
    ended_num: 0,
    ongoing_num: 0,
    upcoming_num: 0,
  })

  // 创建对ActivityList的引用
  const activityListRef = useRef<ActivityListRef>(null)

  // 获取活动统计数据
  const fetchActivityStatics = async () => {
    setStatisticsLoading(true)
    try {
      const data = await getActivityStatics()
      setStatisticsData(data)
    } catch (error) {
      console.error("获取活动统计数据失败:", error)
      message.error("获取活动统计数据失败")
    } finally {
      setStatisticsLoading(false)
    }
  }

  // 初始加载时获取统计数据
  useEffect(() => {
    fetchActivityStatics()
  }, [])

  // 统计数据卡片配置
  const statisticsConfig = [
    {
      title: "发布活动总数",
      value: statisticsData.total_num,
      icon: <FileTextOutlined />,
      iconBg: "#E6F7FF",
      iconColor: "#1890FF",
    },
    {
      title: "报名人数",
      value: statisticsData.total_applicants,
      icon: <UserOutlined />,
      iconBg: "#FFF2F0",
      iconColor: "#FF4D4F",
    },
    {
      title: "活动参与率",
      value: `${(statisticsData.activity_participation_rate * 100).toFixed(2)}%`,
      icon: <BarChartOutlined />,
      iconBg: "#F6FFED",
      iconColor: "#52C41A",
    },
    {
      title: "已结束活动数",
      value: statisticsData.ended_num,
      icon: <FileTextOutlined />,
      iconBg: "#dce5ea",
      iconColor: "#6e757b",
    },
    {
      title: "进行中活动数",
      value: statisticsData.ongoing_num,
      icon: <NotificationOutlined />,
      iconBg: "#e6f5ff",
      iconColor: "#14a6fa",
    },
    {
      title: "报名中活动数",
      value: statisticsData.upcoming_num,
      icon: <FileTextOutlined />,
      iconBg: "#fffde6",
      iconColor: "#f0e739",
    },
  ]

  // 通知公告数据 - 添加更多丰富的模拟数据
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([
    {
      id: "1",
      title: "关于举办“阅读之星”评选活动的通知",
      content:
        "为了激发广大读者的阅读兴趣，培养良好的阅读习惯，我们将于下月举办“阅读之星”评选活动。活动将评选出年度阅读量最高、阅读笔记最优质的读者，并颁发证书和奖品。欢迎广大读者积极参与！\n\n活动时间：2024年3月1日至3月31日\n参与方式：在图书馆借阅系统中登记参与\n评选标准：借阅量、阅读笔记质量、参与读书会次数\n奖励设置：一等奖1名，奖励价值500元图书券；二等奖3名，奖励价值300元图书券；三等奖5名，奖励价值100元图书券。\n\n请广大读者踊跃参与！",
      time: "2024-02-15 09:30",
    },
    {
      id: "2",
      title: "图书馆春节期间开放时间调整通知",
      content:
        "尊敬的读者：\n\n根据国家法定节假日安排，结合我馆实际情况，现将2024年春节期间图书馆开放时间调整通知如下：\n\n2024年2月9日（除夕）：上午9:00-12:00，下午闭馆\n2024年2月10日至2月12日（初一至初三）：闭馆\n2024年2月13日至2月17日（初四至初八）：上午9:00-12:00，下午14:00-17:00\n2024年2月18日（初九）起：恢复正常开放时间\n\n请广大读者相互转告，合理安排借阅时间。如有借阅图书到期日在闭馆期间的，将自动顺延至开馆后的第一个工作日。\n\n祝广大读者春节快乐，阖家幸福！",
      time: "2024-01-31 10:11",
    },
    {
      id: "3",
      title: "关于举办春季亲子阅读活动的通知",
      content:
        "为丰富儿童的课余生活，培养良好的阅读习惯，我们将于3月份举办春季亲子阅读系列活动。活动内容包括绘本故事会、亲子手工制作、儿童剧表演等。欢迎家长带领孩子踊跃参与！\n\n活动时间：每周六上午10:00-11:30\n活动地点：图书馆二楼儿童阅览室\n参与对象：3-8岁儿童及其家长\n报名方式：扫描下方二维码或到图书馆前台登记\n\n具体活动安排：\n3月2日：《小熊和最好的爸爸》绘本故事会\n3月9日：春天主题手工制作\n3月16日：《三只小猪》儿童剧表演\n3月23日：亲子共读交流会\n3月30日：春季阅读嘉年华\n\n期待您和孩子的参与！",
      time: "2024-02-20 14:45",
    },
    {
      id: "4",
      title: "新书到馆通知",
      content:
        "尊敬的读者：\n\n我馆近期新增图书300余册，涵盖文学、历史、科普、艺术等多个领域。部分热门新书如下：\n\n1.《人类简史》（尤瓦尔·赫拉利）\n2.《活着》（余华）\n3.《时间简史》（史蒂芬·霍金）\n4.《百年孤独》（加西亚·马尔克斯）\n5.《三体》三部曲（刘慈欣）\n6.《明朝那些事儿》（当年明月）\n7.《小王子》（安托万·德·圣-埃克苏佩里）\n8.《围城》（钱钟书）\n9.《平凡的世界》（路遥）\n10.《追风筝的人》（卡勒德·胡赛尼）\n\n新书已上架，欢迎广大读者前来借阅！",
      time: "2024-02-05 11:23",
    },
    {
      id: "5",
      title: '关于开展"书香社区"创建活动的通知',
      content:
        '为深入贯彻落实全民阅读战略，营造浓厚的阅读氛围，提升社区文化品质，我们决定开展"书香社区"创建活动。\n\n活动内容：\n1. 社区图书角建设：在社区公共区域设立图书角，提供图书借阅服务\n2. 阅读推广活动：定期举办读书会、讲座、分享会等活动\n3. 特色阅读项目：针对老年人、儿童等不同群体开展特色阅读活动\n4. 阅读志愿服务：招募阅读推广志愿者，开展阅读指导服务\n\n创建标准：\n1. 有固定的阅读场所和图书资源\n2. 有稳定的阅读推广队伍\n3. 有特色的阅读推广活动\n4. 有良好的社区阅读氛围\n\n请各社区积极参与，共同营造书香社会！',
      time: "2024-01-25 09:45",
    },
    {
      id: "6",
      title: "图书馆会员服务升级通知",
      content:
        "尊敬的图书馆会员：\n\n为提升会员服务体验，我馆将于2024年3月1日起对会员服务进行全面升级，具体内容如下：\n\n1. 借阅权限提升：普通会员可同时借阅图书数量由5本增加至8本，借阅期限由30天延长至45天\n2. 新增电子资源：会员可免费访问CNKI、万方等学术数据库，并可下载电子书和有声读物\n3. 专属活动：会员专享读书会、作者见面会等高质量文化活动\n4. 会员积分制：引入积分奖励机制，积分可兑换借阅权限、文创产品等\n5. 个性化推荐：基于会员借阅历史，提供个性化图书推荐服务\n\n服务升级期间（2月25日-2月29日），系统将进行维护，可能影响部分借阅功能，敬请谅解。\n\n感谢您对图书馆工作的支持！",
      time: "2024-02-18 16:30",
    },
    {
      id: "7",
      title: "关于征集读者意见建议的通知",
      content:
        "尊敬的读者：\n\n为进一步改进图书馆服务，提升读者满意度，我们诚挚邀请您提出宝贵的意见和建议。\n\n征集内容：\n1. 图书馆环境设施改进建议\n2. 图书资源建设意见\n3. 服务流程优化建议\n4. 活动内容和形式建议\n5. 其他有助于提升图书馆服务质量的建议\n\n征集方式：\n1. 填写读者意见表（可在图书馆前台领取）\n2. 发送电子邮件至library@example.com\n3. 扫描二维码进入线上问卷调查\n\n征集时间：2024年2月1日至2月29日\n\n您的每一条建议都将得到认真对待，对于被采纳的建议，我们将给予适当奖励。\n\n感谢您对图书馆工作的关心和支持！",
      time: "2024-02-01 10:00",
    },
    {
      id: "8",
      title: "图书馆志愿者招募公告",
      content:
        "为丰富图书馆服务内容，提升服务质量，现面向社会公开招募图书馆志愿者。\n\n招募岗位：\n1. 图书整理志愿者：负责图书上架、整理等工作\n2. 活动协助志愿者：协助组织开展各类阅读推广活动\n3. 阅读指导志愿者：为读者提供阅读指导和咨询服务\n4. 数字资源推广志愿者：协助推广图书馆电子资源\n\n招募要求：\n1. 热爱阅读，热心公益\n2. 有责任心，工作认真细致\n3. 每月能保证至少8小时的志愿服务时间\n4. 具有相关专业背景或志愿服务经验者优先\n\n报名方式：\n请填写《图书馆志愿者申请表》（可在图书馆前台领取或官网下载），并提交至图书馆办公室或发送至volunteer@example.com\n\n报名截止日期：2024年3月15日\n\n期待您的加入，共同为读者提供更优质的服务！",
      time: "2024-02-10 14:20",
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

      // 刷新活动列表和统计数据
      if (activityListRef.current) {
        activityListRef.current.refreshList()
      }
      fetchActivityStatics()
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

      // 刷新活动列表和统计数据
      if (activityListRef.current) {
        activityListRef.current.refreshList()
      }
      fetchActivityStatics()
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

    // 刷新活动列表和统计数据
    if (activityListRef.current) {
      activityListRef.current.refreshList()
    }
    fetchActivityStatics()
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
          {statisticsConfig.map((stat, index) => (
            <Col span={24 / statisticsConfig.length} key={index}>
              <StatisticCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
                loading={statisticsLoading}
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
