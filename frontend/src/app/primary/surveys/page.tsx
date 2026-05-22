"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function SurveysPage() {
  return (
    <PlaceholderPage
      title="问卷中心"
      description="AI辅助问卷设计与数据回收"
      features={[
        "AI辅助问卷生成（根据研究目标自动推荐题型）",
        "支持量表题、NPS、SUS、开放题、矩阵题",
        "逻辑跳转与分支设计",
        "问卷偏见检测与措辞优化建议",
        "导出至腾讯问卷、问卷星等平台",
      ]}
    />
  );
}
