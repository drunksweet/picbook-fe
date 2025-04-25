;`use client`

import { useState } from "react"
import { Button, Modal, Form, Input, Select, message, Dropdown } from "antd"
import type { MenuProps } from "antd"
import styles from "./VipActionButtons.module.scss"

// 模拟会员数据导出功能
const exportToExcel = () => {
  // 创建一个简单的CSV内容
  const csvContent = `会员编号,会员姓名,性别,联系方式,会员级别,状态,积分
20230201,张三,女,18186723357,普通,正常,580
20230202,李四,男,15678945877,普通,过期,666
20230203,王五,女,11223345674,普通,正常,456`

  // 创建Blob对象
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // 创建下载链接
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  // 设置下载属性
  link.setAttribute("href", url)
  link.setAttribute("download", `会员报告_${new Date().toLocaleDateString()}.csv`)

  // 添加到文档并触发点击
  document.body.appendChild(link)
  link.click()

  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  message.success("会员报告导出成功！")
}

// 模拟打印功能
const printMemberList = () => {
  // 创建打印内容
  const printContent = `
    <html>
      <head>
        <title>会员列表</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>会员列表</h1>
          <p>打印时间: ${new Date().toLocaleString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>会员编号</th>
              <th>会员姓名</th>
              <th>性别</th>
              <th>联系方式</th>
              <th>会员级别</th>
              <th>状态</th>
              <th>积分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>20230201</td>
              <td>张三</td>
              <td>女</td>
              <td>18186723357</td>
              <td>普通</td>
              <td>正常</td>
              <td>580</td>
            </tr>
            <tr>
              <td>2</td>
              <td>20230202</td>
              <td>李四</td>
              <td>男</td>
              <td>15678945877</td>
              <td>普通</td>
              <td>过期</td>
              <td>666</td>
            </tr>
            <tr>
              <td>3</td>
              <td>20230203</td>
              <td>王五</td>
              <td>女</td>
              <td>11223345674</td>
              <td>普通</td>
              <td>正常</td>
              <td>456</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `

  // 创建打印窗口
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()

    // 等待资源加载完成后打印
    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }
  } else {
    message.error("打印失败，请检查浏览器是否阻止了弹出窗口")
  }
}

export default function VipActionButtons() {
  // 状态管理
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  // 打开新增会员模态框
  const showAddMemberModal = () => {
    setIsModalOpen(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("提交的会员信息:", values)
        message.success("会员信息添加成功！")
        setIsModalOpen(false)
        form.resetFields()
      })
      .catch((info) => {
        console.log("表单验证失败:", info)
      })
  }

  // 快捷操作菜单项
  const quickActionItems: MenuProps["items"] = [
    {
      key: "1",
      label: "批量升级会员",
      onClick: () => message.info("批量升级会员功能即将上线"),
    },
    {
      key: "2",
      label: "批量发送通知",
      onClick: () => message.info("批量发送通知功能即将上线"),
    },
    {
      key: "3",
      label: "批量积分调整",
      onClick: () => message.info("批量积分调整功能即将上线"),
    },
    {
      key: "4",
      label: "会员数据分析",
      onClick: () => message.info("会员数据分析功能即将上线"),
    },
  ]

  return (
    <div style={{ padding: 10 }}>
      <div className={styles.tableActions}>
        <Button type="primary" className={styles.addButton} onClick={showAddMemberModal}>
          + 新增会员信息
        </Button>
        <Button className={styles.exportButton} onClick={exportToExcel}>
          导出会员报告
        </Button>
        <div className={styles.rightActions}>
          <Dropdown menu={{ items: quickActionItems }} placement="bottomRight">
            <Button className={styles.quickButton}>快捷操作</Button>
          </Dropdown>
          <Button className={styles.printButton} onClick={printMemberList}>
            打印
          </Button>
        </div>
      </div>

      {/* 新增会员模态框 */}
      <Modal
        title="新增会员信息"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText="提交"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ gender: "女", level: "普通", status: "正常" }}>
          <Form.Item name="name" label="会员姓名" rules={[{ required: true, message: "请输入会员姓名" }]}>
            <Input placeholder="请输入会员姓名" />
          </Form.Item>

          <Form.Item name="gender" label="性别">
            <Select>
              <Select.Option value="女">女</Select.Option>
              <Select.Option value="男">男</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="contact"
            label="联系方式"
            rules={[
              { required: true, message: "请输入联系方式" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码" },
            ]}
          >
            <Input placeholder="请输入联系方式" />
          </Form.Item>

          <Form.Item name="level" label="会员级别">
            <Select>
              <Select.Option value="普通">普通</Select.Option>
              <Select.Option value="银卡">银卡</Select.Option>
              <Select.Option value="金卡">金卡</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="过期">过期</Select.Option>
              <Select.Option value="冻结">冻结</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="points" label="初始积分" rules={[{ pattern: /^\d+$/, message: "请输入有效的积分数值" }]}>
            <Input placeholder="请输入初始积分" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
