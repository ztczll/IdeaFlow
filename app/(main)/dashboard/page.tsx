import { PipelineCard } from "@/components/dashboard/PipelineCard";
import { Top5Card } from "@/components/dashboard/Top5Card";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { FeasibilityChart } from "@/components/dashboard/FeasibilityChart";
import { WordCloud } from "@/components/dashboard/WordCloud";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-h1 font-display">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 需求管道卡片 */}
        <div className="md:col-span-4">
          <PipelineCard />
        </div>

        {/* 高价值TOP5 */}
        <div className="md:col-span-8">
          <Top5Card />
        </div>

        {/* 录入趋势图 */}
        <div className="md:col-span-6">
          <TrendChart />
        </div>

        {/* 可行性分布 */}
        <div className="md:col-span-6">
          <FeasibilityChart />
        </div>

        {/* 词云 */}
        <div className="md:col-span-12">
          <WordCloud />
        </div>
      </div>
    </div>
  );
}

