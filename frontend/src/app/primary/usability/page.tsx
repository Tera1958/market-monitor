"use client";

import PlaceholderPage from "@/components/PlaceholderPage";

export default function UsabilityPage() {
  return (
    <PlaceholderPage
      title="可用性测试"
      description="可用性测试计划、执行与数据记录"
      features={[
        "测试脚本编写（任务描述、成功标准、追问）",
        "测试会话管理（参与者、时间、录屏链接）",
        "任务完成率、操作时长、错误率记录",
        "SUS/UMUX 量表评分自动计算",
        "问题严重度评级与修复建议追踪",
      ]}
    />
  );
}
