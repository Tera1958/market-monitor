"use client";

import { useDashboard } from "@/lib/hooks";
import StatsCard from "@/components/StatsCard";
import { Newspaper, Package, Tags, Clock, FolderKanban, FileText, ClipboardList, Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import Link from "next/link";

const MODULE_CARDS = [
  { href: "/projects", label: "项目中心", desc: "研究项目管理", icon: FolderKanban, color: "bg-blue-50 text-blue-700" },
  { href: "/desk-research/market", label: "市场情报", desc: "竞品动态采集", icon: Newspaper, color: "bg-green-50 text-green-700" },
  { href: "/primary/interviews", label: "访谈管理", desc: "逐字稿处理", icon: FileText, color: "bg-purple-50 text-purple-700" },
  { href: "/primary/surveys", label: "问卷中心", desc: "问卷设计生成", icon: ClipboardList, color: "bg-orange-50 text-orange-700" },
  { href: "/analysis/insights", label: "洞察提炼", desc: "分析与综合", icon: Lightbulb, color: "bg-amber-50 text-amber-700" },
];

export default function DashboardPage() {
  const { data, error, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">无法连接到后端服务，请确保后端已启动。</p>
        <p className="text-sm text-yellow-600 mt-2">
          运行 <code className="bg-yellow-100 px-1 rounded">uvicorn app.main:app --reload</code> 启动后端
        </p>
      </div>
    );
  }

  const lastCrawl = data?.last_crawl_time
    ? formatDistanceToNow(new Date(data.last_crawl_time), { addSuffix: true, locale: zhCN })
    : "从未执行";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">研究工作台</h1>
        <p className="text-sm text-gray-500 mt-1">AI转录/翻译/商务办公领域用户研究概览</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="文章总数"
          value={data?.total_articles ?? 0}
          subtitle={`今日新增 ${data?.today_articles ?? 0}`}
          icon={<Newspaper size={20} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatsCard
          title="产品总数"
          value={data?.total_products ?? 0}
          subtitle={`今日新增 ${data?.today_products ?? 0}`}
          icon={<Package size={20} className="text-purple-600" />}
          color="bg-purple-50"
        />
        <StatsCard
          title="活跃品牌"
          value={data?.active_brands ?? 0}
          icon={<Tags size={20} className="text-green-600" />}
          color="bg-green-50"
        />
        <StatsCard
          title="上次采集"
          value={lastCrawl}
          icon={<Clock size={20} className="text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      {/* Quick access modules */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速进入</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {MODULE_CARDS.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 rounded-lg ${mod.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{mod.label}</p>
                  <p className="text-xs text-gray-500">{mod.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Source counts */}
      {data?.sources_count && Object.keys(data.sources_count).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">市场情报 — 各平台文章数量</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(data.sources_count).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-700">{platform}</span>
                <span className="text-sm font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
