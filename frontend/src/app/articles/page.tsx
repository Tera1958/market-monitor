"use client";

import { useState } from "react";
import { useArticles } from "@/lib/hooks";
import ArticleCard from "@/components/ArticleCard";
import { Search, Filter } from "lucide-react";

const PLATFORMS = ["TechCrunch", "The Verge", "Google News", "Engadget", "Tom's Hardware", "Product Hunt"];
const CATEGORIES = ["transcription", "translation", "hardware", "software", "llm", "industry"];
const CATEGORY_LABELS: Record<string, string> = {
  transcription: "转录",
  translation: "翻译",
  hardware: "硬件",
  software: "软件",
  llm: "大模型",
  industry: "行业",
};

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useArticles({
    page,
    page_size: 20,
    source_platform: platform,
    category,
    search,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">文章/新闻</h1>
        <p className="text-sm text-gray-500 mt-1">来自各平台的行业资讯</p>
      </div>

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
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部平台</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        </div>
      ) : data?.items.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Filter size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">暂无匹配的文章</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {data && data.total > data.page_size && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                上一页
              </button>
              <span className="text-sm text-gray-600">
                第 {page} / {Math.ceil(data.total / data.page_size)} 页
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(data.total / data.page_size)}
                className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
