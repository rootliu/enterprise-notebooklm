# Enterprise NotebookLM for ERP

企业级智能 BI 助手平台，面向企业管理人员的ERP数据分析与报告生成服务。

## 主要功能

### 数据源管理（左侧面板）

#### 三大数据源Tab
| Tab | 说明 |
|-----|------|
| **Query** | 数据库定制、指标体系浏览、集成记录 |
| **IM** | 飞书、企业微信、邮件（微信合并消息形式） |
| **离线** | 上传文件（CSV, Excel, PDF等） |

#### 指标体系
- 标准报表（财务、应收、应付、库存等）
- KPI指标（营收增长率、毛利率等）
- 预测报表（销售预测、现金流预测）
- 点击指标显示：描述、数据来源、可增强方向

### 多源数据集成（核心功能）
1. 选择多个数据源（报表/IM/文件）
2. 点击「集成」按钮
3. Agent自动分析列和行值
4. 生成集成报表（表格+图表+标签）
5. 用户可讨论修改后确认保存

### 智能分析工具
| 工具 | 功能 | 状态 |
|------|------|------|
| 预测 | 时间序列预测 | 选中数据时高亮 |
| 拟合 | 曲线拟合分析 | 选中数据时高亮 |
| 分类 | 数据分类 | 选中数据时高亮 |
| 特征 | 特征提取 | 选中数据时高亮 |

### 内容生成（Studio面板）
- 📄 报告（Report）- Markdown/PDF
- 📋 简报（Brief）- 单页PDF
- 🎬 演示文稿（PPT）
- 📤 数据导出（CSV/Excel）

## 界面截图

### 主界面
三栏布局设计，Dark Mode风格：

![主界面](docs/screenshots/Screenshot%202026-01-07%20at%2016.01.15.png)

| 区域 | 功能 |
|------|------|
| **左侧面板** | 数据源管理（Query/IM/离线），方形Tab按钮 |
| **中间面板** | AI对话、集成报表展示、分析图表 |
| **右侧面板（Studio）** | 内容生成工具、工作交付件管理 |

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | 样式框架 |
| Zustand | 4.x | 状态管理 |
| Lucide React | - | 图标库 |

### 后端（规划中）
- Node.js + Express
- Google Gemini API
- PostgreSQL/MySQL连接器

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/rootliu/enterprise-notebooklm.git
cd enterprise-notebooklm

# 安装依赖
npm install
cd client && npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 http://localhost:5173

## 项目结构

```
enterprise-notebooklm/
├── client/                     # React前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/         # 布局组件
│   │   │   ├── DataPanel/      # 数据源面板
│   │   │   │   ├── QueryTab.tsx    # Query子Tab
│   │   │   │   ├── IMTab.tsx       # IM消息
│   │   │   │   └── OfflineTab.tsx  # 离线文件
│   │   │   ├── ChatPanel/      # AI对话面板
│   │   │   │   ├── IntegrationReportView.tsx  # 集成报表
│   │   │   │   └── InputArea.tsx   # 输入区域
│   │   │   └── StudioPanel/    # Studio工具面板
│   │   ├── store/
│   │   │   └── metricsStore.ts # 指标状态管理
│   │   └── types/
├── server/                     # Express后端（规划中）
├── docs/
│   ├── REQUIREMENTS.md         # 需求文档v2.0
│   ├── UI_DESIGN.md            # UI设计规范
│   └── screenshots/            # 截图
└── package.json
```

## 开发进度

### Phase 1: UI原型 ✅
- [x] Dark Mode UI重构
- [x] 方形Tab按钮样式
- [x] Query三分类（DB/指标/集成记录）
- [x] 指标详情面板
- [x] IM合并消息形式
- [x] 离线文件摘要+标签
- [x] 集成报表展示
- [x] 工具栏动态高亮
- [x] 交付件管理

### Phase 2: 集成功能
- [ ] 多源数据选择
- [ ] Agent智能集成
- [ ] 自动标签生成
- [ ] 自动图表生成

### Phase 3: 分析工具
- [ ] 预测功能实现
- [ ] 拟合功能实现
- [ ] 分类功能实现
- [ ] 特征提取实现

## 许可证

MIT License

## 作者

[rootliu](https://github.com/rootliu)
