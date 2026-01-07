import { create } from 'zustand';
import type { LLMModel } from '../types';

// Types
export interface MetricNode {
  id: string;
  name: string;
  nameCn: string;
  category: 'standard' | 'kpi' | 'forecast' | 'module' | 'insight';
  children?: MetricNode[];
  isLeaf?: boolean;
  description?: string;
  dataSource?: string;
  enhancements?: string[];
}

export interface IMMessage {
  id: string;
  sender: string;
  department: string;
  platform: 'feishu' | 'wecom' | 'email';
  summary: string;
  attachments: { name: string; type: string }[];
  timestamp: Date;
  tags: string[];
  fullContent?: string;
}

export interface OfflineFile {
  id: string;
  name: string;
  format: 'csv' | 'excel' | 'json' | 'pdf' | 'word' | 'image';
  size: string;
  uploadedAt: Date;
  summary?: string;
  tags: string[];
}

export interface IntegrationRecord {
  id: string;
  name: string;
  description: string;
  sources: { type: string; name: string }[];
  integrationMethod: string;
  createdBy: string;
  createdAt: Date;
  tags: string[];
}

export interface IntegrationReport {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sources: { id: string; type: string; name: string }[];
  tableData: { columns: string[]; rows: any[][] };
  chartConfig?: { title: string; data: number[]; labels: string[]; colors: string[] };
  createdAt: Date;
}

// Mock Data
const mockMetricsTree: MetricNode[] = [
  {
    id: 'standard',
    name: 'Standard Reports',
    nameCn: '标准报表',
    category: 'standard',
    children: [
      {
        id: 'finance',
        name: 'Financial Reports',
        nameCn: '财务报表',
        category: 'standard',
        children: [
          {
            id: 'balance-sheet',
            name: 'Balance Sheet',
            nameCn: '资产负债表',
            category: 'standard',
            isLeaf: true,
            description: '核心财务报表，展示企业资产、负债和股东权益的构成情况，反映企业在特定日期的财务状况。',
            dataSource: 'ERP > GL模块 > 财务报表',
            enhancements: ['添加同比/环比分析', '关联现金流量表', '生成趋势预测', '添加行业对标']
          },
          {
            id: 'income-statement',
            name: 'Income Statement',
            nameCn: '利润表',
            category: 'standard',
            isLeaf: true,
            description: '反映企业在一定会计期间经营成果的报表，包含收入、成本、费用和利润等关键指标。',
            dataSource: 'ERP > GL模块 > 财务报表',
            enhancements: ['按部门/产品线细分', '添加毛利率分析', '成本结构分析']
          },
          {
            id: 'cash-flow',
            name: 'Cash Flow Statement',
            nameCn: '现金流量表',
            category: 'standard',
            isLeaf: true,
            description: '反映企业在一定会计期间现金和现金等价物流入和流出的报表。',
            dataSource: 'ERP > GL模块 > 财务报表',
            enhancements: ['现金流预测', '营运资金分析', '流动性风险预警']
          },
        ],
      },
      {
        id: 'receivable',
        name: 'Accounts Receivable',
        nameCn: '应收报表',
        category: 'standard',
        children: [
          { id: 'ar-aging', name: 'AR Aging Report', nameCn: '应收账龄分析', category: 'standard', isLeaf: true,
            description: '按账龄区间分析应收账款分布，识别逾期风险。',
            dataSource: 'ERP > AR模块',
            enhancements: ['客户信用评级', '催收优先级排序', '坏账预测'] },
        ],
      },
      {
        id: 'inventory',
        name: 'Inventory',
        nameCn: '库存报表',
        category: 'standard',
        children: [
          { id: 'inv-valuation', name: 'Inventory Valuation', nameCn: '库存估值', category: 'standard', isLeaf: true,
            description: '按成本法计算库存价值，支持FIFO、LIFO、加权平均等方法。',
            dataSource: 'ERP > 库存模块',
            enhancements: ['库存周转分析', 'ABC分类', '呆滞库存预警'] },
        ],
      },
    ],
  },
  {
    id: 'kpi',
    name: 'KPI Indicators',
    nameCn: 'KPI指标',
    category: 'kpi',
    children: [
      { id: 'revenue-growth', name: 'Revenue Growth', nameCn: '营收增长率', category: 'kpi', isLeaf: true,
        description: '衡量企业收入增长速度的核心指标，同比/环比分析。',
        dataSource: 'ERP > 销售模块 + GL模块',
        enhancements: ['按产品线分解', '预测未来趋势', '行业对标'] },
      { id: 'gross-margin', name: 'Gross Margin', nameCn: '毛利率', category: 'kpi', isLeaf: true,
        description: '反映产品或服务的盈利能力，(收入-成本)/收入。',
        dataSource: 'ERP > GL模块',
        enhancements: ['按SKU分析', '成本结构分解', '定价优化建议'] },
      { id: 'dso', name: 'Days Sales Outstanding', nameCn: '应收账款周转天数', category: 'kpi', isLeaf: true,
        description: '衡量应收账款回收效率的指标，越低表示回款越快。',
        dataSource: 'ERP > AR模块',
        enhancements: ['客户分层分析', '改善建议', '趋势预测'] },
    ],
  },
  {
    id: 'forecast',
    name: 'Forecast Reports',
    nameCn: '预测报表',
    category: 'forecast',
    children: [
      { id: 'sales-forecast', name: 'Sales Forecast', nameCn: '销售预测', category: 'forecast', isLeaf: true,
        description: '基于历史数据和市场趋势预测未来销售额。',
        dataSource: 'ERP > 销售模块 + AI预测引擎',
        enhancements: ['多场景预测', '置信区间分析', '影响因素分解'] },
      { id: 'cash-forecast', name: 'Cash Flow Forecast', nameCn: '现金流预测', category: 'forecast', isLeaf: true,
        description: '预测未来现金流入流出，确保流动性安全。',
        dataSource: 'ERP > 财务模块 + AI预测引擎',
        enhancements: ['短期/中期预测', '风险场景模拟', '优化建议'] },
    ],
  },
];

