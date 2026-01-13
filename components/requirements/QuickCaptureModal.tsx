"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QuickCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCaptureModal({
  open,
  onOpenChange,
}: QuickCaptureModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [loading, setLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: { description: string; inspiration?: string }) => {
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "创建失败");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
      setDescription("");
      setInspiration("");
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      await createMutation.mutateAsync({
        description: description.trim(),
        inspiration: inspiration.trim() || undefined,
      });
    } catch (error) {
      console.error("创建需求失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[480px]">
        <DialogHeader>
          <DialogTitle>快速捕获需求</DialogTitle>
          <DialogDescription>
            为谁在什么场景解决什么问题
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">需求描述 *</Label>
              <Input
                id="description"
                placeholder="例如：为数据分析师在生成周报时解决"手工拼接图表耗时"的问题"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={140}
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/140
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspiration">灵感来源</Label>
              <Input
                id="inspiration"
                placeholder="例如：2024-02-28 团队例会"
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                maxLength={140}
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                {inspiration.length}/140
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading || !description.trim()}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

