# Enterprise NotebookLM for ERP - UI/UX 设计规范

## 1. 设计原则

### 1.1 核心理念
- **清晰**: 信息层次分明，操作直观
- **高效**: 减少点击次数，支持键盘快捷键
- **专业**: 企业级视觉风格，数据密度适中
- **一致**: 统一的交互模式和视觉语言

### 1.2 设计约束
- 最小支持宽度: 1280px
- **深色模式 (Dark Mode)** 为主题
- 桌面端优先

---

## 2. 色彩系统 (Dark Mode)

### 2.1 背景色
```css
/* Dark Backgrounds */
--bg-primary:   #0f0f0f;   /* 主背景 */
--bg-secondary: #1a1a1a;   /* 面板背景 */
--bg-tertiary:  #242424;   /* 卡片背景 */
--bg-elevated:  #2a2a2a;   /* 悬浮/弹窗背景 */
--bg-hover:     #333333;   /* 悬停状态 */
--bg-active:    #3d3d3d;   /* 激活状态 */
```

### 2.2 文字色
```css
/* Text Colors */
--text-primary:   #ffffff;   /* 主要文字 */
--text-secondary: #a0a0a0;   /* 次要文字 */
--text-tertiary:  #6b6b6b;   /* 辅助文字 */
--text-disabled:  #4a4a4a;   /* 禁用文字 */
```

### 2.3 边框色
```css
/* Border Colors */
--border-primary:   #2a2a2a;   /* 主边框 */
--border-secondary: #3d3d3d;   /* 次边框 */
--border-focus:     #3b82f6;   /* 聚焦边框 */
```

### 2.4 强调色
```css
/* Accent Colors */
--accent-blue:    #3b82f6;   /* 主强调色 */
--accent-green:   #10b981;   /* 成功/确认 */
--accent-orange:  #f59e0b;   /* 警告 */
--accent-red:     #ef4444;   /* 错误/危险 */
--accent-purple:  #8b5cf6;   /* 次强调色 */
--accent-cyan:    #06b6d4;   /* 信息 */
--accent-pink:    #ec4899;   /* 特殊 */
```

### 2.5 数据源类型色彩
```css
/* 用于区分不同类型数据源的标识色 */
--type-metrics:   #3b82f6;   /* 指标体系 - 蓝色 */
--type-im:        #8b5cf6;   /* IM 数据 - 紫色 */
--type-offline:   #f59e0b;   /* 离线数据 - 橙色 */
--type-query:     #06b6d4;   /* 预定义查询 - 青色 */
--type-external:  #6b7280;   /* 外部数据 - 灰色 */
```

---

## 3. 字体系统

