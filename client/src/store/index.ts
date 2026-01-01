import { create } from 'zustand';
import type { DataSource, Message, GeneratedContent, RightPanelMode, DataDetail } from '../types';

// Mock data for prototype
const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'sales_2024.csv',
    type: 'file',
    format: 'csv',
    summary: '2024年销售数据，包含月度销售额、地区分布、产品类别等信息。数据涵盖5个产品线，覆盖全国6大区域。',
    tags: [
      { id: 't1', name: 'revenue', type: 'metric' },
      { id: 't2', name: 'region', type: 'dimension' },
      { id: 't3', name: 'product', type: 'dimension' },
    ],
    rowCount: 1234,
    columnCount: 12,
    fileSize: '2.3 MB',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'connected',
  },
  {
    id: '2',
    name: 'customer_db',
    type: 'database',
    format: 'postgresql',
    summary: '客户关系管理数据库，包含客户信息、订单历史、偏好设置等。支持客户细分和生命周期分析。',
    tags: [
      { id: 't4', name: 'customer_id', type: 'column' },
      { id: 't5', name: 'lifetime_value', type: 'metric' },
      { id: 't6', name: 'segment', type: 'dimension' },
    ],
    rowCount: 5678,
    columnCount: 24,
    lastUpdated: new Date(),
    status: 'connected',
  },
  {
    id: '3',
    name: 'Q3_report.pdf',
    type: 'file',
    format: 'pdf',
    summary: '2024年第三季度财务报告，包含收入分析、成本结构、利润趋势和管理层讨论。',
    tags: [
      { id: 't7', name: 'Q3', type: 'custom' },
      { id: 't8', name: 'finance', type: 'custom' },
    ],
    fileSize: '4.5 MB',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'connected',
  },
  {
    id: '4',
    name: '证监会财报',
    type: 'web',
    format: 'api',
    summary: '从证监会官网获取的上市公司财务报表数据，包含资产负债表、利润表和现金流量表。',
    tags: [
      { id: 't9', name: 'financial', type: 'custom' },
      { id: 't10', name: 'regulatory', type: 'custom' },
    ],
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'connected',
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: '欢迎使用 Enterprise NotebookLM！我可以帮助您分析数据、生成报告和获取洞察。\n\n请从左侧选择数据源，然后告诉我您想了解什么。',
    contentType: 'text',
    timestamp: new Date(Date.now() - 60000),
  },
];

const mockGeneratedContent: GeneratedContent[] = [
  {
    id: 'g1',
    type: 'report',
    name: 'Q3_Analysis_Report.md',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'g2',
    type: 'brief',
    name: 'Sales_Overview_Brief.pdf',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'g3',
    type: 'csv',
    name: 'Monthly_Summary.csv',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Data Source Store
interface DataSourceState {
  dataSources: DataSource[];
  selectedIds: string[];
  currentDetailId: string | null;
  viewMode: 'list' | 'detail';
  searchQuery: string;
  sortBy: 'time' | 'type' | 'name';

  addDataSource: (source: DataSource) => void;
  removeDataSource: (id: string) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  setCurrentDetail: (id: string | null) => void;
  setViewMode: (mode: 'list' | 'detail') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'time' | 'type' | 'name') => void;
}

export const useDataSourceStore = create<DataSourceState>((set) => ({
  dataSources: mockDataSources,
  selectedIds: [],
  currentDetailId: null,
  viewMode: 'list',
  searchQuery: '',
  sortBy: 'time',

  addDataSource: (source) => set((state) => ({
    dataSources: [...state.dataSources, source]
  })),
  removeDataSource: (id) => set((state) => ({
    dataSources: state.dataSources.filter(s => s.id !== id),
    selectedIds: state.selectedIds.filter(sid => sid !== id),
  })),
  toggleSelection: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds.filter(sid => sid !== id)
      : [...state.selectedIds, id],
  })),
  clearSelection: () => set({ selectedIds: [] }),
  setCurrentDetail: (id) => set({ currentDetailId: id, viewMode: id ? 'detail' : 'list' }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
}));