const mockIMMessages: IMMessage[] = [
  {
    id: 'im-1',
    sender: '张三',
    department: '财务部',
    platform: 'feishu',
    summary: '关于Q3财务报表的审核意见，建议重点关注应收账款的账龄分布...',
    attachments: [{ name: 'Q3财报审核.xlsx', type: 'excel' }],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ['财务', 'Q3', '审核'],
    fullContent: '关于Q3财务报表的审核意见：\n1. 应收账款账龄超90天的占比偏高，建议加强催收\n2. 存货周转率下降，需关注库存管理\n3. 毛利率环比下降2个点，需分析原因'
  },
  {
    id: 'im-2',
    sender: '李四',
    department: '销售部',
    platform: 'wecom',
    summary: '华东区域Q3销售数据汇总，整体完成率达到115%...',
    attachments: [{ name: '华东销售数据.csv', type: 'csv' }, { name: '客户清单.xlsx', type: 'excel' }],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    tags: ['销售', '华东', 'Q3'],
    fullContent: '华东区域Q3销售数据汇总：\n- 总销售额：2,345万\n- 完成率：115%\n- 新客户：23家\n- 重点客户续约率：92%'
  },
  {
    id: 'im-3',
    sender: '王五',
    department: '供应链',
    platform: 'email',
    summary: '供应商绩效评估报告，本季度共评估了35家核心供应商...',
    attachments: [{ name: '供应商评估.pdf', type: 'pdf' }],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['供应链', '供应商', '评估'],
    fullContent: '供应商绩效评估报告摘要：\n- 评估供应商数量：35家\n- A级供应商：12家\n- 需改进：5家\n- 建议淘汰：2家'
  },
];

const mockOfflineFiles: OfflineFile[] = [
  {
    id: 'file-1',
    name: 'Q3_sales_data.xlsx',
    format: 'excel',
    size: '2.3 MB',
    uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    summary: '包含Q3季度各产品线的销售数据，涵盖华东、华南、华北等6大区域，共计1,234条销售记录。',
    tags: ['销售', 'Q3', '区域分析']
  },
  {
    id: 'file-2',
    name: 'customer_feedback.csv',
    format: 'csv',
    size: '856 KB',
    uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    summary: '客户满意度调查数据，包含NPS评分、产品反馈、服务评价等维度，共收集523份有效问卷。',
    tags: ['客户', '满意度', 'NPS']
  },
  {
    id: 'file-3',
    name: '市场分析报告.pdf',
    format: 'pdf',
    size: '4.5 MB',
    uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    summary: '2024年行业市场分析报告，包含市场规模、竞争格局、发展趋势等内容。',
    tags: ['市场', '行业分析', '趋势']
  },
];

