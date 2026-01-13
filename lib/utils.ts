import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRequirementId(lastNumber: number): string {
  const nextNumber = lastNumber + 1;
  return `AI-${String(nextNumber).padStart(3, "0")}`;
}

export function validateRequirementStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  const transitions: Record<string, string[]> = {
    收集: ["待评估", "搁置"],
    待评估: ["验证中", "搁置"],
    验证中: ["已验证-待启动", "搁置"],
    "已验证-待启动": ["归档"],
    搁置: ["待评估", "归档"],
    归档: [],
  };
  
  return transitions[currentStatus]?.includes(newStatus) ?? false;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

