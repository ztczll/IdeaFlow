import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("开始种子数据初始化...");

  // 创建测试用户
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashedPassword,
      name: "测试用户",
    },
  });

  console.log("创建用户:", user.email);

  // 创建测试团队
  const team = await prisma.team.upsert({
    where: { id: "test-team-1" },
    update: {},
    create: {
      id: "test-team-1",
      name: "测试团队",
      ownerId: user.id,
    },
  });

  console.log("创建团队:", team.name);

  // 读取种子数据
  const seedDataPath = path.join(process.cwd(), "data", "seed.json");
  let seedData: any[] = [];

  if (fs.existsSync(seedDataPath)) {
    const fileContent = fs.readFileSync(seedDataPath, "utf-8");
    seedData = JSON.parse(fileContent);
    console.log(`从文件读取 ${seedData.length} 条需求数据`);
  } else {
    // 如果没有种子文件，创建示例数据
    console.log("未找到种子文件，创建示例数据...");
    seedData = generateSampleData();
  }

  // 创建需求
  let createdCount = 0;
  for (const item of seedData) {
    try {
      await prisma.requirement.create({
        data: {
          requirementId: item.requirementId || `AI-${String(createdCount + 1).padStart(3, "0")}`,
          entryDate: item.entryDate ? new Date(item.entryDate) : new Date(),
          description: item.description || item.需求描述 || "",
          problem: item.problem || item.问题痛点 || null,
          businessValue: item.businessValue || item.业务场景价值 || null,
          associatedUsers: item.associatedUsers || item.关联用户角色?.split(",") || [],
          dataSources: item.dataSources || item.潜在数据源 || null,
          feasibility: item.feasibility || item.技术可行性初判 || null,
          inspiration: item.inspiration || item.灵感来源 || null,
          status: item.status || item.状态 || "收集",
          nextAction: item.nextAction || item.下一步行动 || null,
          verificationResult: item.verificationResult || null,
          projectNumber: item.projectNumber || null,
          completedDate: item.completedDate ? new Date(item.completedDate) : null,
          userId: user.id,
          teamId: team.id,
        },
      });
      createdCount++;
    } catch (error) {
      console.error(`创建需求失败 (${item.requirementId || createdCount + 1}):`, error);
    }
  }

  console.log(`成功创建 ${createdCount} 条需求`);

  console.log("种子数据初始化完成！");
}

function generateSampleData() {
  // 生成10条示例数据
  const statuses = ["收集", "待评估", "验证中", "已验证-待启动", "搁置", "归档"];
  const feasibilities = ["高", "中", "低"];
  const roles = [
    "市场部文案专员",
    "产品经理",
    "数据分析师",
    "客服主管",
    "销售代表",
  ];

  const data = [];
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      requirementId: `AI-${String(i).padStart(3, "0")}`,
      entryDate: date.toISOString(),
      description: `示例需求 ${i}：为${roles[i % roles.length]}在某个场景解决某个问题`,
      problem: `这是问题描述 ${i}`,
      businessValue: `这是业务价值 ${i}`,
      associatedUsers: [roles[i % roles.length]],
      dataSources: `数据源 ${i}`,
      feasibility: feasibilities[i % feasibilities.length],
      inspiration: `灵感来源 ${i}`,
      status: statuses[i % statuses.length],
      nextAction: `下一步行动 ${i}`,
    });
  }
  return data;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

