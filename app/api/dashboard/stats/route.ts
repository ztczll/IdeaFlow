import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startOfWeek, subWeeks, format } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const userId = session.user.id;

    // 获取所有需求
    const requirements = await prisma.requirement.findMany({
      where: {
        OR: [
          { userId },
          // 可以添加团队需求
        ],
      },
      orderBy: { entryDate: "desc" },
    });

    // 需求管道统计
    const pipeline = {
      收集: 0,
      待评估: 0,
      验证中: 0,
      "已验证-待启动": 0,
      搁置: 0,
      归档: 0,
    };

    requirements.forEach((req) => {
      if (req.status in pipeline) {
        pipeline[req.status as keyof typeof pipeline]++;
      }
    });

    // 高价值TOP5（按业务价值排序，这里简化处理）
    const top5 = requirements
      .filter((r) => r.businessValue)
      .slice(0, 5)
      .map((r) => ({
        ...r,
        entryDate: r.entryDate.toISOString(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        completedDate: r.completedDate?.toISOString() || null,
      }));

    // 录入趋势（近12周）
    const now = new Date();
    const trend = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const count = requirements.filter((req) => {
        const entryDate = new Date(req.entryDate);
        return entryDate >= weekStart && entryDate <= weekEnd;
      }).length;

      trend.push({
        week: format(weekStart, "yyyy-MM-dd"),
        count,
      });
    }

    // 可行性分布
    const feasibility = {
      高: 0,
      中: 0,
      低: 0,
    };

    requirements.forEach((req) => {
      if (req.feasibility && req.feasibility in feasibility) {
        feasibility[req.feasibility as keyof typeof feasibility]++;
      }
    });

    // 下一步行动热点词（简化版，从nextAction中提取关键词）
    const wordCount: Record<string, number> = {};
    requirements.forEach((req) => {
      if (req.nextAction) {
        const words = req.nextAction.split(/[\s，,。.；;]/).filter((w) => w.length > 1);
        words.forEach((word) => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });
      }
    });

    const wordCloud = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([text, value]) => ({ text, value }));

    return NextResponse.json({
      pipeline,
      top5,
      trend,
      feasibility,
      wordCloud,
    });
  } catch (error) {
    console.error("获取仪表盘数据失败:", error);
    return NextResponse.json(
      { error: "获取仪表盘数据失败" },
      { status: 500 }
    );
  }
}

