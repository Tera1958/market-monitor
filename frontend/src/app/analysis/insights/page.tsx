"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function InsightSynthesisPage() {
  return (
    <PlaceholderPage
      title="洞察提炼"
      description="从多数据源综合提炼研究洞察"
      features={[
        "跨多份逐字稿自动提取主题与模式",
        "洞察卡片：结论 + 支撑证据（引述/数据）",
        "证据强度评估（数据来源数量与一致性）",
        "用户画像与旅程图构建",
        "洞察之间的关联关系图谱",
      ]}
    />
  );
}
