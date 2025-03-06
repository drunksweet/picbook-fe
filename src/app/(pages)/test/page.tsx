import EChartsPie from "@components/echarts/pie"
import EChartsBar from "@/components/echarts/bar"

export default function TestPage() {
  // 这些数据可以从API获取或其他来源
  const pieData = [
    { value: 1048, name: "Search Engine" },
    { value: 735, name: "Direct" },
    { value: 580, name: "Email" },
    { value: 484, name: "Union Ads" },
    { value: 300, name: "Video Ads" },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ECharts 示例</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <EChartsPie data={pieData} />
      </div>
    </div>
  )
}

