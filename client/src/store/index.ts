import { create } from 'zustand';
import type { DataSource, Message, GeneratedContent, RightPanelMode, DataDetail } from '../types';
import * as api from '../services/api';

// Re-export metrics store
export { useMetricsStore } from './metricsStore';

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

// Context Store - manages files added to chat context
interface ContextState {
  contextFileIds: string[];
  contextType: 'summary' | 'full';

  addToContext: (fileId: string) => void;
  removeFromContext: (fileId: string) => void;
  clearContext: () => void;
  setContextType: (type: 'summary' | 'full') => void;
  replaceContext: (fileIds: string[]) => void;
}

export const useContextStore = create<ContextState>((set) => ({
  contextFileIds: [],
  contextType: 'summary',

  addToContext: (fileId) =>
    set((state) => ({
      contextFileIds: state.contextFileIds.includes(fileId)
        ? state.contextFileIds
        : [...state.contextFileIds, fileId],
    })),

  removeFromContext: (fileId) =>
    set((state) => ({
      contextFileIds: state.contextFileIds.filter((id) => id !== fileId),
    })),

  clearContext: () => set({ contextFileIds: [] }),

  setContextType: (type) => set({ contextType: type }),

  replaceContext: (fileIds) => set({ contextFileIds: fileIds }),
}));

// Chat Store
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  sessionName: string;
  isModified: boolean;

  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setInputValue: (value: string) => void;
  sendMessage: (content: string, contextFileIds: string[], contextType: 'summary' | 'full') => void;
  clearChat: () => void;
  setSessionName: (name: string) => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: mockMessages,
  isLoading: false,
  inputValue: '',
  sessionName: '',
  isModified: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      isModified: true,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setInputValue: (value) => set({ inputValue: value }),
  setSessionName: (name) => set({ sessionName: name }),
  setMessages: (messages) => set({ messages, isModified: false }),

  sendMessage: async (content, contextFileIds, contextType) => {
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
      isModified: true,
    }));

    try {
      // Call real API
      const response = await api.sendChatMessage(content, contextFileIds, contextType);

      const assistantMessage: Message = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        contentType: 'mixed',
        timestamp: new Date(response.timestamp),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessage: Message = {
        id: `m${Date.now() + 1}`,
        role: 'assistant',
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}`,
        contentType: 'text',
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
      }));
    }
  },

  clearChat: () =>
    set({
      messages: [
        {
          id: 'm1',
          role: 'assistant',
          content:
            '欢迎使用 Enterprise NotebookLM！我可以帮助您分析数据、生成报告和获取洞察。\n\n请从左侧选择数据源，然后告诉我您想了解什么。',
          contentType: 'text',
          timestamp: new Date(),
        },
      ],
      isModified: false,
      sessionName: '',
    }),
}));

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
