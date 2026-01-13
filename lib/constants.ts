export const APP_NAME = "IdeaFlow";

export const PAGE_SIZE = 50;

export const MAX_LENGTHS = {
  description: 140,
  problem: 500,
  businessValue: 500,
  dataSources: 300,
  inspiration: 140,
  nextAction: 140,
} as const;

export const STATUS_OPTIONS = [
  "收集",
  "待评估",
  "验证中",
  "已验证-待启动",
  "搁置",
  "归档",
] as const;

export const FEASIBILITY_OPTIONS = ["高", "中", "低"] as const;

