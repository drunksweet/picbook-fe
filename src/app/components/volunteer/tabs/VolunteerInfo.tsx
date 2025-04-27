"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Table,
  Pagination,
  Space,
  message,
  Modal,
  Form,
  Spin,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getVolunteerList,
  createVolunteer,
  getVolunteerApplicationList,
} from "@/api/volunteer/volunteer";
import "./VolunteerInfo.scss";

const VolunteerInfo = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<any>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [volunteerData, setVolunteerData] = useState<any[]>([]);
  const [applicationData, setApplicationData] = useState<any[]>([]);
  const [applicationTotal, setApplicationTotal] = useState(0);
  const [applicationCurrentPage, setApplicationCurrentPage] = useState(1);
  const [applicationPageSize, setApplicationPageSize] = useState(10);

  // 表格列定义
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center" as const,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 100,
      align: "center" as const,
    },
    {
      title: "联系方式",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      align: "center" as const,
      render: (text: string) => (
        <span style={{ color: "#F59A23" }}>{text}</span>
      ),
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 60,
      align: "center" as const,
    },
    {
      title: "服务时间偏好",
      dataIndex: "serviceTimePreference",
      key: "serviceTimePreference",
      width: 120,
      align: "center" as const,
    },
    {
      title: "擅长领域",
      dataIndex: "expertiseArea",
      key: "expertiseArea",
      width: 120,
      align: "center" as const,
    },
    {
      title: "注册时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      align: "center" as const,
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString();
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            style={{ color: "#F59A23", padding: "0" }}
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            编辑
          </Button>
          <Button
            type="link"
            style={{ color: "#F59A23", padding: "0" }}
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 简化的志愿者列表列定义
  const simpleColumns = [
    {
      title: "序号",
      key: "index",
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (applicationCurrentPage - 1) * applicationPageSize + index + 1,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
    },
    {
      title: "联系方式",
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      align: "center" as const,
    },
    {
      title: "操作",
      key: "action",

      align: "center" as const,
      render: (_: any, record: any) => (
        <Button
          type="link"
          style={{ color: "#F59A23", padding: "0" }}
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 获取志愿者列表数据
  const fetchVolunteerList = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };

      const response = await getVolunteerList(params);

      // 转换API返回的数据为表格所需格式
      const formattedData = response.volunteers.map((volunteer: any) => ({
        key: volunteer.id.toString(),
        id: volunteer.id,
        name: volunteer.name,
        phone: volunteer.phone,
        age: volunteer.age,
        serviceTimePreference: volunteer.serviceTimePreference,
        expertiseArea: volunteer.expertiseArea,
        createdAt: volunteer.createdAt,
      }));

      setVolunteerData(formattedData);
      setTotal(response.total);
    } catch (error) {
      console.error("获取志愿者列表失败:", error);
      message.error("获取志愿者列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取志愿者申请列表数据
  const fetchApplicationList = async () => {
    setApplicationLoading(true);
    try {
      const params = {
        page: applicationCurrentPage,
        page_size: applicationPageSize,
      };

      const response = await getVolunteerApplicationList(params);

      // 转换API返回的数据为表格所需格式
      const formattedData = response.applications.map((application: any) => ({
        key: application.id.toString(),
        id: application.id,
        name: application.name,
        phone: application.phone,
        age: application.age,
      }));

      setApplicationData(formattedData);
      setApplicationTotal(response.total);
    } catch (error) {
      console.error("获取志愿者申请列表失败:", error);
      message.error("获取志愿者申请列表失败");
    } finally {
      setApplicationLoading(false);
    }
  };

  // 初始加载和参数变化时获取数据
  useEffect(() => {
    fetchVolunteerList();
  }, [currentPage, pageSize, searchText]);

  useEffect(() => {
    fetchApplicationList();
  }, [applicationCurrentPage, applicationPageSize]);

  const handleSearch = () => {
    setCurrentPage(1); // 重置到第一页
    fetchVolunteerList();
  };

  const handleAddVolunteer = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleQuickAction = () => {
    message.info("快捷操作");
  };

  const handlePrint = () => {
    message.info("打印志愿者信息");
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleApplicationPageChange = (page: number, pageSize?: number) => {
    setApplicationCurrentPage(page);
    if (pageSize) setApplicationPageSize(pageSize);
  };

  const handleEdit = (record: any) => {
    setCurrentVolunteer(record);
    editForm.setFieldsValue({
      name: record.name,
      phone: record.phone,
      age: record.age,
      serviceTimePreference: record.serviceTimePreference,
      expertiseArea: record.expertiseArea,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除志愿者 ${record.name} 吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        message.success(`已删除志愿者 ${record.name}`);
        // 这里可以添加删除API调用
        // 删除成功后重新获取数据
        fetchVolunteerList();
      },
    });
  };

  const handleViewDetail = (record: any) => {
    message.info(`查看志愿者申请 ${record.name} 的详细信息`);
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 构建请求数据
      const requestData = {
        name: values.name,
        phone: values.phone,
        age: Number.parseInt(values.age),
        serviceTimePreference: values.serviceTimePreference,
        expertiseArea: values.expertiseArea,
      };

      // 调用API创建志愿者
      await createVolunteer(requestData);

      message.success("志愿者添加成功！");
      setIsAddModalVisible(false);
      form.resetFields();

      // 刷新志愿者列表
      fetchVolunteerList();
    } catch (error) {
      console.error("添加志愿者失败:", error);
      message.error("添加志愿者失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  const handleEditModalOk = () => {
    editForm
      .validateFields()
      .then((values) => {
        message.success(`志愿者 ${currentVolunteer.name} 信息修改成功！`);
        setIsEditModalVisible(false);
        // 这里可以添加更新API调用
        // 更新成功后重新获取数据
        fetchVolunteerList();
      })
      .catch((info) => {
        console.log("验证失败:", info);
      });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={18}>
        <Card>
          <div className="volunteer-info-header">
            <div className="title-section">
              <div className="icon-circle">
                <span className="icon">👥</span>
              </div>
              <h2>志愿者信息表</h2>
            </div>
            <div className="action-buttons">
              <Button type="primary" className="custom-button">
                志愿者申请表
              </Button>
              <Button className="custom-button">匹配领域</Button>
              <Button className="custom-button">服务时间偏好</Button>
            </div>
          </div>

          <div className="search-section">
            <div className="left-actions">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddVolunteer}
              >
                添加志愿者
              </Button>
              <Input
                placeholder="搜索志愿者"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200, marginLeft: 16 }}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{ marginLeft: 8 }}
              >
                搜索
              </Button>
            </div>
            <div className="right-actions">
              <Button type="primary" onClick={handleQuickAction}>
                快捷操作
              </Button>
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                style={{ marginLeft: 8 }}
              >
                打印
              </Button>
            </div>
          </div>

          <div className="table-container">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={volunteerData}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: "max-content" }}
                locale={{ emptyText: "暂无志愿者数据" }}
              />
            </Spin>
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条记录`}
              />
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="simple-volunteer-list" title="志愿者申请列表">
          <Spin spinning={applicationLoading}>
            <Table
              columns={simpleColumns}
              dataSource={applicationData}
              pagination={{
                simple: true,
                current: applicationCurrentPage,
                pageSize: applicationPageSize,
                total: applicationTotal,
                onChange: handleApplicationPageChange,
              }}
              bordered
              size="small"
              locale={{ emptyText: "暂无申请数据" }}
            />
          </Spin>
        </Card>
      </Col>

      {/* 添加志愿者模态框 */}
      <Modal
        title="添加志愿者"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={() => setIsAddModalVisible(false)}
        okText="确认"
        cancelText="取消"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系方式"
            rules={[
              { required: true, message: "请输入联系方式" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码" },
            ]}
          >
            <Input placeholder="请输入联系方式" />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <Input type="number" placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item
            name="serviceTimePreference"
            label="服务时间偏好"
            rules={[{ required: true, message: "请选择服务时间偏好" }]}
          >
            <Input placeholder="请输入服务时间偏好" />
          </Form.Item>
          <Form.Item
            name="expertiseArea"
            label="擅长领域"
            rules={[{ required: true, message: "请输入擅长领域" }]}
          >
            <Input placeholder="请输入擅长领域" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑志愿者模态框 */}
      <Modal
        title="编辑志愿者信息"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系方式"
            rules={[
              { required: true, message: "请输入联系方式" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码" },
            ]}
          >
            <Input placeholder="请输入联系方式" />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <Input type="number" placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item
            name="serviceTimePreference"
            label="服务时间偏好"
            rules={[{ required: true, message: "请选择服务时间偏好" }]}
          >
            <Input placeholder="请输入服务时间偏好" />
          </Form.Item>
          <Form.Item
            name="expertiseArea"
            label="擅长领域"
            rules={[{ required: true, message: "请输入擅长领域" }]}
          >
            <Input placeholder="请输入擅长领域" />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default VolunteerInfo;
