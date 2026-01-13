"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Requirement } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FEASIBILITY_COLORS } from "@/types";
import { formatDate } from "@/lib/utils";
import { Download, Upload, Plus, Edit, Trash2, Archive } from "lucide-react";

export function RequirementsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: searchParams.get("status")?.split(",") || [],
    feasibility: searchParams.get("feasibility")?.split(",") || [],
    search: searchParams.get("search") || "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["requirements", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status.length) {
        params.append("status", filters.status.join(","));
      }
      if (filters.feasibility.length) {
        params.append("feasibility", filters.feasibility.join(","));
      }
      if (filters.search) {
        params.append("search", filters.search);
      }

      const response = await fetch(`/api/requirements?${params.toString()}`);
      if (!response.ok) throw new Error("获取失败");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("删除失败");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
      setSelectedRows([]);
    },
  });

  const columns = useMemo<ColumnDef<Requirement>[]>(
    () => [
      {
        accessorKey: "requirementId",
        header: "需求ID",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.requirementId}</span>
        ),
        size: 100,
      },
      {
        accessorKey: "description",
        header: "需求描述",
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate">{row.original.description}</div>
        ),
        size: 180,
      },
      {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
        size: 120,
      },
      {
        accessorKey: "feasibility",
        header: "技术可行性",
        cell: ({ row }) => {
          const feasibility = row.original.feasibility;
          if (!feasibility) return "-";
          const color = FEASIBILITY_COLORS[feasibility];
          return (
            <Badge
              style={{
                backgroundColor: `${color}20`,
                color: color,
                borderColor: color,
              }}
            >
              {feasibility}
            </Badge>
          );
        },
        size: 120,
      },
      {
        accessorKey: "nextAction",
        header: "下一步行动",
        cell: ({ row }) => (
          <div className="max-w-[140px] truncate text-sm">
            {row.original.nextAction || "-"}
          </div>
        ),
        size: 140,
      },
      {
        accessorKey: "entryDate",
        header: "录入日期",
        cell: ({ row }) => formatDate(row.original.entryDate),
        size: 100,
      },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // TODO: 打开详情抽屉
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 100,
      },
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: data?.requirements || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            新建需求
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" />
            导入CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            导出CSV
          </Button>
        </div>
      </div>

      {/* 过滤器 */}
      <div className="bg-surface p-4 rounded-lg border border-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">状态</label>
            <div className="flex flex-wrap gap-2">
              {["收集", "待评估", "验证中", "已验证-待启动", "搁置", "归档"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={filters.status.includes(status) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        status: prev.status.includes(status)
                          ? prev.status.filter((s) => s !== status)
                          : [...prev.status, status],
                      }));
                    }}
                  >
                    {status}
                  </Button>
                )
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">技术可行性</label>
            <div className="flex flex-wrap gap-2">
              {["高", "中", "低"].map((feasibility) => (
                <Button
                  key={feasibility}
                  variant={
                    filters.feasibility.includes(feasibility) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      feasibility: prev.feasibility.includes(feasibility)
                        ? prev.feasibility.filter((f) => f !== feasibility)
                        : [...prev.feasibility, feasibility],
                    }));
                  }}
                >
                  {feasibility}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">搜索</label>
            <Input
              placeholder="搜索需求..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-surface rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-interactive-hover transition-opacity duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {data?.total || 0} 条，第 {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()} 页
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}

