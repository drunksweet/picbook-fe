"use client"

import { useState, useEffect } from "react"
import {
  Input,
  Button,
  Table,
  Tag,
  Card,
  Row,
  Col,
  Pagination,
  Modal,
  message,
  Descriptions,
  Tabs,
  List,
  Timeline,
  Select,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { MemberBarChart } from "@/components/echarts/vip/MemberBarChart"
import VipActionButtons from "@/components/vipManagement/VipActionButtons/VipActionButtons"
import styles from "./VipManagement.module.scss"
import MemberTab from "../echarts/vip/MemberTab/MemberTab"
import { searchVipUsers, type VipUserInfo, type VipSearchRequest } from "@/api/vip/vip"

// 导出MemberData接口以便其他组件使用
export interface MemberData {
  key: string
  id: number
  name: string
  gender: string
  phone: string
  level: string
  status: string
  points: number
  is_vip: boolean
}

export default function VipManagement() {
  const [memberName, setMemberName] = useState("")
  const [memberLevel, setMemberLevel] = useState("")
  const [status, setStatus] = useState("")
  const [phone, setPhone] = useState("")
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentMember, setCurrentMember] = useState<MemberData | null>(null)
  const [pointsExchangeVisible, setPointsExchangeVisible] = useState(false)
  const [pointsRulesVisible, setPointsRulesVisible] = useState(false)
  const [bookBorrowVisible, setBookBorrowVisible] = useState(false)
  const [borrowRulesVisible, setBorrowRulesVisible] = useState(false)

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [memberData, setMemberData] = useState<MemberData[]>([])

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<VipSearchRequest>({
    page: 1,
    page_size: 10,
    is_vip: true,
  })

  // 模拟积分兑换商品数据
  const exchangeItems = [
    { id: 1, name: "精美书签", points: 50, stock: 100 },
    { id: 2, name: "图书优惠券", points: 100, stock: 50 },
    { id: 3, name: "限量版笔记本", points: 200, stock: 30 },
    { id: 4, name: "阅读灯", points: 300, stock: 20 },
    { id: 5, name: "电子书阅读器", points: 1000, stock: 5 },
  ]

  // 模拟借阅图书数据
  const bookItems = [
    {
      id: 1,
      title: "JavaScript高级程序设计",
      author: "Nicholas C. Zakas",
      available: 3,
    },
    {
      id: 2,
      title: "深入理解计算机系统",
      author: "Randal E. Bryant",
      available: 1,
    },
    { id: 3, title: "算法导论", author: "Thomas H. Cormen", available: 2 },
    { id: 4, title: "设计模式", author: "Erich Gamma", available: 0 },
    {
      id: 5,
      title: "数据结构与算法分析",
      author: "Mark Allen Weiss",
      available: 4,
    },
  ]

  // 获取会员数据
  const fetchMemberData = async () => {
    setLoading(true)
    try {
      console.log("发送请求参数:", searchParams)
      const response = await searchVipUsers(searchParams)

      if (response.code === 200 && response.data) {
        // 转换API返回的数据为组件所需格式
        const formattedData = response.data.users.map((user: VipUserInfo) => ({
          key: user.id.toString(),
          id: user.id,
          name: user.name,
          gender: user.gender,
          phone: user.phone,
          level: user.vip_levels,
          status: user.status,
          points: user.integral,
          is_vip: user.is_vip,
        }))

        setMemberData(formattedData)
        setTotal(response.data.total_num)
      } else {
        message.error(response.msg || "获取会员数据失败")
      }
    } catch (error) {
      console.error("获取会员数据失败:", error)
      message.error("获取会员数据失败")
    } finally {
      setLoading(false)
    }
  }

  // 当页码或每页条数变化时更新搜索参数并获取数据
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
      page_size: pageSize,
    }))
  }, [currentPage, pageSize])

  // 当搜索参数变化时获取数据
  useEffect(() => {
    fetchMemberData()
  }, [searchParams])

  // 查看会员详情
  const showMemberDetail = (member: MemberData) => {
    setCurrentMember(member)
    setDetailModalVisible(true)
  }

  // 积分兑换
  const showPointsExchange = () => {
    setPointsExchangeVisible(true)
  }

  // 积分规则
  const showPointsRules = () => {
    setPointsRulesVisible(true)
  }

  // 图书借阅
  const showBookBorrow = () => {
    setBookBorrowVisible(true)
  }

  // 借阅规则
  const showBorrowRules = () => {
    setBorrowRulesVisible(true)
  }

  // 兑换商品
  const handleExchange = (item: any) => {
    if (currentMember && currentMember.points >= item.points) {
      message.success(`成功兑换 ${item.name}`)
    } else {
      message.error("积分不足，无法兑换")
    }
  }

  // 借阅图书
  const handleBorrow = (book: any) => {
    if (book.available > 0) {
      message.success(`成功借阅《${book.title}》`)
    } else {
      message.error("该书已无库存，无法借阅")
    }
  }

  // 状态中英映射
  const statusEtoCMap: Record<string, string> = {
    normal: "正常",
    overdue: "过期",
    freeze: "冻结",
  }

  const statusColorMap: Record<string, string> = {
    normal: "green",
    overdue: "red",
    freeze: "gray",
  }

  // 级别中英映射
  const levelEtoCMap: Record<string, string> = {
    gold: "金卡",
    silver: "银卡",
    normal: "普通",
  }

  const levelColorMap: Record<string, string> = {
    gold: "#FFFACD",
    silver: "#87CEFA",
    normal: "#FFB6C1",
  }

  const columns: ColumnsType<MemberData> = [
    { title: "序号", dataIndex: "id", key: "id", align: "center" },
    { title: "会员姓名", dataIndex: "name", key: "name", align: "center" },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (gender) => <span className={gender === "女" ? styles.femaleText : styles.maleText}>{gender}</span>,
    },
    { title: "联系方式", dataIndex: "phone", key: "phone", align: "center" },
    {
      title: "会员级别",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (level: string) => {
        const levelText = levelEtoCMap[level] || level || "未知级别" // 默认级别文本
        // 使用级别颜色映射来设置标签颜色
        const color = levelColorMap[level] || "default" // 默认颜色
        return (
          <Tag color={color} style={{ color: "#101010" }}>
            {levelText}
          </Tag>
        )
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => {
        const statusText = statusEtoCMap[status] || status || "未知状态" // 默认状态文本
        // 使用状态颜色映射来设置标签颜色
        const color = statusColorMap[status] || "default" // 默认颜色
        return <Tag color={color}>{statusText}</Tag>
      },
    },
    { title: "积分", dataIndex: "points", key: "points", align: "center" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <a className={styles.actionLink} onClick={() => showMemberDetail(record)}>
          查看详情
        </a>
      ),
      align: "center",
    },
  ]

  const handleReset = () => {
    setMemberName("")
    setMemberLevel("")
    setStatus("")
    setPhone("")

    // 重置搜索参数，但保留分页和is_vip参数
    setSearchParams({
      page: 1,
      page_size: pageSize,
      is_vip: true,
    })

    setCurrentPage(1)
    message.success("已重置搜索条件")
  }

  const handleSearch = () => {
    // 更新搜索参数
    const newParams: VipSearchRequest = {
      page: 1,
      page_size: pageSize,
      is_vip: true,
    }

    // 添加可选参数
    if (memberName) newParams.user_name = memberName
    if (memberLevel) newParams.level = memberLevel
    if (status) newParams.status = status
    if (phone) newParams.phone = phone

    // 更新搜索参数状态
    setSearchParams(newParams)
    setCurrentPage(1) // 重置到第一页
  }

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page)
    if (pageSize) setPageSize(pageSize)
  }

  return (
    <div className={styles.memberManagement}>
      <div className={styles.contentWrapper}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={16}>
              {/* 搜索区域 */}
              <Col span={16}>
                <div className={styles.leftContent}>
                  <Card className={styles.searchCard}>
                    <h2 className={styles.sectionTitle}>信息检索</h2>
                    <Row gutter={[16, 16]} className={styles.searchRow}>
                      <Col span={6}>
                        <div className={styles.formItem}>
                          <label>会员姓名</label>
                          <Input
                            placeholder="请输入"
                            value={memberName}
                            onChange={(e) => setMemberName(e.target.value)}
                            onPressEnter={handleSearch}
                          />
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={styles.formItem}>
                          <label>会员级别</label>
                          <Select
                            placeholder="请选择"
                            value={memberLevel || undefined}
                            onChange={(value) => setMemberLevel(value)}
                            allowClear
                            style={{ width: "100%" }}
                          >
                            <Select.Option value="normal">普通会员</Select.Option>
                            <Select.Option value="silver">银卡会员</Select.Option>
                            <Select.Option value="gold">金卡会员</Select.Option>
                          </Select>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={styles.formItem}>
                          <label>联系方式</label>
                          <Input
                            placeholder="请输入手机号"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onPressEnter={handleSearch}
                          />
                        </div>
                      </Col>
                      <Col span={6} className={styles.buttonGroup}>
                        <Button className={styles.resetButton} onClick={handleReset}>
                          重置
                        </Button>
                        <Button type="primary" className={styles.searchButton} onClick={handleSearch}>
                          搜索
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Col>
              {/* 会员统计 */}
              <Col span={8}>
                <div className={styles.rightContent}>
                  <Card className={styles.statsCard}>
                    <div className={styles.statsHeader}>
                      <div className={styles.statsIcon}></div>
                      <h2 className={styles.statsTitle}>会员统计</h2>
                    </div>
                    <div className={styles.statsButtons}>
                      <Button type="primary" className={styles.pointsButton} onClick={showPointsExchange}>
                        积分兑换
                      </Button>
                      <Button type="primary" className={styles.pointsButton} onClick={showPointsRules}>
                        积分规则
                      </Button>
                      <Button type="primary" className={styles.pointsButton} onClick={showBookBorrow}>
                        图书借阅
                      </Button>
                      <Button type="primary" className={styles.pointsButton} onClick={showBorrowRules}>
                        借阅规则
                      </Button>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={16}>
              {/* 会员列表 */}
              <Col span={16}>
                <div className={styles.leftContent}>
                  <div className={styles.tableSection}>
                    <VipActionButtons />
                    <Table
                      columns={columns}
                      size="middle"
                      dataSource={memberData}
                      pagination={false}
                      className={styles.memberTable}
                      rowClassName={(record, index) => (index % 2 === 0 ? styles.evenRow : styles.oddRow)}
                      loading={loading}
                      locale={{ emptyText: "暂无会员数据" }}
                    />

                    <div className={styles.paginationWrapper}>
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
                        className={styles.pagination}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              {/* 排名统计 */}
              <Col span={8}>
                <div className={styles.rightContent}>
                  <Card className={styles.chartCard}>
                    <MemberTab />

                    <div className={styles.chartContainer}>
                      {/* 将会员数据传递给MemberBarChart组件 */}
                      <MemberBarChart memberData={memberData} loading={loading} />
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* 会员详情模态框 */}
      <Modal
        title="会员详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {currentMember && (
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="基本信息" key="1">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="会员ID">{currentMember.id}</Descriptions.Item>
                <Descriptions.Item label="会员姓名">{currentMember.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{currentMember.gender}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{currentMember.phone}</Descriptions.Item>
                <Descriptions.Item label="会员级别">
                  {levelEtoCMap[currentMember.level] || currentMember.level}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  {statusEtoCMap[currentMember.status] || currentMember.status}
                </Descriptions.Item>
                <Descriptions.Item label="积分">{currentMember.points}</Descriptions.Item>
                <Descriptions.Item label="是否为VIP">{currentMember.is_vip ? "是" : "否"}</Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>
            <Tabs.TabPane tab="借阅记录" key="2">
              <Timeline>
                <Timeline.Item color="green">2023-04-10 借阅《JavaScript高级程序设计》</Timeline.Item>
                <Timeline.Item color="green">2023-03-15 归还《深入理解计算机系统》</Timeline.Item>
                <Timeline.Item color="red">2023-03-01 借阅《深入理解计算机系统》</Timeline.Item>
                <Timeline.Item color="green">2023-02-20 归还《算法导论》</Timeline.Item>
                <Timeline.Item color="red">2023-02-05 借阅《算法导论》</Timeline.Item>
              </Timeline>
            </Tabs.TabPane>
            <Tabs.TabPane tab="积分记录" key="3">
              <Timeline>
                <Timeline.Item color="blue">2023-04-15 积分兑换 -100</Timeline.Item>
                <Timeline.Item color="green">2023-04-10 借书返还 +50</Timeline.Item>
                <Timeline.Item color="green">2023-03-20 活动参与 +100</Timeline.Item>
                <Timeline.Item color="green">2023-03-01 购书奖励 +200</Timeline.Item>
                <Timeline.Item color="blue">2023-02-15 积分兑换 -150</Timeline.Item>
              </Timeline>
            </Tabs.TabPane>
          </Tabs>
        )}
      </Modal>

      {/* 积分兑换模态框 */}
      <Modal
        title="积分兑换"
        open={pointsExchangeVisible}
        onCancel={() => setPointsExchangeVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPointsExchangeVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        <p>当前会员：{currentMember ? currentMember.name : "请先选择会员"}</p>
        <p>可用积分：{currentMember ? currentMember.points : 0}</p>
        <List
          itemLayout="horizontal"
          dataSource={exchangeItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleExchange(item)}
                  disabled={!currentMember || currentMember.points < item.points}
                >
                  兑换
                </Button>,
              ]}
            >
              <List.Item.Meta title={item.name} description={`所需积分: ${item.points} | 库存: ${item.stock}`} />
            </List.Item>
          )}
        />
      </Modal>

      {/* 积分规则模态框 */}
      <Modal
        title="积分规则"
        open={pointsRulesVisible}
        onCancel={() => setPointsRulesVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPointsRulesVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <h3>积分获取规则</h3>
        <ul>
          <li key="new-member">新会员注册：+100积分</li>
          <li key="borrow-book">每次借书：+10积分</li>
          <li key="return-book">按时归还图书：+20积分</li>
          <li key="activity">参与读书活动：+50积分</li>
          <li key="buy-book">购买图书：每消费10元 +1���分</li>
          <li key="recommend">推荐新会员：+50积分</li>
        </ul>
        <h3>会员等级规则</h3>
        <ul>
          <li key="normal-member">普通会员：0-500积分</li>
          <li key="silver-member">银卡会员：501-1000积分</li>
          <li key="gold-member">金卡会员：1001积分以上</li>
        </ul>
        <h3>积分有效期</h3>
        <p>积分自获取之日起两年内有效，请会员及时使用。</p>
      </Modal>

      {/* 图书借阅模态框 */}
      <Modal
        title="图书借阅"
        open={bookBorrowVisible}
        onCancel={() => setBookBorrowVisible(false)}
        footer={[
          <Button key="back" onClick={() => setBookBorrowVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        <p>当前会员：{currentMember ? currentMember.name : "请先选择会员"}</p>
        <p>会员级别：{currentMember ? levelEtoCMap[currentMember.level] || currentMember.level : "-"}</p>
        <List
          itemLayout="horizontal"
          dataSource={bookItems}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleBorrow(item)}
                  disabled={item.available === 0 || !currentMember}
                >
                  借阅
                </Button>,
              ]}
            >
              <List.Item.Meta title={item.title} description={`作者: ${item.author} | 可借数量: ${item.available}`} />
            </List.Item>
          )}
        />
      </Modal>

      {/* 借阅规则模态框 */}
      <Modal
        title="借阅规则"
        open={borrowRulesVisible}
        onCancel={() => setBorrowRulesVisible(false)}
        footer={[
          <Button key="back" onClick={() => setBorrowRulesVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <h3>借阅数量</h3>
        <ul>
          <li key="normal-member-borrow">普通会员：最多可借3本</li>
          <li key="silver-member-borrow">银卡会员：最多可借5本</li>
          <li key="gold-member-borrow">金卡会员：最多可借8本</li>
        </ul>
        <h3>借阅期限</h3>
        <ul>
          <li key="normal-member-period">普通会员：30天</li>
          <li key="silver-member-period">银卡会员：45天</li>
          <li key="gold-member-period">金卡会员：60天</li>
        </ul>
        <h3>续借规则</h3>
        <p>每本书最多可续借2次，每次续借期限为原借阅期限的一半。</p>
        <h3>逾期规则</h3>
        <p>逾期未还将收取每天1元的滞纳金，并暂停借阅权限直至归还。</p>
      </Modal>
    </div>
  )
}
