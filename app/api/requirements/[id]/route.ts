import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { validateRequirementStatusTransition } from "@/lib/utils";

const updateRequirementSchema = z.object({
  description: z.string().min(1).max(140).optional(),
  problem: z.string().max(500).optional(),
  businessValue: z.string().max(500).optional(),
  associatedUsers: z.array(z.string()).optional(),
  dataSources: z.string().max(300).optional(),
  feasibility: z.enum(["高", "中", "低"]).optional(),
  status: z.string().optional(),
  nextAction: z.string().max(140).optional(),
  verificationResult: z.string().optional(),
  projectNumber: z.string().optional(),
  inspiration: z.string().max(140).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const requirement = await prisma.requirement.findUnique({
      where: { id: params.id },
    });

    if (!requirement) {
      return NextResponse.json({ error: "需求不存在" }, { status: 404 });
    }

    // 检查权限：只能修改自己的需求或团队需求
    if (requirement.userId !== session.user.id) {
      // 可以添加团队权限检查
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const body = await request.json();
    const data = updateRequirementSchema.parse(body);

    // 状态流转验证
    if (data.status && data.status !== requirement.status) {
      if (!validateRequirementStatusTransition(requirement.status, data.status)) {
        return NextResponse.json(
          { error: "不允许的状态转换" },
          { status: 400 }
        );
      }

      // 归档时自动设置完成日期
      if (data.status === "归档" && !requirement.completedDate) {
        data.completedDate = new Date();
      }
    }

    const updated = await prisma.requirement.update({
      where: { id: params.id },
      data: {
        ...data,
        completedDate: data.status === "归档" ? new Date() : requirement.completedDate,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("更新需求失败:", error);
    return NextResponse.json(
      { error: "更新需求失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const requirement = await prisma.requirement.findUnique({
      where: { id: params.id },
    });

    if (!requirement) {
      return NextResponse.json({ error: "需求不存在" }, { status: 404 });
    }

    if (requirement.userId !== session.user.id) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    await prisma.requirement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除需求失败:", error);
    return NextResponse.json(
      { error: "删除需求失败" },
      { status: 500 }
    );
  }
}

