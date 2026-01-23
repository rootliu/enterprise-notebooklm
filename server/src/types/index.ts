// File types
export interface UploadedFile {
  id: string;
  name: string;
  format: 'csv' | 'excel' | 'pdf' | 'html' | 'markdown' | 'docx';
  size: string;
  uploadedAt: Date;
  summary: string;
  tags: string[];
  filePath: string;
  contentType: 'summary' | 'full';
  status: 'uploading' | 'analyzing' | 'ready' | 'error';
  errorMessage?: string;
  content?: string; // Full file content for context
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextFiles?: string[];
}

// Session types
export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  contextFileIds: string[];
}

// Context types
export interface ContextItem {
  fileId: string;
  type: 'summary' | 'full';
  content: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Gemini analysis result
export interface AnalysisResult {
  summary: string;
  tags: string[];
}
