"use client";

import { useDashboard } from "@/lib/hooks";
import StatsCard from "@/components/StatsCard";
import { Newspaper, Package, Tags, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

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
          运行 <code className="bg-yellow-100 px-1 rounded">docker-compose up</code> 启动数据库，
          然后 <code className="bg-yellow-100 px-1 rounded">uvicorn app.main:app --reload</code> 启动后端
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">AI转录/翻译/商务办公领域市场情报概览</p>
      </div>

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

      {data?.sources_count && Object.keys(data.sources_count).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">各平台文章数量</h2>
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

      {(!data || (data.total_articles === 0 && data.total_products === 0)) && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mt-6">
          <p className="text-gray-500 mb-4">暂无数据，请前往爬虫管理页面触发数据采集</p>
          <a href="/crawl" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            前往爬虫管理
          </a>
        </div>
      )}
    </div>
  );
}
