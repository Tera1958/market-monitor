"use client";

import { useState } from "react";
import { useArticles, useProducts, useCrawlStatus } from "@/lib/hooks";
import { fetchAPI } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, Radio, RefreshCw } from "lucide-react";

const PLATFORMS = ["TechCrunch", "The Verge", "Google News", "Engadget", "Tom's Hardware"];
const CATEGORIES = ["transcription", "translation", "hardware", "software", "llm", "industry"];
const CATEGORY_LABELS: Record<string, string> = {
  transcription: "转录",
  translation: "翻译",
  hardware: "硬件",
  software: "软件",
  llm: "大模型",
  industry: "行业",
};

type Tab = "articles" | "products" | "crawlers";

export default function MarketIntelPage() {
  const [tab, setTab] = useState<Tab>("articles");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [triggering, setTriggering] = useState(false);

  const { data: articles, isLoading: articlesLoading } = useArticles({
    page,
    page_size: 20,
    source_platform: platform,
    category,
    search,
  });

  const { data: products, isLoading: productsLoading } = useProducts({
    page,
    page_size: 20,
    search,
  });

  const { data: crawlStatus } = useCrawlStatus();

  const triggerAll = async () => {
    setTriggering(true);
    try {
      await fetchAPI("/crawl/trigger", {
        method: "POST",
        body: JSON.stringify({ crawler_name: null }),
      });
    } catch {}
    setTriggering(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">市场情报</h1>
          <p className="text-sm text-gray-500 mt-1">竞品动态与行业新闻自动采集</p>
        </div>
        <button
          onClick={triggerAll}
          disabled={triggering}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          <RefreshCw size={14} className={triggering ? "animate-spin" : ""} />
          {triggering ? "采集中..." : "触发采集"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {([["articles", "文章/新闻"], ["products", "产品/新品"], ["crawlers", "爬虫状态"]] as const).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setPage(1); }}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Articles Tab */}
      {tab === "articles" && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文章标题..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={platform}
                onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">全部平台</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">全部分类</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
          </div>

          {articlesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : articles?.items.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Filter size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">暂无匹配的文章</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {articles?.items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              {articles && articles.total > articles.page_size && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50">上一页</button>
                  <span className="text-sm text-gray-600">第 {page} / {Math.ceil(articles.total / articles.page_size)} 页</span>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(articles.total / articles.page_size)} className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50">下一页</button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Products Tab */}
      {tab === "products" && (
        productsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : products?.items.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Filter size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">暂无产品数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}

      {/* Crawlers Tab */}
      {tab === "crawlers" && crawlStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(crawlStatus).map(([name, info]) => (
            <div key={name} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${info.last_status === "success" ? "bg-green-500" : info.last_status === "failed" ? "bg-red-500" : "bg-gray-300"}`} />
                <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>状态：{info.last_status === "success" ? "成功" : info.last_status === "failed" ? "失败" : "未运行"}</p>
                <p>上次运行：{info.last_run ? new Date(info.last_run).toLocaleString("zh-CN") : "从未"}</p>
                <p>保存条数：{info.items_saved}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