const mockIntegrationRecords: IntegrationRecord[] = [
  {
    id: 'int-1',
    name: 'Q3财务销售综合分析',
    description: '整合Q3财务报表和销售数据，分析收入成本结构与销售业绩的关联性',
    sources: [
      { type: 'metric', name: '利润表' },
      { type: 'metric', name: '销售预测' },
      { type: 'file', name: 'Q3_sales_data.xlsx' }
    ],
    integrationMethod: '按月份和区域维度关联，计算各区域贡献率',
    createdBy: '张三',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['财务', '销售', 'Q3', '综合分析']
  },
];

// Store
interface MetricsState {
  // Data
  metricsTree: MetricNode[];
  imMessages: IMMessage[];
  offlineFiles: OfflineFile[];
  integrationRecords: IntegrationRecord[];

  // Selection State
  selectedMetrics: string[];
  selectedIMMessages: string[];
  selectedFiles: string[];
  expandedNodes: string[];

  // Current View
  activeTab: 'query' | 'im' | 'offline';
  querySubTab: 'db' | 'metrics' | 'records';
  selectedMetricDetail: MetricNode | null;
  selectedIMDetail: IMMessage | null;
  selectedFileDetail: OfflineFile | null;

  // Integration
  currentIntegration: IntegrationReport | null;
  isIntegrating: boolean;

  // Model
  selectedModel: LLMModel;

  // Actions
  toggleNode: (nodeId: string) => void;
  toggleMetricSelection: (metricId: string) => void;
  toggleIMSelection: (messageId: string) => void;
  toggleFileSelection: (fileId: string) => void;
  clearAllSelections: () => void;
  clearSelection: () => void;
  setActiveTab: (tab: 'query' | 'im' | 'offline') => void;
  setQuerySubTab: (subTab: 'db' | 'metrics' | 'records') => void;
  setSelectedMetricDetail: (metric: MetricNode | null) => void;
  setSelectedIMDetail: (message: IMMessage | null) => void;
  setSelectedFileDetail: (file: OfflineFile | null) => void;
  setSelectedModel: (model: LLMModel) => void;

  // Integration Actions
  startIntegration: () => void;
  confirmIntegration: () => void;
  cancelIntegration: () => void;
  clearIntegration: () => void;
  addToIntegrationRecords: (record: IntegrationRecord) => void;
  saveRecordToQuery: (recordId: string) => void;

  // Computed
  hasSelection: () => boolean;
  getSelectionCount: () => number;
}

