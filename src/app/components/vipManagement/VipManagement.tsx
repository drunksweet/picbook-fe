;`use client`

import { useState } from "react"
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
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { MemberBarChart } from "@/components/echarts/vip/MemberBarChart"
import VipActionButtons from "@/components/vipManagement/VipActionButtons/VipActionButtons"
import styles from "./VipManagement.module.scss"
import MemberTab from "../echarts/vip/MemberTab/MemberTab"

interface MemberData {
  key: string
  id: number
  memberNo: string
  name: string
  gender: string
  contact: string
  level: string
  status: string
  points: number
}

export default function VipManagement() {
  const [memberName, setMemberName] = useState("")
  const [memberLevel, setMemberLevel] = useState("")
  const [status, setStatus] = useState("正常")
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentMember, setCurrentMember] = useState<MemberData | null>(null)
  const [pointsExchangeVisible, setPointsExchangeVisible] = useState(false)
  const [pointsRulesVisible, setPointsRulesVisible] = useState(false)
  const [bookBorrowVisible, setBookBorrowVisible] = useState(false)
  const [borrowRulesVisible, setBorrowRulesVisible] = useState(false)

  // 模拟会员数据
  const memberData: MemberData[] = [
    {
      key: "1",
      id: 1,
      memberNo: "20230201",
      name: "张三",
      gender: "女",
      contact: "18186723357",
      level: "普通",
      status: "正常",
      points: 580,
    },
    {
      key: "2",
      id: 2,
      memberNo: "20230202",
      name: "李四",
      gender: "男",
      contact: "15678945877",
      level: "普通",
      status: "过期",
      points: 666,
    },
    {
      key: "3",
      id: 3,
      memberNo: "20230203",
      name: "王五",
      gender: "女",
      contact: "11223345674",
      level: "普通",
      status: "正常",
      points: 456,
    },
    {
      key: "4",
      id: 4,
      memberNo: "20230204",
      name: "赵一",
      gender: "男",
      contact: "16778905467",
      level: "银卡",
      status: "正常",
      points: 100,
    },
    {
      key: "5",
      id: 5,
      memberNo: "20230205",
      name: "刘宇",
      gender: "男",
      contact: "16778543455",
      level: "金卡",
      status: "冻结",
      points: 34,
    },
    {
      key: "6",
      id: 6,
      memberNo: "20230206",
      name: "王瑞",
      gender: "女",
      contact: "18345689366",
      level: "银卡",
      status: "冻结",
      points: 57,
    },
    {
      key: "7",
      id: 7,
      memberNo: "20230207",
      name: "田英",
      gender: "女",
      contact: "13405678334",
      level: "普通",
      status: "冻结",
      points: 21,
    },
    {
      key: "8",
      id: 8,
      memberNo: "20230208",
      name: "徐慧",
      gender: "女",
      contact: "13556789667",
      level: "银卡",
      status: "冻结",
      points: 45,
    },
    {
      key: "9",
      id: 9,
      memberNo: "20230209",
      name: "罗小红",
      gender: "女",
      contact: "15698873442",
      level: "普通",
      status: "冻结",
      points: 87,
    },
    {
      key: "10",
      id: 10,
      memberNo: "20230210",
      name: "陈梅",
      gender: "男",
      contact: "13398766542",
      level: "银卡",
      status: "冻结",
      points: 789,
    },
  ]

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
    { id: 1, title: "JavaScript高级程序设计", author: "Nicholas C. Zakas", available: 3 },
    { id: 2, title: "深入理解计算机系统", author: "Randal E. Bryant", available: 1 },
    { id: 3, title: "算法导论", author: "Thomas H. Cormen", available: 2 },
    { id: 4, title: "设计模式", author: "Erich Gamma", available: 0 },
    { id: 5, title: "数据结构与算法分析", author: "Mark Allen Weiss", available: 4 },
  ]

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

  const columns: ColumnsType<MemberData> = [
    { title: "序号", dataIndex: "id", key: "id", align: "center" },
    { title: "会员编号", dataIndex: "memberNo", key: "memberNo", align: "center" },
    { title: "会员姓名", dataIndex: "name", key: "name", align: "center" },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (gender) => <span className={gender === "女" ? styles.femaleText : styles.maleText}>{gender}</span>,
    },
    { title: "联系方式", dataIndex: "contact", key: "contact", align: "center" },
    { title: "会员级别", dataIndex: "level", key: "level", align: "center" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const color = status === "正常" ? "green" : status === "过期" ? "orange" : "red"
        return <Tag color={color}>{status}</Tag>
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
    setStatus("正常")
    message.success("已重置搜索条件")
  }

  const handleSearch = () => {
    // 实现搜索逻辑
    message.success("搜索成功")
    console.log("搜索条件:", { memberName, memberLevel, status })
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
                          />
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={styles.formItem}>
                          <label>会员级别</label>
                          <Input
                            placeholder="请输入"
                            value={memberLevel}
                            onChange={(e) => setMemberLevel(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={styles.formItem}>
                          <label>所有状态</label>
                          <Input placeholder="正常" value={status} onChange={(e) => setStatus(e.target.value)} />
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
                    />

                    <div className={styles.paginationWrapper}>
                      <Pagination
                        defaultCurrent={1}
                        total={100}
                        showSizeChanger
                        showQuickJumper
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
                      <MemberBarChart />
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
                <Descriptions.Item label="会员编号">{currentMember.memberNo}</Descriptions.Item>
                <Descriptions.Item label="会员姓名">{currentMember.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{currentMember.gender}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{currentMember.contact}</Descriptions.Item>
                <Descriptions.Item label="会员级别">{currentMember.level}</Descriptions.Item>
                <Descriptions.Item label="状态">{currentMember.status}</Descriptions.Item>
                <Descriptions.Item label="积分">{currentMember.points}</Descriptions.Item>
                <Descriptions.Item label="注册时间">2023-02-01</Descriptions.Item>
                <Descriptions.Item label="最近活动时间">2023-04-15</Descriptions.Item>
                <Descriptions.Item label="备注">活跃会员</Descriptions.Item>
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
          <li key="buy-book">购买图书：每消费10元 +1积分</li>
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
        <p>会员级别：{currentMember ? currentMember.level : "-"}</p>
        <List
          itemLayout="horizontal"
          dataSource={bookItems}
          renderItem={(item) => (
            <List.Item
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
