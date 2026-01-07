// Metrics Tree Types for ERP Data Sources

export type MetricCategory = 'standard' | 'kpi' | 'forecast' | 'module' | 'insight';
export type IMSource = 'feishu' | 'wecom' | 'email';
export type DataSourceCategory = 'metrics' | 'im' | 'offline' | 'query';

export interface MetricNode {
  id: string;
  name: string;
  nameCn: string;
  category: MetricCategory;
  children?: MetricNode[];
  isLeaf?: boolean;
  icon?: string;
  description?: string;
}

export interface IMDataSource {
  id: string;
  name: string;
  type: IMSource;
  connected: boolean;
  unreadCount?: number;
}

export interface OfflineData {
  id: string;
  name: string;
  format: 'csv' | 'excel' | 'json';
  size: string;
  uploadedAt: Date;
}

export interface PredefinedQuery {
  id: string;
  name: string;
  description: string;
  category: string;
  sql?: string;
}

// LLM Model Types
export type LLMModel = 'gemini' | 'claude' | 'gpt' | 'deepseek' | 'qwen' | 'glm';

export interface LLMModelOption {
  id: LLMModel;
  name: string;
  provider: string;
  description: string;
}

// Chat Tool Types
export type ChatTool = 'upload' | 'link' | 'predict' | 'fit' | 'classify' | 'extract';

export interface ChatToolOption {
  id: ChatTool;
  name: string;
  nameCn: string;
  icon: string;
  description: string;
}

// Generated Content for Studio
export type StudioContentType = 'report' | 'brief' | 'ppt' | 'export';

export interface StudioContent {
  id: string;
  type: StudioContentType;
  name: string;
  createdAt: Date;
  metricsUsed: string[];
}
