import EChartsPie from "@/components/echarts/home/pie"
import EChartsBar from "@/components/echarts/bar"
import Dashboard from "@/components/dashboard/dashboard"
import InventoryManagement from "@/components/InventoryManagement/InventoryManagement"
import Banner from "@/components/banner"
import TangTable from "@/components/TangTable/TangTable"
import { LogIn } from "lucide-react"
import BorrowBarChart from "@/components/echarts/borrow_bar/BorrowBarChart";


export default function TestPage() {


  return (
    <div className="container mx-auto p-4">
      <BorrowBarChart/>
    </div>
  )
}

