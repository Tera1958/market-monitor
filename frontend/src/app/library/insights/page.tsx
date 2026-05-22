"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function InsightLibraryPage() {
  return (
    <PlaceholderPage
      title="洞察库"
      description="组织级研究洞察知识仓库"
      features={[
        "所有已验证洞察的可检索仓库",
        "标签分类（产品线、用户群、主题）",
        "洞察生命周期管理（假设→已验证→已应用→已过时）",
        "设计建议采纳追踪与研究影响力度量",
        "防止重复研究的知识去重",
      ]}
    />
  );
}