export const useMetricsStore = create<MetricsState>((set, get) => ({
  // Initial Data
  metricsTree: mockMetricsTree,
  imMessages: mockIMMessages,
  offlineFiles: mockOfflineFiles,
  integrationRecords: mockIntegrationRecords,

  // Initial Selection State
  selectedMetrics: [],
  selectedIMMessages: [],
  selectedFiles: [],
  expandedNodes: ['standard', 'kpi'],

  // Initial View State
  activeTab: 'query',
  querySubTab: 'metrics',
  selectedMetricDetail: null,
  selectedIMDetail: null,
  selectedFileDetail: null,

  // Initial Integration State
  currentIntegration: null,
  isIntegrating: false,

  // Initial Model
  selectedModel: 'gemini',

  // Actions
  toggleNode: (nodeId) =>
    set((state) => ({
      expandedNodes: state.expandedNodes.includes(nodeId)
        ? state.expandedNodes.filter((id) => id !== nodeId)
        : [...state.expandedNodes, nodeId],
    })),

  toggleMetricSelection: (metricId) =>
    set((state) => ({
      selectedMetrics: state.selectedMetrics.includes(metricId)
        ? state.selectedMetrics.filter((id) => id !== metricId)
        : [...state.selectedMetrics, metricId],
    })),

  toggleIMSelection: (messageId) =>
    set((state) => ({
      selectedIMMessages: state.selectedIMMessages.includes(messageId)
        ? state.selectedIMMessages.filter((id) => id !== messageId)
        : [...state.selectedIMMessages, messageId],
    })),

  toggleFileSelection: (fileId) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.includes(fileId)
        ? state.selectedFiles.filter((id) => id !== fileId)
        : [...state.selectedFiles, fileId],
    })),

  clearAllSelections: () =>
    set({
      selectedMetrics: [],
      selectedIMMessages: [],
      selectedFiles: [],
    }),

  clearSelection: () =>
    set({
      selectedMetrics: [],
      selectedIMMessages: [],
      selectedFiles: [],
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setQuerySubTab: (subTab) => set({ querySubTab: subTab }),
  setSelectedMetricDetail: (metric) => set({ selectedMetricDetail: metric }),
  setSelectedIMDetail: (message) => set({ selectedIMDetail: message }),
  setSelectedFileDetail: (file) => set({ selectedFileDetail: file }),
  setSelectedModel: (model) => set({ selectedModel: model }),

  // Integration Actions
  startIntegration: () => {
    const state = get();
    const sources: { id: string; type: string; name: string }[] = [];

    // Gather selected sources
    state.selectedMetrics.forEach(id => {
      sources.push({ id, type: 'metric', name: id });
    });
    state.selectedIMMessages.forEach(id => {
      const msg = state.imMessages.find(m => m.id === id);
      if (msg) sources.push({ id, type: 'im', name: msg.sender + ' - ' + msg.summary.slice(0, 20) });
    });
    state.selectedFiles.forEach(id => {
      const file = state.offlineFiles.find(f => f.id === id);
      if (file) sources.push({ id, type: 'file', name: file.name });
    });

    set({ isIntegrating: true });

    // Simulate AI integration process
    setTimeout(() => {
      const mockIntegration: IntegrationReport = {
        id: `int-${Date.now()}`,
        name: '集成报表：' + sources.map(s => s.name).slice(0, 2).join(' + '),
        description: `整合${sources.length}个数据源，分析各维度的关联性和趋势`,
        tags: ['自动生成', '多源集成', new Date().toLocaleDateString('zh-CN')],
        sources,
        tableData: {
          columns: ['维度', '指标1', '指标2', '变化率'],
          rows: [
            ['华东', '2,345,678', '1,876,543', '+12%'],
            ['华南', '1,876,543', '1,654,321', '+8%'],
            ['华北', '1,234,567', '1,098,765', '+15%'],
            ['西南', '876,543', '765,432', '+5%'],
          ]
        },
        chartConfig: {
          title: '各区域指标对比',
          data: [2345678, 1876543, 1234567, 876543],
          labels: ['华东', '华南', '华北', '西南'],
          colors: ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-orange)']
        },
        createdAt: new Date(),
      };

      set({
        currentIntegration: mockIntegration,
        isIntegrating: false,
      });
    }, 2000);
  },

  confirmIntegration: () => {
    const state = get();
    if (state.currentIntegration) {
      const record: IntegrationRecord = {
        id: state.currentIntegration.id,
        name: state.currentIntegration.name,
        description: state.currentIntegration.description,
        sources: state.currentIntegration.sources.map(s => ({ type: s.type, name: s.name })),
        integrationMethod: '智能关联匹配',
        createdBy: '当前用户',
        createdAt: state.currentIntegration.createdAt,
        tags: state.currentIntegration.tags,
      };

      set((state) => ({
        integrationRecords: [record, ...state.integrationRecords],
        currentIntegration: null,
        selectedMetrics: [],
        selectedIMMessages: [],
        selectedFiles: [],
      }));
    }
  },

  cancelIntegration: () => set({ currentIntegration: null, isIntegrating: false }),

  clearIntegration: () => set({ currentIntegration: null }),

  saveRecordToQuery: (_recordId) => {
    // Move record from deliverables to saved query records (mark as saved)
    set({
      querySubTab: 'records',
      activeTab: 'query',
    });
  },

  addToIntegrationRecords: (record) =>
    set((state) => ({
      integrationRecords: [record, ...state.integrationRecords],
    })),

  // Computed
  hasSelection: () => {
    const state = get();
    return state.selectedMetrics.length > 0 ||
           state.selectedIMMessages.length > 0 ||
           state.selectedFiles.length > 0;
  },

  getSelectionCount: () => {
    const state = get();
    return state.selectedMetrics.length +
           state.selectedIMMessages.length +
           state.selectedFiles.length;
  },
}));
