"use client"
import { ConfigProvider, App } from "antd"
import Banner from "@/components/banner"
import VolunteerTabs from "@/components/volunteer/VolunteerTabs"
import "./page.scss"

const VolunteerManagementPage = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F59A23",
          colorLink: "#F59A23",
        },
      }}
    >
      <App>
        <Banner title="志愿者管理" />
        <div className="volunteer-content">
          <VolunteerTabs />
        </div>
      </App>
    </ConfigProvider>
  )
}

export default VolunteerManagementPage