// Chat Store
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;

  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setInputValue: (value: string) => void;
  sendMessage: (content: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: mockMessages,
  isLoading: false,
  inputValue: '',

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setInputValue: (value) => set({ inputValue: value }),
  sendMessage: (content) => {
    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: 'user',
      content,
      contentType: 'text',
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      inputValue: '',
      isLoading: true,
    }));

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `m${Date.now() + 1}`,
        role: 'assistant',
        content: generateMockResponse(content),
        contentType: 'mixed',
        citations: [
          {
            dataSourceId: '1',
            dataSourceName: 'sales_2024.csv',
            location: { rowStart: 1, rowEnd: 100, columns: ['revenue', 'region'] },
            preview: '销售数据摘要',
          },
        ],
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    }, 1500);
  },
  clearChat: () => set({ messages: mockMessages }),
}));

function generateMockResponse(query: string): string {
  if (query.includes('销售') || query.includes('revenue')) {
    return `根据 **sales_2024.csv** 的数据分析，我发现以下关键洞察：

## 销售额概览

| 地区 | 销售额 | 占比 | 同比增长 |
|------|--------|------|----------|
| 华东 | ¥2,345,678 | 35% | +12% |
| 华南 | ¥1,876,543 | 28% | +8% |
| 华北 | ¥1,234,567 | 18% | +15% |
| 西南 | ¥876,543 | 13% | +5% |
| 其他 | ¥432,100 | 6% | -2% |

### 关键发现

1. **华东地区表现最强**：贡献了35%的总销售额，且保持12%的稳定增长
2. **华北增长最快**：虽然占比较小，但同比增长达15%
3. **其他地区需要关注**：出现了2%的负增长，建议进一步分析原因

*数据来源：[sales_2024.csv:L1-1234]*`;
  }

  if (query.includes('客户') || query.includes('customer')) {
    return `基于 **customer_db** 的分析结果：

## 客户细分分析

根据客户生命周期价值(LTV)和活跃度，我们将客户分为以下几类：

- **高价值客户** (15%): 平均LTV ¥50,000+，复购率 85%
- **成长型客户** (25%): 平均LTV ¥15,000-50,000，具有提升潜力
- **普通客户** (45%): 平均LTV ¥5,000-15,000，需要激活策略
- **流失风险客户** (15%): 90天内无交互，需要挽回措施

### 建议行动

1. 对高价值客户提供专属服务和VIP权益
2. 针对成长型客户设计升级激励计划
3. 对流失风险客户启动召回活动

*数据来源：[customer_db]*`;
  }

  return `我已收到您的问题。基于当前选中的数据源，我可以提供以下分析：

您的查询涉及到数据分析，请确保已选择相关的数据源。您可以：

1. 在左侧面板选择一个或多个数据源
2. 点击数据源查看详细信息和可用标签
3. 使用标签快速构建查询

有什么具体的数据分析需求吗？例如：
- "统计各地区的销售额"
- "分析客户流失原因"
- "预测下季度趋势"`;
}

// UI Store
interface UIState {
  rightPanelMode: RightPanelMode;
  dataDetail: DataDetail | null;
  activeModal: string | null;
  activeTool: string | null;

  setRightPanelMode: (mode: RightPanelMode) => void;
  setDataDetail: (detail: DataDetail | null) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setActiveTool: (toolId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelMode: 'tools',
  dataDetail: null,
  activeModal: null,
  activeTool: null,

  setRightPanelMode: (mode) => set({ rightPanelMode: mode }),
  setDataDetail: (detail) => set({
    dataDetail: detail,
    rightPanelMode: detail ? 'detail' : 'tools',
  }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setActiveTool: (toolId) => set({ activeTool: toolId }),
}));

// Generated Content Store
interface GeneratedContentState {
  contents: GeneratedContent[];

  addContent: (content: GeneratedContent) => void;
  removeContent: (id: string) => void;
}

export const useGeneratedContentStore = create<GeneratedContentState>((set) => ({
  contents: mockGeneratedContent,

  addContent: (content) => set((state) => ({
    contents: [content, ...state.contents],
  })),
  removeContent: (id) => set((state) => ({
    contents: state.contents.filter(c => c.id !== id),
  })),
}));
