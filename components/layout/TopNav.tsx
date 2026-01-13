"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Plus, BarChart3, BookOpen, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickCaptureModal } from "@/components/requirements/QuickCaptureModal";
import { useRouter } from "next/navigation";

export function TopNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 h-12 bg-surface border-b border-border flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          {/* 左侧：Logo + 快速捕获 */}
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-h3 text-primary">
              IdeaFlow
            </Link>
            <Button
              onClick={() => setShowQuickCapture(true)}
              size="sm"
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              快速捕获
            </Button>
          </div>

          {/* 右侧：导航 + 搜索 */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                仪表盘
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-1" />
                操作指南
              </Button>
            </Link>
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="搜索需求..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 h-8"
              />
              <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {session && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                退出
              </Button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      {showMobileMenu && (
        <div className="md:hidden bg-surface border-b border-border p-4 space-y-2">
          <Link href="/dashboard" onClick={() => setShowMobileMenu(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              仪表盘
            </Button>
          </Link>
          <Link href="/guide" onClick={() => setShowMobileMenu(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              操作指南
            </Button>
          </Link>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="搜索需求..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          {session && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                signOut({ callbackUrl: "/login" });
                setShowMobileMenu(false);
              }}
            >
              退出
            </Button>
          )}
        </div>
      )}

      <QuickCaptureModal
        open={showQuickCapture}
        onOpenChange={setShowQuickCapture}
      />
    </>
  );
}

