"use client";

import { Article } from "@/lib/api";

const PLATFORM_COLORS: Record<string, string> = {
  "TechCrunch": "bg-green-100 text-green-800",
  "The Verge": "bg-purple-100 text-purple-800",
  "Google News": "bg-blue-100 text-blue-800",
  "Engadget": "bg-orange-100 text-orange-800",
  "Tom's Hardware": "bg-red-100 text-red-800",
  "Product Hunt": "bg-amber-100 text-amber-800",
};

const CATEGORY_LABELS: Record<string, string> = {
  transcription: "转录",
  translation: "翻译",
  hardware: "硬件",
  software: "软件",
  llm: "大模型",
  industry: "行业",
};

const CATEGORY_COLORS: Record<string, string> = {
  transcription: "bg-cyan-100 text-cyan-800",
  translation: "bg-indigo-100 text-indigo-800",
  hardware: "bg-pink-100 text-pink-800",
  software: "bg-teal-100 text-teal-800",
  llm: "bg-violet-100 text-violet-800",
  industry: "bg-yellow-100 text-yellow-800",
};

export default function ArticleCard({ article }: { article: Article }) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
    : new Date(article.crawled_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });

  const brands = article.brands_mentioned?.brands as string[] | undefined;
  const platformColor = PLATFORM_COLORS[article.source_platform] || "bg-gray-100 text-gray-800";

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${platformColor}`}>
              {article.source_platform}
            </span>
            {article.category && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-700"}`}>
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
            )}
            {brands && brands.length > 0 && brands.slice(0, 2).map((brand) => (
              <span key={brand} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200">
                {brand}
              </span>
            ))}
            <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{publishedDate}</span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
          </a>

          {article.summary && (
            <p className="text-xs text-gray-500 line-clamp-2">{article.summary}</p>
          )}

          {article.source_name && article.source_name !== article.source_platform && (
            <p className="text-xs text-gray-400 mt-1.5">
              来源: {article.source_name}
            </p>
          )}
        </div>

        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-16 h-16 rounded object-cover flex-shrink-0"
          />
        )}
      </div>
    </div>
  );
}
