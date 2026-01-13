import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateRequirementId } from "@/lib/utils";

const createRequirementSchema = z.object({
  description: z.string().min(1).max(140),
  inspiration: z.string().max(140).optional(),
  problem: z.string().max(500).optional(),
  businessValue: z.string().max(500).optional(),
  associatedUsers: z.array(z.string()).optional(),
  dataSources: z.string().max(300).optional(),
  feasibility: z.enum(["高", "中", "低"]).optional(),
  status: z.string().optional(),
  nextAction: z.string().max(140).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const feasibility = searchParams.get("feasibility");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const teamId = searchParams.get("teamId");

    const where: any = {
      OR: [
        { userId: session.user.id },
        ...(teamId ? [{ teamId }] : []),
      ],
    };

    if (status) {
      const statuses = status.split(",");
      where.status = { in: statuses };
    }

    if (feasibility) {
      const feasibilities = feasibility.split(",");
      where.feasibility = { in: feasibilities };
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { problem: { contains: search, mode: "insensitive" } },
        { businessValue: { contains: search, mode: "insensitive" } },
        { inspiration: { contains: search, mode: "insensitive" } },
      ];
    }

    if (startDate || endDate) {
      where.entryDate = {};
      if (startDate) {
        where.entryDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.entryDate.lte = new Date(endDate);
      }
    }

    const [requirements, total] = await Promise.all([
      prisma.requirement.findMany({
        where,
        orderBy: { entryDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.requirement.count({ where }),
    ]);

    return NextResponse.json({
      requirements,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("获取需求列表失败:", error);
    return NextResponse.json(
      { error: "获取需求列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const data = createRequirementSchema.parse(body);

    // 获取最后一个需求ID
    const lastRequirement = await prisma.requirement.findFirst({
      orderBy: { requirementId: "desc" },
      select: { requirementId: true },
    });

    let lastNumber = 0;
    if (lastRequirement) {
      const match = lastRequirement.requirementId.match(/AI-(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1]);
      }
    }

    const requirementId = generateRequirementId(lastNumber);

    const requirement = await prisma.requirement.create({
      data: {
        ...data,
        requirementId,
        status: data.status || "收集",
        userId: session.user.id,
      },
    });

    return NextResponse.json(requirement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("创建需求失败:", error);
    return NextResponse.json(
      { error: "创建需求失败" },
      { status: 500 }
    );
  }
}

