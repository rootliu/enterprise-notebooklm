// Re-export metrics types
export * from './metrics';

// Data Source Types
export type DataSourceType = 'database' | 'file' | 'web' | 'generated';
export type DataSourceFormat = 'csv' | 'pdf' | 'postgresql' | 'mysql' | 'sqlite' | 'api' | 'excel' | 'json';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  format: DataSourceFormat;
  summary: string;
  tags: Tag[];
  rowCount?: number;
  columnCount?: number;
  fileSize?: string;
  lastUpdated: Date;
  status: 'connected' | 'disconnected' | 'error';
}

export interface Tag {
  id: string;
  name: string;
  type: 'column' | 'metric' | 'dimension' | 'custom';
}

// Chat Types
export type MessageRole = 'user' | 'assistant' | 'system';
export type ContentType = 'text' | 'table' | 'chart' | 'formula' | 'mixed';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  contentType: ContentType;
  attachments?: Attachment[];
  citations?: Citation[];
  timestamp: Date;
}

export interface Attachment {
  id: string;
  type: 'table' | 'chart' | 'image';
  data: any;
  title?: string;
}

export interface Citation {
  dataSourceId: string;
  dataSourceName: string;
  location: {
    rowStart?: number;
    rowEnd?: number;
    columns?: string[];
  };
  preview: string;
}

// Generated Content Types
export type GeneratedContentType = 'report' | 'brief' | 'ppt' | 'csv' | 'podcast' | 'datasource';

export interface GeneratedContent {
  id: string;
  type: GeneratedContentType;
  name: string;
  createdAt: Date;
  previewUrl?: string;
}

// UI State Types
export type RightPanelMode = 'tools' | 'detail';

export interface DataDetail {
  dataSourceId: string;
  dataSourceName: string;
  rows: number[];
  columns: string[];
  data: any[];
}
