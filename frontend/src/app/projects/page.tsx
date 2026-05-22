"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="项目中心"
      description="研究项目全生命周期管理"
      features={[
        "创建研究项目，设定目标、时间线和负责人",
        "AI辅助生成研究方案（方法选择、样本量、排期）",
        "受访者招募管理（受访者库、筛选条件、排期日历）",
        "项目关联：将访谈、问卷、分析等数据关联到项目",
        "项目看板视图与甘特图时间线",
      ]}
    />
  );
}
