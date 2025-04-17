"use client";
import {
  Form,
  Input,
  Button,
  Table,
  Tag,
  Pagination,
  Card,
  Row,
  Col,
  message,
} from "antd";
import {
  UploadOutlined,
  TrophyOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Banner from "@/components/banner";
import type { ColumnsType } from "antd/es/table";
import "./page.scss";

interface DonationRecord {
  key: string;
  id: number;
  date: string;
  name: string;
  contact: string;
  bookName: string;
  quantity: number;
  status: string;
}

interface RankingRecord {
  key: string;
  rank: number;
  name: string;
  donationCount: number;
  bookCount: number;
  totalValue: number;
  averageValue: number;
  lastDonationDate: string;
}

export default function BookDonation() {
  const [form] = Form.useForm();
  const [bookForm] = Form.useForm();
  const [valueForm] = Form.useForm();

  // Mock data for the donation records
  const donationData: DonationRecord[] = [
    {
      key: "1",
      id: 1,
      date: "2025-01-05",
      name: "张三",
      contact: "18186723351",
      bookName: "书名1",
      quantity: 1,
      status: "在库",
    },
    {
      key: "2",
      id: 2,
      date: "2025-01-05",
      name: "李明",
      contact: "15442213678",
      bookName: "书名2",
      quantity: 2,
      status: "售卖",
    },
    {
      key: "3",
      id: 3,
      date: "2025-01-05",
      name: "王五",
      contact: "11223345674",
      bookName: "书名3",
      quantity: 1,
      status: "在库",
    },
    {
      key: "4",
      id: 4,
      date: "2025-01-05",
      name: "赵明",
      contact: "13398876543",
      bookName: "书名4",
      quantity: 1,
      status: "在库",
    },
    {
      key: "5",
      id: 5,
      date: "2025-01-05",
      name: "刘金",
      contact: "12234556788",
      bookName: "书名5",
      quantity: 1,
      status: "借出",
    },
    {
      key: "6",
      id: 6,
      date: "2025-01-05",
      name: "许校然",
      contact: "18823445551",
      bookName: "书名6",
      quantity: 3,
      status: "借出",
    },
    {
      key: "7",
      id: 7,
      date: "2025-01-05",
      name: "杨洪",
      contact: "15542212347",
      bookName: "书名7",
      quantity: 5,
      status: "借出",
    },
    {
      key: "8",
      id: 8,
      date: "2025-01-05",
      name: "邓荣",
      contact: "17765527890",
      bookName: "书名8",
      quantity: 1,
      status: "借出",
    },
    {
      key: "9",
      id: 9,
      date: "2025-01-05",
      name: "田静",
      contact: "18002234578",
      bookName: "书名9",
      quantity: 2,
      status: "借出",
    },
    {
      key: "10",
      id: 10,
      date: "2025-01-05",
      name: "邓小王",
      contact: "15562290876",
      bookName: "书名10",
      quantity: 1,
      status: "借出",
    },
  ];

  // Mock data for the ranking statistics
  const rankingData: RankingRecord[] = [
    {
      key: "1",
      rank: 1,
      name: "张三",
      donationCount: 10,
      bookCount: 20,
      totalValue: 500,
      averageValue: 50,
      lastDonationDate: "2025-01-15",
    },
    {
      key: "2",
      rank: 2,
      name: "李明",
      donationCount: 8,
      bookCount: 15,
      totalValue: 400,
      averageValue: 50,
      lastDonationDate: "2025-01-10",
    },
    {
      key: "3",
      rank: 3,
      name: "王五",
      donationCount: 6,
      bookCount: 12,
      totalValue: 300,
      averageValue: 50,
      lastDonationDate: "2025-01-05",
    },
    {
      key: "4",
      rank: 4,
      name: "赵明",
      donationCount: 4,
      bookCount: 8,
      totalValue: 200,
      averageValue: 50,
      lastDonationDate: "2025-01-01",
    },
    {
      key: "5",
      rank: 5,
      name: "孙七",
      donationCount: 2,
      bookCount: 5,
      totalValue: 100,
      averageValue: 50,
      lastDonationDate: "2024-12-31",
    },
    {
      key: "6",
      rank: 6,
      name: "周八",
      donationCount: 15,
      bookCount: 25,
      totalValue: 600,
      averageValue: 40,
      lastDonationDate: "2025-01-18",
    },
    {
      key: "7",
      rank: 7,
      name: "吴九",
      donationCount: 12,
      bookCount: 22,
      totalValue: 550,
      averageValue: 45.83,
      lastDonationDate: "2025-01-12",
    },
    {
      key: "8",
      rank: 8,
      name: "郑十",
      donationCount: 9,
      bookCount: 18,
      totalValue: 450,
      averageValue: 50,
      lastDonationDate: "2025-01-08",
    },
    {
      key: "9",
      rank: 9,
      name: "钱一",
      donationCount: 7,
      bookCount: 14,
      totalValue: 350,
      averageValue: 50,
      lastDonationDate: "2025-01-03",
    },
    {
      key: "10",
      rank: 10,
      name: "孙二",
      donationCount: 5,
      bookCount: 10,
      totalValue: 250,
      averageValue: 50,
      lastDonationDate: "2025-01-02",
    },
  ];

  const donationColumns: ColumnsType<DonationRecord> = [
    { title: "序号", dataIndex: "id", key: "id", width: 60 },
    { title: "捐赠日期", dataIndex: "date", key: "date", width: 120 },
    { title: "姓名", dataIndex: "name", key: "name", width: 100 },
    { title: "联系方式", dataIndex: "contact", key: "contact", width: 120 },
    { title: "书名", dataIndex: "bookName", key: "bookName", width: 100 },
    { title: "捐赠数量", dataIndex: "quantity", key: "quantity", width: 80 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => {
        let color = "green";
        if (status === "借出") {
          color = "red";
        } else if (status === "售卖") {
          color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: () => <a className="detail-link">详情</a>,
    },
  ];

  const rankingColumns: ColumnsType<RankingRecord> = [
    { title: "排名", dataIndex: "rank", key: "rank", width: 60 },
    { title: "捐赠人", dataIndex: "name", key: "name", width: 100 },
    {
      title: "捐赠次数",
      dataIndex: "donationCount",
      key: "donationCount",
      width: 100,
    },
    { title: "捐赠数量", dataIndex: "bookCount", key: "bookCount", width: 100 },
    {
      title: "捐赠总价值(元)",
      dataIndex: "totalValue",
      key: "totalValue",
      width: 150,
    },
    {
      title: "平均捐赠价值(元)",
      dataIndex: "averageValue",
      key: "averageValue",
      width: 150,
    },
    {
      title: "最近一次捐赠日期",
      dataIndex: "lastDonationDate",
      key: "lastDonationDate",
      width: 150,
    },
  ];

  const handleSubmit = () => {
    message.success("添加成功");
    form.resetFields();
    bookForm.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    bookForm.resetFields();
    valueForm.resetFields();
  };

  const handleAddToLibrary = () => {
    message.success("已添加到绘本全仓库");
  };

  return (
    <>
      <Banner title="绘本管理-绘本捐赠" />
      <div className="book-donation-container">
        <div className="page-content">
          <Row gutter={[12, 16]}>
            <Col span={12}>
              <Card>
                <div className="donation-form-section">
                  <Card>
                    <div className="section-header">
                      <h2>捐赠信息录入</h2>
                    </div>
                    <Form form={form} layout="vertical">
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="捐赠人姓名" name="donorName">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="联系方式" name="contact">
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

                  <Card style={{ marginTop: "8px" }}>
                    <div className="section-header book-info-header">
                      <h2>绘本信息</h2>
                    </div>
                    <Form form={bookForm} layout="vertical">
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="书名" name="bookName">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="作者" name="author">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="出版社" name="publisher">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="类别" name="category">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="数量" name="quantity">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="是否全新" name="isNew">
                            <Input placeholder="请输入" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>

                    <div className="add-to-library">
                      <Button
                        type="primary"
                        onClick={handleAddToLibrary}
                        className="add-library-btn"
                      >
                        添加绘本全仓库
                      </Button>
                    </div>
                  </Card>

                  <Card style={{ marginTop: "8px" }}>
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
                            <Form.Item
                              label="当前会员等级："
                              name="memberLevel"
                            >
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
                        </Row>

                        <div className="form-buttons">
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
                        </div>
                      </Form>
                    </div>
                  </Card>
                </div>
              </Card>
            </Col>

            <Col span={12}>
              <div className="donation-info-section">
                <Col span={24}>
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
                      <Button type="primary" className="report-btn">
                        生成捐赠报告
                      </Button>
                      <Button className="reload-btn">重置</Button>
                      <Button type="primary" className="quick-btn">
                        快捷操作
                      </Button>
                    </div>

                    <Table
                      columns={donationColumns}
                      dataSource={donationData}
                      pagination={false}
                      size="small"
                      className="donation-table"
                    />

                    <div className="pagination-container">
                      <Pagination
                        defaultCurrent={1}
                        total={100}
                        showSizeChanger
                        showQuickJumper
                        size="small"
                        pageSizeOptions={["10", "20", "50"]}
                        defaultPageSize={10}
                        showTotal={(total) => `${total}条/页`}
                      />
                    </div>
                  </Card>
                </Col>
                <Col span={24} style={{ marginTop: "-16px" }}>
                  <Card
                    title={
                      <div className="ranking-header">
                        <TrophyOutlined className="trophy-icon" />
                        <span>排名统计</span>
                      </div>
                    }
                    className="ranking-card"
                  >
                    <Table
                      columns={rankingColumns}
                      dataSource={rankingData}
                      pagination={false}
                      size="small"
                      scroll={{ x: "max-content", y: 40 * 3 }}
                      className="ranking-table"
                    />
                  </Card>
                </Col>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
