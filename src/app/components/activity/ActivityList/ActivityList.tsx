"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Button, Card, Row, Col, Tag, Input, Pagination, Empty, Spin } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import ActivityCard, { type ActivityData } from "../ActivityCard/ActivityCard"
import { getActivityList, type ActivityListRequest } from "@/api/activity/activity"
import "./ActivityList.scss"

const { Search } = Input

export interface ActivityListRef {
  refreshList: () => void
}

interface ActivityListProps {
  activities?: ActivityData[]
  activeTab: string
  onTabChange: (tab: string) => void
  onSearch: (value: string) => void
  onCreateActivity: () => void
  onViewActivityDetail: (activity: ActivityData) => void
  onEditActivity: (activity: ActivityData) => void
  onCancelActivity: (activity: ActivityData) => void
}

const ActivityList = forwardRef<ActivityListRef, ActivityListProps>(
  (
    { activeTab, onTabChange, onSearch, onCreateActivity, onViewActivityDetail, onEditActivity, onCancelActivity },
    ref,
  ) => {
    const [activities, setActivities] = useState<ActivityData[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [searchKeyword, setSearchKeyword] = useState("")

    // 获取活动列表数据
    const fetchActivities = async () => {
      setLoading(true)
      try {
        // 构建请求参数
        const params: ActivityListRequest = {
          page: currentPage,
          page_size: pageSize,
        }

        // 根据当前选中的标签添加状态筛选
        if (activeTab !== "all" && activeTab !== "category") {
          const statusMap: Record<string, string> = {
            signup: "pending",
            ongoing: "ongoing",
            ended: "ended",
          }
          params.status = statusMap[activeTab]
        }

        // 如果有搜索关键词，添加到请求参数
        if (searchKeyword) {
          params.keyword = searchKeyword
        }

        const response = await getActivityList(params)

        // 转换API返回的数据为组件所需格式
        const formattedActivities = response.activitys.map((item) => {
          const startTime = new Date(item.info.start_time)
          const endTime = new Date(item.info.end_time)

          // 格式化时间为 "YYYY-MM-DD HH:mm-HH:mm"
          const formattedDate = startTime.toISOString().split("T")[0]
          const formattedStartTime = startTime.toTimeString().substring(0, 5)
          const formattedEndTime = endTime.toTimeString().substring(0, 5)

          return {
            id: item.activity_id.toString(),
            title: item.info.activity_name,
            type: item.info.activity_type,
            time: `${formattedDate} ${formattedStartTime}-${formattedEndTime}`,
            manager: item.info.manager,
            contact: item.info.phone,
            location: item.info.addr,
            // 根据当前时间判断活动状态
            status: getActivityStatus(item.info.start_time, item.info.end_time),
            maxParticipants: 50, // 假设API没有返回这些字段，使用默认值
            currentParticipants: 0,
            description: "活动描述", // API没有返回描述字段
          }
        })

        setActivities(formattedActivities)
        setTotal(response.total)
      } catch (error) {
        console.error("获取活动列表失败:", error)
      } finally {
        setLoading(false)
      }
    }

    // 暴露刷新方法给父组件
    useImperativeHandle(ref, () => ({
      refreshList: fetchActivities,
    }))

    // 根据开始和结束时间判断活动状态
    const getActivityStatus = (startTime: string, endTime: string): string => {
      const now = new Date().getTime()
      const start = new Date(startTime).getTime()
      const end = new Date(endTime).getTime()

      if (now < start) {
        return "报名中"
      } else if (now >= start && now <= end) {
        return "进行中"
      } else {
        return "已结束"
      }
    }

    // 当页码、每页条数、活动标签或搜索关键词变化时，重新获取数据
    useEffect(() => {
      fetchActivities()
    }, [currentPage, pageSize, activeTab, searchKeyword])

    // 处理搜索
    const handleSearch = (value: string) => {
      setSearchKeyword(value)
      setCurrentPage(1) // 重置到第一页
      onSearch(value)
    }

    // 处理分页变化
    const handlePageChange = (page: number, pageSize?: number) => {
      setCurrentPage(page)
      if (pageSize) setPageSize(pageSize)
    }

    // 过滤活动
    const filteredActivities =
      activeTab === "all"
        ? activities
        : activities.filter((activity) => {
            if (activeTab === "signup") return activity.status === "报名中"
            if (activeTab === "ongoing") return activity.status === "进行中"
            if (activeTab === "ended") return activity.status === "已结束"
            if (activeTab === "category") return true // 分类标签暂时显示所有活动
            return true
          })

    return (
      <Card className="section-card">
        <div className="section-header">
          <div className="tabs-container">
            <Button type={activeTab === "all" ? "primary" : "default"} onClick={() => onTabChange("all")}>
              所有活动
            </Button>
            <Button type={activeTab === "category" ? "primary" : "default"} onClick={() => onTabChange("category")}>
              分类
            </Button>
            <Search placeholder="搜索活动" onSearch={handleSearch} style={{ width: 200, marginLeft: 8 }} />
            <div className="status-tags">
              <Tag color={activeTab === "signup" ? "#1890FF" : "default"} onClick={() => onTabChange("signup")}>
                报名中
              </Tag>
              <Tag color={activeTab === "ongoing" ? "#F59A23" : "default"} onClick={() => onTabChange("ongoing")}>
                进行中
              </Tag>
              <Tag color={activeTab === "ended" ? "#FF4D4F" : "default"} onClick={() => onTabChange("ended")}>
                已结束
              </Tag>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateActivity}>
            去创建
          </Button>
        </div>

        <div className="activity-list">
          <Spin spinning={loading}>
            {filteredActivities.length > 0 ? (
              <Row gutter={[16, 16]}>
                {filteredActivities.map((activity) => (
                  <Col span={12} key={activity.id}>
                    <ActivityCard
                      activity={activity}
                      onViewDetail={onViewActivityDetail}
                      onEdit={onEditActivity}
                      onCancel={onCancelActivity}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="暂无活动数据" />
            )}
          </Spin>
        </div>

        {/* 分页 */}
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            onChange={handlePageChange}
            onShowSizeChange={(current, size) => {
              setCurrentPage(1)
              setPageSize(size)
            }}
          />
        </div>
      </Card>
    )
  },
)

ActivityList.displayName = "ActivityList"

export default ActivityList
