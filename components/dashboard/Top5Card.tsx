"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Requirement } from "@/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/requirements/StatusBadge";

export function Top5Card() {
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
          <CardTitle>高价值 TOP5</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  const top5 = (data?.top5 || []) as Requirement[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>高价值 TOP5</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top5.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              暂无数据
            </div>
          ) : (
            top5.map((req, index) => (
              <div
                key={req.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-interactive-hover cursor-pointer transition-colors"
                onClick={() => {
                  // TODO: 打开详情抽屉
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">{req.requirementId}</span>
                    <StatusBadge status={req.status as any} />
                  </div>
                  <p className="text-sm truncate">{req.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(req.entryDate)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

