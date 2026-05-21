"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks";
import ProductCard from "@/components/ProductCard";
import { Search, Filter } from "lucide-react";

const BRANDS = [
  "华为", "小米", "OPPO", "Apple", "科大讯飞", "Google", "Cleer",
  "漫步者", "Vivo", "南卡", "Samsung", "Soundcore", "Plaud",
  "时空壶", "Suunto", "墨觉", "兰士顿", "荣耀", "纽曼", "追觅",
];

const PLATFORMS = ["Amazon", "Kickstarter", "Indiegogo", "JD", "Taobao"];

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [sortBy, setSortBy] = useState("crawled_at");

  const { data, isLoading } = useProducts({
    page,
    page_size: 20,
    brand,
    source_platform: sourcePlatform,
    search,
    sort_by: sortBy,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">产品/新品</h1>
        <p className="text-sm text-gray-500 mt-1">转录翻译相关产品追踪</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索产品名称..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部品牌</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={sourcePlatform}
            onChange={(e) => { setSourcePlatform(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部平台</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="crawled_at">最新采集</option>
            <option value="release_date">上市时间</option>
            <option value="sales_rank">销量排名</option>
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
          <p className="text-gray-500">暂无匹配的产品</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items.map((product) => (
              <ProductCard key={product.id} product={product} />
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
