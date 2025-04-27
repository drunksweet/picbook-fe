"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Tag, Card, Row, Col, Space, App } from "antd";
import {
  TrophyOutlined,
  MessageOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Banner from "@/components/banner";
import TangTable from "@/components/TangTable/TangTable";
import type { ColumnsType } from "antd/es/table";
import {
  fetchDonationRecords,
  fetchRankingStatistics,
  generateMockDonationRecords,
  generateMockRankingStatistics,
  type DonationRecord,
  type RankingRecord,
} from "@/api/books/donate/donate";
import "./page.scss";

interface ProcessedDonationRecord extends DonationRecord {
  key: string;
  index: number;
  status?: string; // 添加可选的状态字段
}

interface ProcessedRankingRecord extends RankingRecord {
  key: string;
  rank: number;
  totalValue?: number; // 添加可选的总价值字段
  averageValue?: number; // 添加可选的平均价值字段
}

export default function BookDonation() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [bookForm] = Form.useForm();
  const [valueForm] = Form.useForm();

  // 捐赠记录状态
  const [donationRecords, setDonationRecords] = useState<
    ProcessedDonationRecord[]
  >([]);
  const [donationCurrentPage, setDonationCurrentPage] = useState<number>(1);
  const [donationPageSize, setDonationPageSize] = useState<number>(10);
  const [donationTotal, setDonationTotal] = useState<number>(0);
  const [donationLoading, setDonationLoading] = useState<boolean>(false);

  // 排名统计状态
  const [rankingRecords, setRankingRecords] = useState<
    ProcessedRankingRecord[]
  >([]);
  const [rankingLoading, setRankingLoading] = useState<boolean>(false);

  // 捐赠记录表格列配置
  const donationColumns: ColumnsType<ProcessedDonationRecord> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
    },
    {
      title: "捐赠日期",
      dataIndex: "donate_time",
      key: "donate_time",
      align: "center",
      width: 120,
    },
    {
      title: "姓名",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
      width: 100,
    },
    {
      title: "联系方式",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      width: 120,
    },
    {
      title: "书名",
      dataIndex: "book_name",
      key: "book_name",
      align: "center",
      width: 100,
    },
    {
      title: "捐赠数量",
      dataIndex: "donate_num",
      key: "donate_num",
      align: "center",
      width: 80,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 80,
      render: (status) => {
        let color = "green";
        if (status === "借出") {
          color = "red";
        } else if (status === "售卖") {
          color = "blue";
        }
        return <Tag color={color}>{status || "在库"}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 80,
      render: () => <a className="detail-link">详情</a>,
    },
  ];

  // 排名统计表格列配置
  const rankingColumns: ColumnsType<ProcessedRankingRecord> = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      align: "center",
      width: 60,
    },
    {
      title: "捐赠人",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
      width: 100,
    },
    {
      title: "捐赠次数",
      dataIndex: "donate_times",
      key: "donate_times",
      align: "center",
      width: 100,
    },
    {
      title: "捐赠数量",
      dataIndex: "donate_num",
      key: "donate_num",
      align: "center",
      width: 100,
    },
    {
      title: "捐赠总价值(元)",
      dataIndex: "totalValue",
      key: "totalValue",
      align: "center",
      width: 150,
      render: (_, record) =>
        record.totalValue || Math.floor(record.donate_num * 50),
    },
    {
      title: "平均捐赠价值(元)",
      dataIndex: "averageValue",
      key: "averageValue",
      align: "center",
      width: 150,
      render: (_, record) =>
        record.averageValue ||
        Math.floor(
          (record.totalValue || record.donate_num * 50) / record.donate_times
        ),
    },
    {
      title: "最近一次捐赠日期",
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      width: 150,
    },
  ];

  // 获取捐赠记录
  const getDonationRecords = async (page: number, pageSize: number) => {
    setDonationLoading(true);
    try {
      const result = await fetchDonationRecords(page, pageSize);

      if (result.success) {
        setDonationRecords(result.data!.items);
        setDonationCurrentPage(result.data!.currentPage);
        setDonationTotal(result.data!.total);
      } else {
        message.error(result.error || "获取捐赠记录失败");

        // 使用模拟数据
        const mockData = generateMockDonationRecords(page, pageSize);
        setDonationRecords(mockData.items);
        setDonationCurrentPage(mockData.currentPage);
        setDonationTotal(mockData.total);
      }
    } catch (error) {
      console.error("获取捐赠记录失败:", error);
      message.error("获取捐赠记录失败，请稍后重试");

      // 使用模拟数据
      const mockData = generateMockDonationRecords(page, pageSize);
      setDonationRecords(mockData.items);
      setDonationCurrentPage(mockData.currentPage);
      setDonationTotal(mockData.total);
    } finally {
      setDonationLoading(false);
    }
  };

  // 获取排名统计
  const getRankingStatistics = async (top: number) => {
    setRankingLoading(true);
    try {
      const result = await fetchRankingStatistics(top);

      if (result.success) {
        setRankingRecords(result.data!);
      } else {
        message.error(result.error || "获取排名统计失败");

        // 如果需要登录，跳转到登录页
        if (result.needLogin) {
          // router.push("/login")
          return;
        }

        // 使用模拟数据
        const mockData = generateMockRankingStatistics(top);
        setRankingRecords(mockData);
      }
    } catch (error) {
      console.error("获取排名统计失败:", error);
      message.error("获取排名统计失败，请稍后重试");

      // 使用模拟数据
      const mockData = generateMockRankingStatistics(top);
      setRankingRecords(mockData);
    } finally {
      setRankingLoading(false);
    }
  };

  // 处理捐赠记录分页变化
  const handleDonationPageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || donationPageSize;
    setDonationCurrentPage(page);
    if (pageSize) setDonationPageSize(pageSize);
    getDonationRecords(page, newPageSize);
  };

  // 处理表单提交
  const handleSubmit = () => {
    message.success("添加成功");
    form.resetFields();
    bookForm.resetFields();
    valueForm.resetFields();

    // 刷新数据
    getDonationRecords(donationCurrentPage, donationPageSize);
    getRankingStatistics(10);
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    bookForm.resetFields();
    valueForm.resetFields();
  };

  // 处理添加到绘本全仓库
  const handleAddToLibrary = () => {
    message.success("已添加到绘本全仓库");
  };

  // 处理重置
  const handleReset = () => {
    getDonationRecords(1, donationPageSize);
    setDonationCurrentPage(1);
  };

  // 处理生成捐赠报告
  const handleGenerateReport = () => {
    message.success("正在生成捐赠报告...");
  };

  // 处理快捷操作
  const handleQuickAction = () => {
    message.success("快捷操作功能开发中...");
  };

  // 初始加载数据
  useEffect(() => {
    getDonationRecords(donationCurrentPage, donationPageSize);
    getRankingStatistics(10);
  }, []);

  return (
    <>
      <Banner title="绘本管理-绘本捐赠" />
      <div className="book-donation-container">
        <div className="page-content">
          <Row gutter={[12, 16]}>
            <Col span={12}>
              <Card size="small">
                <div className="section-header">
                  <h2>捐赠信息录入</h2>
                </div>
                <Form form={form} layout="vertical">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="捐赠人姓名"
                        name="donorName"
                        rules={[
                          { required: true, message: "请输入捐赠人姓名" },
                        ]}
                      >
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="联系方式"
                        name="contact"
                        rules={[{ required: true, message: "请输入联系方式" }]}
                      >
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="捐赠类型" name="donationType">
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>

              <Card style={{ marginTop: "1rem" }} size="small">
                <div className="section-header book-info-header">
                  <h2>绘本信息</h2>
                </div>
                <Form form={bookForm} layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="书名"
                        name="bookName"
                        rules={[{ required: true, message: "请输入书名" }]}
                      >
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="作者" name="author">
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="出版社" name="publisher">
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="类别" name="category">
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="数量"
                        name="quantity"
                        rules={[{ required: true, message: "请输入数量" }]}
                      >
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="是否全新" name="isNew">
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={24}
                      style={{ textAlign: "right", marginTop: "-8px" }}
                    >
                      <Button
                        type="primary"
                        onClick={handleAddToLibrary}
                        className="add-library-btn"
                      >
                        添加绘本全仓库
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>

              <Card style={{ marginTop: "1rem" }} size="small">
                <div className="donation-value-section">
                  <div className="section-header">
                    <h2 className="gift-icon">捐赠激励</h2>
                  </div>

                  <Form form={valueForm} layout="vertical">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="书本估价：" name="bookValue">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="当前会员等级：" name="memberLevel">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="可获积分：" name="points">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="当前时长：" name="duration">
                          <Input placeholder="请输入" />
                        </Form.Item>
                      </Col>
                      <Col
                        span={24}
                        style={{ textAlign: "right", marginTop: "-8px" }}
                      >
                        <Space>
                          <Button
                            type="primary"
                            onClick={handleSubmit}
                            className="confirm-btn"
                          >
                            确认
                          </Button>
                          <Button onClick={handleCancel} className="cancel-btn">
                            取消
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Card>
            </Col>

            <Col span={12}>
              <div className="donation-info-section">
                <Card
                  title={
                    <div className="info-header">
                      <MessageOutlined className="info-icon" />
                      <span>捐赠信息</span>
                    </div>
                  }
                  className="info-card"
                >
                  <div className="action-buttons">
                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      onClick={handleGenerateReport}
                      className="report-btn"
                    >
                      生成捐赠报告
                    </Button>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                      className="reload-btn"
                    >
                      重置
                    </Button>
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      onClick={handleQuickAction}
                      className="quick-btn"
                    >
                      快捷操作
                    </Button>
                  </div>

                  <TangTable
                    columns={donationColumns}
                    dataSource={donationRecords}
                    // loading={donationLoading}
                    currentPage={donationCurrentPage}
                    total={donationTotal}
                    pageSize={donationPageSize}
                    onPageChange={handleDonationPageChange}
                    scroll={{ x: "max-content", y: "40vh" }}
                  />
                </Card>
                <Card
                  style={{ marginTop: "1rem" }}
                  title={
                    <div className="ranking-header">
                      <TrophyOutlined className="trophy-icon" />
                      <span>排名统计</span>
                    </div>
                  }
                  className="ranking-card"
                >
                  <TangTable
                    columns={rankingColumns}
                    dataSource={rankingRecords}
                    // loading={rankingLoading}
                    currentPage={1}
                    total={rankingRecords.length}
                    pageSize={rankingRecords.length}
                    onPageChange={() => {}}
                    scroll={{ x: "max-content", y: "10vh" }}
                    // tableProps={{ pagination: false }}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
