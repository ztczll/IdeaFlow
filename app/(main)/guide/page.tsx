export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-h1 font-display mb-8">操作指南</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左侧目录 */}
        <div className="md:col-span-1">
          <nav className="sticky top-20 space-y-2">
            <a
              href="#workflow"
              className="block px-3 py-2 rounded-md hover:bg-interactive-hover text-sm"
            >
              流程图
            </a>
            <a
              href="#quickstart"
              className="block px-3 py-2 rounded-md hover:bg-interactive-hover text-sm"
            >
              快速上手
            </a>
            <a
              href="#fields"
              className="block px-3 py-2 rounded-md hover:bg-interactive-hover text-sm"
            >
              字段说明
            </a>
            <a
              href="#shortcuts"
              className="block px-3 py-2 rounded-md hover:bg-interactive-hover text-sm"
            >
              快捷键
            </a>
            <a
              href="#faq"
              className="block px-3 py-2 rounded-md hover:bg-interactive-hover text-sm"
            >
              常见问题
            </a>
          </nav>
        </div>

        {/* 右侧内容 */}
        <div className="md:col-span-3 space-y-8">
          <section id="workflow" className="scroll-mt-20">
            <h2 className="text-h2 font-display mb-4">流程图</h2>
            <div className="bg-surface p-6 rounded-lg border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-status-collect/20 flex items-center justify-center text-status-collect font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">快速捕获</h3>
                    <p className="text-sm text-muted-foreground">
                      点击顶部「+ 快速捕获」按钮，填写需求描述和灵感来源
                    </p>
                  </div>
                </div>
                <div className="ml-6 border-l-2 border-border pl-4">
                  <div className="text-muted-foreground text-sm">↓</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-status-pending/20 flex items-center justify-center text-status-pending font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">每周整理</h3>
                    <p className="text-sm text-muted-foreground">
                      筛选「收集」状态，逐条补全字段，改为「待评估」
                    </p>
                  </div>
                </div>
                <div className="ml-6 border-l-2 border-border pl-4">
                  <div className="text-muted-foreground text-sm">↓</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-status-verifying/20 flex items-center justify-center text-status-verifying font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">双周验证</h3>
                    <p className="text-sm text-muted-foreground">
                      查看仪表盘，按「下一步行动」安排访谈或调研
                    </p>
                  </div>
                </div>
                <div className="ml-6 border-l-2 border-border pl-4">
                  <div className="text-muted-foreground text-sm">↓</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-status-verified/20 flex items-center justify-center text-status-verified font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">持续复盘</h3>
                    <p className="text-sm text-muted-foreground">
                      查看高价值TOP5，决定启动或搁置，归档已落地需求
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="quickstart" className="scroll-mt-20">
            <h2 className="text-h2 font-display mb-4">快速上手</h2>
            <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
              <div>
                <h3 className="font-semibold mb-2">首次访问</h3>
                <p className="text-sm text-muted-foreground">
                  打开应用 → 浏览「操作指南」30秒 → 点击「开始」进入主表
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">日常捕获</h3>
                <p className="text-sm text-muted-foreground">
                  任何时刻点击顶部「+ 快速捕获」→ 弹窗填写「为谁在什么场景解决什么问题」→
                  保存后生成一条「收集」状态记录
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">每周整理</h3>
                <p className="text-sm text-muted-foreground">
                  打开主表 → 筛选「收集」状态 → 逐条补全字段 → 把状态改为「待评估」
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">双周验证</h3>
                <p className="text-sm text-muted-foreground">
                  打开仪表盘 → 查看「待评估 / 验证中」数量 → 点击数字直接跳转到已筛选主表
                  → 按「下一步行动」列安排访谈或调研 → 更新状态与结论
                </p>
              </div>
            </div>
          </section>

          <section id="fields" className="scroll-mt-20">
            <h2 className="text-h2 font-display mb-4">字段说明</h2>
            <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
              <div>
                <h3 className="font-semibold mb-2">需求描述</h3>
                <p className="text-sm text-muted-foreground">
                  核心展示列，固定句式：为谁在什么场景解决什么问题。最多140字。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">问题/痛点</h3>
                <p className="text-sm text-muted-foreground">
                  详细描述当前存在的问题和痛点。最多500字，折叠展示。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">业务/场景价值</h3>
                <p className="text-sm text-muted-foreground">
                  说明该需求带来的业务价值和场景价值。最多500字，折叠展示。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">关联用户/角色</h3>
                <p className="text-sm text-muted-foreground">
                  支持多选，可从预设角色中选择或自定义。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">技术可行性初判</h3>
                <p className="text-sm text-muted-foreground">
                  高/中/低三个等级，用颜色标签区分。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">状态</h3>
                <p className="text-sm text-muted-foreground">
                  收集 → 待评估 → 验证中 → 已验证-待启动 → 归档。支持搁置状态。
                </p>
              </div>
            </div>
          </section>

          <section id="shortcuts" className="scroll-mt-20">
            <h2 className="text-h2 font-display mb-4">快捷键</h2>
            <div className="bg-surface p-6 rounded-lg border border-border">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">快速捕获</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Ctrl + K
                  </kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">搜索</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Ctrl + F
                  </kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">保存</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Ctrl + S
                  </kbd>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="scroll-mt-20">
            <h2 className="text-h2 font-display mb-4">常见问题</h2>
            <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
              <div>
                <h3 className="font-semibold mb-2">如何修改需求状态？</h3>
                <p className="text-sm text-muted-foreground">
                  在主表中点击状态标签，选择允许的状态进行转换。系统会根据状态流转规则进行验证。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">如何导出数据？</h3>
                <p className="text-sm text-muted-foreground">
                  在主表工具栏点击「导出CSV」按钮，即可下载当前筛选结果。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">团队数据如何共享？</h3>
                <p className="text-sm text-muted-foreground">
                  团队成员创建的需求会自动共享给团队所有成员，可在设置中管理团队。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

