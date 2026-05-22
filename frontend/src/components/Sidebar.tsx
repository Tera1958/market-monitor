"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Search,
  Newspaper,
  GitCompareArrows,
  MessageSquareText,
  Target,
  FileText,
  ClipboardList,
  TestTube,
  Puzzle,
  Tags,
  Lightbulb,
  BookOpen,
  Library,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "桌面研究",
    icon: Search,
    items: [
      { href: "/desk-research/market", label: "市场情报", icon: Newspaper },
      { href: "/desk-research/competitive", label: "竞品分析", icon: GitCompareArrows },
      { href: "/desk-research/reviews", label: "口碑监听", icon: MessageSquareText },
    ],
  },
  {
    label: "一手研究",
    icon: Target,
    items: [
      { href: "/primary/interviews", label: "访谈管理", icon: FileText },
      { href: "/primary/surveys", label: "问卷中心", icon: ClipboardList },
      { href: "/primary/usability", label: "可用性测试", icon: TestTube },
    ],
  },
  {
    label: "分析综合",
    icon: Puzzle,
    items: [
      { href: "/analysis/coding", label: "编码标注", icon: Tags },
      { href: "/analysis/affinity", label: "亲和图", icon: Puzzle },
      { href: "/analysis/insights", label: "洞察提炼", icon: Lightbulb },
    ],
  },
  {
    label: "知识库",
    icon: Library,
    items: [
      { href: "/library/reports", label: "研究报告", icon: BookOpen },
      { href: "/library/insights", label: "洞察库", icon: Sparkles },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of navGroups) {
      if (group.items.some((item) => pathname.startsWith(item.href))) {
        initial[group.label] = true;
      }
    }
    return initial;
  });

  const toggle = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-base font-bold">UX Research</h1>
        <p className="text-xs text-gray-400 mt-0.5">用户研究工作台</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            pathname === "/"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          总览
        </Link>

        {/* Projects */}
        <Link
          href="/projects"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            pathname === "/projects"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <FolderKanban size={18} />
          项目中心
        </Link>

        {/* Collapsible groups */}
        {navGroups.map((group) => {
          const isExpanded = expanded[group.label] ?? false;
          const isActive = group.items.some((item) => pathname.startsWith(item.href));
          const GroupIcon = group.icon;

          return (
            <div key={group.label}>
              <button
                onClick={() => toggle(group.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive && !isExpanded
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <GroupIcon size={18} />
                <span className="flex-1 text-left">{group.label}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isExpanded && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                          active
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <Icon size={14} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">v2.0 - Research Workbench</p>
      </div>
    </aside>
  );
}
