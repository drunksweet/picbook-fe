"use client"

import { useState } from "react"
import { Row, Col, Card, Tabs } from "antd"
import VolunteerInfo from "./tabs/VolunteerInfo"
import ServiceRecords from "./tabs/ServiceRecords"
import VolunteerRecruitment from "./tabs/VolunteerRecruitment"
import "./VolunteerTabs.scss"

const { TabPane } = Tabs

const VolunteerTabs = () => {
  const [activeTab, setActiveTab] = useState("1")

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <div className="nav-tabs">
            <Tabs defaultActiveKey="1" type="card" className="custom-tabs" onChange={handleTabChange}>
              <TabPane tab="志愿者信息" key="1" />
              <TabPane tab="服务记录" key="2" />
              <TabPane tab="志愿者招募" key="3" />

            </Tabs>
          </div>
        </Card>
      </Col>
      <Col span={24}>
        {activeTab === "1" && <VolunteerInfo />}
        {activeTab === "2" && <ServiceRecords />}
        {activeTab === "3" && <VolunteerRecruitment />}
      </Col>
    </Row>
  )
}

export default VolunteerTabs
