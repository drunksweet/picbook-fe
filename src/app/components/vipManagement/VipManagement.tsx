`use client`;

import { useState } from "react";
import {
  Input,
  Button,
  Table,
  Tag,
  Card,
  Row,
  Col,
  Pagination,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MemberBarChart } from "@/components/echarts/vip/MemberBarChart";
import VipActionButtons from "@/components/vipManagement/VipActionButtons/VipActionButtons";
import styles from "./VipManagement.module.scss";
import MemberTab from "../echarts/vip/MemberTab/MemberTab";

interface MemberData {
  key: string;
  id: number;
  memberNo: string;
  name: string;
  gender: string;
  contact: string;
  level: string;
  status: string;
  points: number;
}

export default function VipManagement() {
  const [memberName, setMemberName] = useState("");
  const [memberLevel, setMemberLevel] = useState("");
  const [status, setStatus] = useState("正常");

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
  ];

  const columns: ColumnsType<MemberData> = [
    { title: "序号", dataIndex: "id", key: "id", align: "center",},
    { title: "会员编号", dataIndex: "memberNo", key: "memberNo", align: "center", },
    { title: "会员姓名", dataIndex: "name", key: "name", align: "center", },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (gender) => (
        <span className={gender === "女" ? styles.femaleText : styles.maleText}>
          {gender}
        </span>
      ),
    },
    { title: "联系方式", dataIndex: "contact", key: "contact", align: "center", },
    { title: "会员级别", dataIndex: "level", key: "level", align: "center", },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const color =
          status === "正常" ? "green" : status === "过期" ? "orange" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "积分", dataIndex: "points", key: "points", align: "center",},
    {
      title: "操作",
      key: "action",
      render: () => <a className={styles.actionLink}>查看详情</a>,
      align: "center",
    },
  ];

  const handleReset = () => {
    setMemberName("");
    setMemberLevel("");
    setStatus("正常");
  };

  const handleSearch = () => {
    // 实现搜索逻辑
    console.log("搜索条件:", { memberName, memberLevel, status });
  };

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
                          <Input
                            placeholder="正常"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col span={6} className={styles.buttonGroup}>
                        <Button
                          className={styles.resetButton}
                          onClick={handleReset}
                        >
                          重置
                        </Button>
                        <Button
                          type="primary"
                          className={styles.searchButton}
                          onClick={handleSearch}
                        >
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
                      <Button type="primary" className={styles.pointsButton}>
                        积分兑换
                      </Button>
                      <Button type="primary" className={styles.pointsButton}>
                        积分规则
                      </Button>
                      <Button type="primary" className={styles.pointsButton}>
                        图书借阅
                      </Button>
                      <Button type="primary" className={styles.pointsButton}>
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
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      }
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
    </div>
  );
}
