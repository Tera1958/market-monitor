"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function InterviewsPage() {
  return (
    <PlaceholderPage
      title="访谈管理"
      description="访谈全流程工具：提纲生成 → 逐字稿处理 → 编码分析"
      features={[
        "AI辅助生成结构化/半结构化访谈提纲",
        "上传音频或逐字稿文本，AI自动清洗处理",
        "说话人分离、口头禅去除、时间戳对齐",
        "逐字稿在线阅读与高亮标注",
        "关键引述提取与分类管理",
      ]}
    />
  );
}
