"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function CodingPage() {
  return (
    <PlaceholderPage
      title="编码标注"
      description="访谈逐字稿主题编码与定性分析"
      features={[
        "逐字稿逐段标注，支持多级编码体系",
        "演绎编码（预设码本）与归纳编码（涌现标签）",
        "AI推荐编码标签，提升标注效率",
        "编码间信度计算（多研究员协作时）",
        "编码频次统计与主题分布可视化",
      ]}
    />
  );
}
