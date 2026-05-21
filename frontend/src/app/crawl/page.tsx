"use client";

import { useState, useEffect } from "react";
import { fetchAPI, CrawlLog, CrawlStatus } from "@/lib/api";

const CRAWLER_LABELS: Record<string, string> = {
  techcrunch: "TechCrunch",
  theverge: "The Verge",
  googlenews: "Google News",
  producthunt: "Product Hunt",
  engadget: "Engadget",
  tomshardware: "Tom's Hardware",
};

function StatusDot({ status }: { status: string }) {
  const color =
    status === "success" ? "bg-green-500" :
    status === "failed" ? "bg-red-500" :
    status === "running" ? "bg-blue-500 animate-pulse" :
    "bg-gray-300";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}

export default function CrawlPage() {
  const [status, setStatus] = useState<CrawlStatus | null>(null);
  const [logs, setLogs] = useState<CrawlLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [s, l] = await Promise.all([
        fetchAPI<CrawlStatus>("/crawl/status"),
        fetchAPI<CrawlLog[]>("/crawl/logs"),
      ]);
      setStatus(s);
      setLogs(l);
    } catch {
      // API not available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerCrawl = async (crawlerName?: string) => {
    setTriggering(crawlerName || "all");
    try {
      await fetchAPI("/crawl/trigger", {
        method: "POST",
        body: JSON.stringify({ crawler_name: crawlerName || null }),
      });
      setTimeout(loadData, 1500);
    } catch {
      alert("触发失败，请检查后端是否运行");
    } finally {
      setTriggering(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">爬虫管理</h1>
          <p className="text-sm text-gray-500 mt-1">手动触发数据采集任务</p>
        </div>
        <button
          onClick={() => triggerCrawl()}
          disabled={triggering !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {triggering === "all" ? "采集中..." : "全部采集"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(CRAWLER_LABELS).map(([name, label]) => {
          const cs = status?.[name];
          return (
            <div key={name} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status={cs?.last_status || "never_run"} />
                  <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
                </div>
                <button
                  onClick={() => triggerCrawl(name)}
                  disabled={triggering !== null}
                  className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {triggering === name ? "..." : "采集"}
                </button>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  状态：
                  <span className={
                    cs?.last_status === "success" ? "text-green-600 font-medium" :
                    cs?.last_status === "failed" ? "text-red-600 font-medium" :
                    cs?.last_status === "running" ? "text-blue-600 font-medium" : ""
                  }>
                    {cs?.last_status === "success" ? "成功" :
                     cs?.last_status === "failed" ? "失败" :
                     cs?.last_status === "running" ? "运行中" : "未运行"}
                  </span>
                </p>
                <p>上次运行：{cs?.last_run ? new Date(cs.last_run).toLocaleString("zh-CN") : "从未"}</p>
                <p>上次保存：{cs?.items_saved ?? 0} 条</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">执行日志</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">暂无执行记录</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">爬虫</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">状态</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">发现/保存</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">时间</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">错误</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3">{CRAWLER_LABELS[log.crawler_name] || log.crawler_name}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={log.status} />
                        <span>{log.status}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">{log.items_found} / {log.items_saved}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {new Date(log.started_at).toLocaleString("zh-CN")}
                    </td>
                    <td className="py-2 px-3 text-red-500 text-xs max-w-[200px] truncate">
                      {log.error_message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
