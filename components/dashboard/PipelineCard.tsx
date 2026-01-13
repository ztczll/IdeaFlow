"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_COLORS, RequirementStatus } from "@/types";

export function PipelineCard() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("获取失败");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>需求管道</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  const pipeline = data?.pipeline || {};
  const statuses: RequirementStatus[] = [
    "收集",
    "待评估",
    "验证中",
    "已验证-待启动",
    "搁置",
    "归档",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>需求管道</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {statuses.map((status) => {
            const count = pipeline[status] || 0;
            const color = STATUS_COLORS[status];
            return (
              <div
                key={status}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-interactive-hover cursor-pointer transition-colors"
                onClick={() => router.push(`/?status=${encodeURIComponent(status)}`)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{status}</span>
                </div>
                <span
                  className="text-lg font-semibold"
                  style={{ color }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