### 3.1 字体族
```css
/* 主要字体 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 代码字体 */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### 3.2 字体大小
```css
--text-xs:   12px;  /* 辅助文字、标签 */
--text-sm:   14px;  /* 次要内容 */
--text-base: 16px;  /* 正文 */
--text-lg:   18px;  /* 小标题 */
--text-xl:   20px;  /* 标题 */
--text-2xl:  24px;  /* 大标题 */
--text-3xl:  30px;  /* 页面标题 */
```

---

## 4. 间距与圆角

### 4.1 基础间距 (4px 基数)
```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
```

### 4.2 圆角
```css
--radius-sm:   4px;
--radius-md:   6px;
--radius-lg:   8px;
--radius-xl:   12px;
--radius-full: 9999px;
```

### 4.3 阴影 (Dark Mode)
```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.3);
--shadow-md:  0 4px 6px rgba(0,0,0,0.4);
--shadow-lg:  0 10px 15px rgba(0,0,0,0.5);
--shadow-xl:  0 20px 25px rgba(0,0,0,0.6);
```

---

## 5. 整体布局

### 5.1 页面结构
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Header (56px)                                            [Model ▼] [👤] │
├───────────────┬─────────────────────────────────┬───────────────────────┤
│               │                                 │                       │
│  Left Panel   │        Center Panel             │    Right Panel        │
│  DATA SOURCES │        CHAT AGENT               │    STUDIO             │
│  (300px)      │        (flex: 1)                │    (320px)            │
│               │                                 │                       │
│  📊 指标体系   │                                 │    Report             │
│  💬 IM 数据   │                                 │    Brief              │
│  📁 离线数据  │                                 │    PPT                │
│  🔗 预定义    │                                 │    Export             │
│               │                                 │                       │
├───────────────┴─────────────────────────────────┴───────────────────────┤
│ Status Bar (32px)                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 面板尺寸约束
```typescript
const PANEL_CONSTRAINTS = {
  left: {
    minWidth: 280,
    defaultWidth: 300,
    maxWidth: 400,
  },
  right: {
    minWidth: 280,
    defaultWidth: 320,
    maxWidth: 400,
  },
  center: {
    minWidth: 500,
  },
};
```

---

## 6. Header 设计

### 6.1 布局
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [🏢] Enterprise NotebookLM for ERP           [Model: Gemini ▼] [⚙️] [👤] │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 模型选择器
```
┌─────────────────────────────┐
│  Model: Gemini           ▼  │
├─────────────────────────────┤
│  ● Gemini  (Google)         │
│  ○ Claude  (Anthropic)      │
│  ○ GPT     (OpenAI)         │
│  ○ DeepSeek                 │
│  ○ Qwen    (阿里云)          │
│  ○ GLM     (智谱)            │
└─────────────────────────────┘
```

### 6.3 样式规范
```css
.header {
  height: 56px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.model-selector {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
}
```

---

## 7. 左侧栏 - 数据源面板

### 7.1 数据源分类结构
```
┌──────────────────────────────┐
│  DATA SOURCES                │
│  ─────────────────────────── │
│  [🔍 Search...          ]    │
│                              │
│  📊 指标体系              ▼  │
│  ├─ 标准报表                 │
│  │  ├─ 财务报表              │
│  │  │  ├─ 损益表 (vs 上期)   │
│  │  │  ├─ 资产负债表         │
│  │  │  └─ 合并报表           │
│  │  ├─ 应收/销售报表         │
│  │  ├─ 应付/采购报表         │
│  │  ├─ 库存报表              │
│  │  ├─ CRM 报表              │
│  │  ├─ 生产制造报表          │
│  │  └─ 时间与费用            │
│  ├─ KPI 指标                 │
│  │  ├─ 财务类 KPI            │
│  │  ├─ 销售与预测类          │
│  │  ├─ 库存与供应链          │
│  │  └─ 客户服务类            │
│  ├─ 预测报表                 │
│  │  ├─ 销售预测              │
│  │  ├─ 财务预测              │
│  │  └─ 需求预测              │
│  └─ 分析洞察                 │
│     ├─ 盈利性分析            │
│     ├─ 流动性分析            │
│     └─ 审计合规              │
│                              │
│  💬 IM 数据               ▼  │
│  ├─ 飞书                     │
│  ├─ 企业微信                 │
│  └─ 邮件                     │
│                              │
│  📁 离线数据              ▼  │
│  ├─ sales_2024.csv           │
│  ├─ Q3_report.pdf            │
│  └─ [+ 上传文件]             │
│                              │
│  🔗 预定义 Query          ▼  │
│  ├─ 月度销售汇总             │
│  └─ 客户分析模板             │
│                              │
└──────────────────────────────┘
```

### 7.2 指标体系树形组件
```css
.metrics-tree {
  padding: var(--space-2);
}

.metrics-tree-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.metrics-tree-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.metrics-tree-item.selected {
  background: var(--accent-blue);
  color: white;
}

.metrics-tree-item.expanded > .metrics-tree-icon {
  transform: rotate(90deg);
}

.metrics-tree-icon {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  transition: transform 0.15s;
}

.metrics-tree-label {
  flex: 1;
  font-size: var(--text-sm);
}

.metrics-tree-children {
  margin-left: var(--space-6);
  border-left: 1px solid var(--border-primary);
}
```

### 7.3 数据源分类标题
```css
.data-category {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background 0.15s;
}

.data-category:hover {
  background: var(--bg-hover);
}

.data-category-icon {
  font-size: 16px;
}

.data-category-icon.metrics { color: var(--type-metrics); }
.data-category-icon.im { color: var(--type-im); }
.data-category-icon.offline { color: var(--type-offline); }
.data-category-icon.query { color: var(--type-query); }

.data-category-label {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.data-category-chevron {
  color: var(--text-tertiary);
  transition: transform 0.15s;
}

.data-category.expanded .data-category-chevron {
  transform: rotate(180deg);
}
```

---

## 8. 中间栏 - 对话面板

### 8.1 整体布局
```
┌─────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────┐ │
│  │           Message List Area               │ │
│  │           (scrollable)                    │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ You                                  │ │ │
│  │  │ 展示本季度各产品线的销售趋势          │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ Assistant                           │ │ │
│  │  │ 根据 ERP 系统数据分析...            │ │ │
│  │  │ [Chart: Line Chart]                 │ │ │
│  │  │ [Citation: 销售报表 > Q3数据]       │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Active: [损益表] [客户账龄表]  [+ Add]   │ │
│  ├───────────────────────────────────────────┤ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ Ask a question about your data...    │ │ │
│  │  │                                  [➤] │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  │                                           │ │
│  │  [📎][🔗][📈][📉][🏷️][✨]                │ │
│  │  Upload Link Predict Fit Classify Extract │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 8.2 工具栏设计 (底部)
```
┌─────────────────────────────────────────────────┐
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │  📎  │ │  🔗  │ │  📈  │ │  📉  │ │  🏷️  │ │  ✨  │ │
│  │Upload│ │ Link │ │Predict│ │ Fit  │ │Classify│ │Extract│ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
└─────────────────────────────────────────────────┘
```

### 8.3 工具栏样式
```css
.chat-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

.chat-tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 56px;
}

.chat-tool-button:hover {
  background: var(--bg-hover);
}

.chat-tool-button.active {
  background: var(--accent-blue);
  color: white;
}

.chat-tool-icon {
  font-size: 18px;
  color: var(--text-secondary);
}

.chat-tool-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

.chat-tool-button:hover .chat-tool-icon,
.chat-tool-button:hover .chat-tool-label {
  color: var(--text-primary);
}
```

### 8.4 消息气泡设计 (Dark Mode)
```css
/* 用户消息 */
.message-user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.message-user-content {
  max-width: 80%;
  padding: var(--space-3) var(--space-4);
  background: var(--accent-blue);
  color: white;
  border-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-sm);
}

/* Assistant 消息 */
.message-assistant {
  display: flex;
  margin-bottom: var(--space-4);
}

.message-assistant-content {
  max-width: 90%;
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-sm);
  color: var(--text-primary);
}
```

---

## 9. 右侧栏 - Studio 面板

### 9.1 布局设计 (简化版)
```
┌──────────────────────────────────────┐
│  STUDIO                        [⚙️]  │
├──────────────────────────────────────┤
│                                      │
│  ── Content Generation ───────────   │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ 📄 Report      Generate detailed ││
│  │                insights report   ││
│  └─────────────────────────────────┘│
│                                      │
│  ┌─────────────────────────────────┐│
│  │ 📋 Brief       One-page summary ││
│  └─────────────────────────────────┘│
│                                      │
│  ┌─────────────────────────────────┐│
│  │ 🎬 PPT         Presentation     ││
│  └─────────────────────────────────┘│
│                                      │
│  ┌─────────────────────────────────┐│
│  │ ⬇️ Export      CSV/Excel        ││
│  └─────────────────────────────────┘│
│                                      │
├──────────────────────────────────────┤
│  GENERATED CONTENT                   │
│  ──────────────────────────────────  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 📄 Q3_Report.pdf             │   │
│  │    Report · 2h ago       [⋮] │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 📊 Sales_Brief.pdf           │   │
│  │    Brief · Yesterday     [⋮] │   │
│  └──────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│  [+ 插入到指标数据源]                 │
│  将生成的内容关联到指标体系            │
└──────────────────────────────────────┘
```

### 9.2 内容生成按钮样式
```css
.studio-button {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.studio-button:hover {
  border-color: var(--accent-blue);
  background: var(--bg-hover);
}

.studio-button-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  font-size: 18px;
}

.studio-button-info {
  flex: 1;
}

.studio-button-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.studio-button-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}
```

### 9.3 插入指标数据源功能
```
┌──────────────────────────────────────────────────┐
│  插入到指标数据源                           [×]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  选择要关联的指标分类:                            │
│                                                  │
│  📊 标准报表                                     │
│  ├─ ○ 财务报表                                   │
│  ├─ ○ 应收/销售报表                              │
│  ├─ ● 应付/采购报表  ← 选中                       │
│  └─ ○ 库存报表                                   │
│                                                  │
│  📈 KPI 指标                                     │
│  ├─ ○ 财务类 KPI                                 │
│  └─ ○ 销售与预测类                               │
│                                                  │
│  内容名称: [Q3采购分析报告___________]            │
│                                                  │
│  描述: [基于ERP数据生成的季度采购分析]            │
│                                                  │
│                        [取消]  [插入到指标体系]   │
└──────────────────────────────────────────────────┘
```

### 9.4 插入指标数据源样式
```css
.insert-metrics-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3);
  background: var(--bg-tertiary);
  border: 1px dashed var(--border-secondary);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.insert-metrics-button:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
  background: rgba(59, 130, 246, 0.1);
}

.insert-metrics-button-icon {
  font-size: 16px;
}
```

---

## 10. 状态栏设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ● Connected to ERP     │ Model: Gemini     │ Last sync: 2 min ago     │
└─────────────────────────────────────────────────────────────────────────┘
```

```css
.status-bar {
  height: 32px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-primary);
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.connected { background: var(--accent-green); }
.status-dot.disconnected { background: var(--accent-red); }
.status-dot.loading {
  background: var(--accent-orange);
  animation: pulse 1s infinite;
}
```

---

## 11. 通用组件规范 (Dark Mode)

### 11.1 按钮
```css
.btn-primary {
  background: var(--accent-blue);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: transparent;
  color: var(--accent-blue);
  border: 1px solid var(--accent-blue);
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.1);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
}

.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

### 11.2 输入框
```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: all 0.15s;
}

.input:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

### 11.3 标签/徽章
```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.tag.active {
  background: var(--accent-blue);
  color: white;
}
```

### 11.4 模态框
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-primary);
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}
```

---

## 12. 图标规范

### 12.1 数据源分类图标
| 分类 | 图标 (Lucide) | 颜色 |
|------|--------------|------|
| 指标体系 | BarChart3 | #3b82f6 |
| IM 数据 | MessageSquare | #8b5cf6 |
| 离线数据 | FolderOpen | #f59e0b |
| 预定义查询 | Link | #06b6d4 |

### 12.2 工具栏图标
| 工具 | 图标 (Lucide) | 说明 |
|------|--------------|------|
| 上传 | Paperclip | 文件上传 |
| Web Link | Link2 | URL 导入 |
| 预测 | TrendingUp | 时间序列预测 |
| 拟合 | Spline | 曲线拟合 |
| 分类 | Tag | 数据分类 |
| 特征提取 | Sparkles | 特征工程 |

### 12.3 内容生成图标
| 类型 | 图标 (Lucide) | 颜色 |
|------|--------------|------|
| Report | FileText | #3b82f6 |
| Brief | FileImage | #8b5cf6 |
| PPT | Presentation | #f59e0b |
| Export | Download | #6b7280 |

---

## 13. 动画规范

```css
/* 过渡时长 */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;

/* 缓动函数 */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 14. 键盘快捷键

| 快捷键 | 功能 |
|-------|------|
| `Cmd/Ctrl + K` | 打开搜索 |
| `Cmd/Ctrl + N` | 新建数据源 |
| `Cmd/Ctrl + Enter` | 发送消息 |
| `Cmd/Ctrl + 1` | 聚焦左侧栏 |
| `Cmd/Ctrl + 2` | 聚焦中间栏 |
| `Cmd/Ctrl + 3` | 聚焦右侧栏 |
| `Esc` | 关闭模态框/取消操作 |

---

## 15. 可访问性

- 所有交互元素支持键盘导航
- 颜色对比度符合 WCAG 2.1 AA 标准（Dark Mode 适配）
- 图标配合文字标签
- 表单元素有明确的标签和错误提示
- 支持屏幕阅读器
