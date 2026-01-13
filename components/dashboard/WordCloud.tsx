"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WordCloud() {
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
          <CardTitle>下一步行动热点词</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  const wordCloud = data?.wordCloud || [];

  // 计算字体大小范围
  const maxValue = Math.max(...wordCloud.map((w: any) => w.value), 1);
  const minValue = Math.min(...wordCloud.map((w: any) => w.value), 1);

  const getFontSize = (value: number) => {
    if (maxValue === minValue) return 14;
    const ratio = (value - minValue) / (maxValue - minValue);
    return 12 + ratio * 8; // 12px 到 20px
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>下一步行动热点词</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-center py-4">
          {wordCloud.length === 0 ? (
            <div className="text-center text-muted-foreground">暂无数据</div>
          ) : (
            wordCloud.map((word: { text: string; value: number }) => (
              <span
                key={word.text}
                className="cursor-pointer hover:scale-110 transition-transform inline-block"
                style={{
                  fontSize: `${getFontSize(word.value)}px`,
                  fontWeight: word.value > maxValue * 0.7 ? 600 : 400,
                }}
                onClick={() => {
                  router.push(`/?search=${encodeURIComponent(word.text)}`);
                }}
                title={`出现 ${word.value} 次`}
              >
                {word.text}
              </span>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

