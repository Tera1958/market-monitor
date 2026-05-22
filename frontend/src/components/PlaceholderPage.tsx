"use client";

import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features: string[];
}

export default function PlaceholderPage({ title, description, features }: PlaceholderPageProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="p-4 bg-amber-50 rounded-full mb-4">
            <Construction size={32} className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">功能开发中</h2>
          <p className="text-sm text-gray-500 mb-6">该模块正在建设中，即将上线以下功能：</p>

          <ul className="text-left w-full space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
