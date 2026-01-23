const API_BASE = 'http://localhost:3001/api';

// Types
export interface UploadedFile {
  id: string;
  name: string;
  format: 'csv' | 'excel' | 'pdf' | 'html' | 'markdown' | 'docx';
  size: string;
  uploadedAt: string;
  summary: string;
  tags: string[];
  status: 'uploading' | 'analyzing' | 'ready' | 'error';
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextFiles?: string[];
}

export interface Session {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  contextFileIds: string[];
}

// API Functions

// Health check
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

// File APIs
export async function uploadFile(file: File, contextType: 'summary' | 'full' = 'summary'): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('contextType', contextType);

  const response = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.data;
}

export async function getFiles(tags?: string[], search?: string): Promise<UploadedFile[]> {
  const params = new URLSearchParams();
  if (tags && tags.length > 0) {
    tags.forEach(tag => params.append('tags', tag));
  }
  if (search) {
    params.set('search', search);
  }

  const response = await fetch(`${API_BASE}/files?${params.toString()}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch files');
  }

  return data.data;
}

export async function getFile(id: string): Promise<UploadedFile> {
  const response = await fetch(`${API_BASE}/files/${id}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch file');
  }

  return data.data;
}

export async function getFileContent(id: string): Promise<string> {
  const response = await fetch(`${API_BASE}/files/${id}/content`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch file content');
  }

  return data.data.content;
}

export async function deleteFile(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/files/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to delete file');
  }
}

export async function getAllTags(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/files/tags/all`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch tags');
  }

  return data.data;
}

// Chat APIs
export async function sendChatMessage(
  message: string,
  contextFileIds: string[],
  contextType: 'summary' | 'full' = 'summary'
): Promise<ChatMessage> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      contextFileIds,
      contextType,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Chat failed');
  }

  return data.data;
}

export async function exportChat(
  messages: ChatMessage[],
  format: 'markdown' | 'docx',
  sessionName?: string
): Promise<{ content: string; filename: string; mimeType: string }> {
  const response = await fetch(`${API_BASE}/chat/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      format,
      sessionName,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Export failed');
  }

  return data.data;
}

// Session APIs
export async function saveSession(
  name: string,
  messages: ChatMessage[],
  contextFileIds: string[]
): Promise<{ sessionId: string; fileId: string; summary: string; tags: string[] }> {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      messages,
      contextFileIds,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to save session');
  }

  return data.data;
}

export async function getSessions(): Promise<Session[]> {
  const response = await fetch(`${API_BASE}/sessions`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch sessions');
  }

  return data.data;
}

export async function getSession(id: string): Promise<Session> {
  const response = await fetch(`${API_BASE}/sessions/${id}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch session');
  }

  return data.data;
}

export async function deleteSession(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/sessions/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to delete session');
  }
}

// Utility function to download file
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
