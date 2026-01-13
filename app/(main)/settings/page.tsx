"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Download, Upload } from "lucide-react";
import { DEFAULT_ROLES } from "@/types";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [newRole, setNewRole] = useState("");
  const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES);

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const handleDeleteRole = (role: string) => {
    setRoles(roles.filter((r) => r !== role));
  };

  const handleExport = () => {
    const data = {
      roles,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ideaflow-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.roles && Array.isArray(data.roles)) {
          setRoles(data.roles);
          alert("导入成功！");
        }
      } catch (error) {
        alert("导入失败：文件格式错误");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-h1 font-display">设置</h1>

      {/* 自定义角色词库 */}
      <Card>
        <CardHeader>
          <CardTitle>自定义角色词库</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入新角色名称"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddRole();
                }
              }}
            />
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <div
                key={role}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md"
              >
                <span className="text-sm">{role}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleDeleteRole(role)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 备份与恢复 */}
      <Card>
        <CardHeader>
          <CardTitle>备份与恢复</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出 JSON
            </Button>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("import-file")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                导入 JSON
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            导出当前角色词库配置，或从备份文件恢复
          </p>
        </CardContent>
      </Card>

      {/* 快捷键开关 */}
      <Card>
        <CardHeader>
          <CardTitle>快捷键设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>启用快捷键</Label>
              <p className="text-sm text-muted-foreground">
                启用后可以使用键盘快捷键快速操作
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

