export type RequirementStatus = 
  | "收集" 
  | "待评估" 
  | "验证中" 
  | "已验证-待启动" 
  | "搁置" 
  | "归档";

export type Feasibility = "高" | "中" | "低";

export interface Requirement {
  id: string;
  requirementId: string; // AI-001格式
  entryDate: Date;
  description: string; // ≤140字
  problem?: string; // ≤500字
  businessValue?: string; // ≤500字
  associatedUsers: string[]; // 多选角色
  dataSources?: string; // ≤300字
  feasibility?: Feasibility;
  inspiration?: string; // ≤140字
  status: RequirementStatus;
  nextAction?: string; // ≤140字
  verificationResult?: string;
  projectNumber?: string;
  completedDate?: Date;
  userId: string;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

export interface DashboardStats {
  pipeline: Record<RequirementStatus, number>;
  top5: Requirement[];
  trend: Array<{ week: string; count: number }>;
  feasibility: Record<Feasibility, number>;
  wordCloud: Array<{ text: string; value: number }>;
}

export interface QuickCaptureInput {
  description: string;
  inspiration?: string;
}

export const STATUS_COLORS: Record<RequirementStatus, string> = {
  收集: "#6C757D",
  待评估: "#28A745",
  验证中: "#FFC107",
  "已验证-待启动": "#17A2B8",
  搁置: "#DC3545",
  归档: "#343A40",
};

export const FEASIBILITY_COLORS: Record<Feasibility, string> = {
  高: "#28A745",
  中: "#17A2B8",
  低: "#DC3545",
};

export const STATUS_TRANSITIONS: Record<RequirementStatus, RequirementStatus[]> = {
  收集: ["待评估", "搁置"],
  待评估: ["验证中", "搁置"],
  验证中: ["已验证-待启动", "搁置"],
  "已验证-待启动": ["归档"],
  搁置: ["待评估", "归档"],
  归档: [], // 只读状态
};

export const DEFAULT_ROLES = [
  "市场部文案专员",
  "产品经理",
  "数据分析师",
  "客服主管",
  "销售代表",
  "运营实习生",
  "企业高管",
  "终端用户",
];

