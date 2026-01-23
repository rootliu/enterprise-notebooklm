import { useRef, useEffect, useState } from 'react';
import { useChatStore, useMetricsStore, useContextStore } from '../../store';
import { MessageItem } from './MessageItem';
import { InputArea } from './InputArea';
import { IntegrationReportView } from './IntegrationReportView';
import {
  Save,
  FilePlus,
  X,
  Download,
  FileText,
  Loader2,
} from 'lucide-react';
import * as api from '../../services/api';

// Session Header Component
function SessionHeader() {
  const { messages, sessionName, setSessionName, clearChat, isModified } = useChatStore();
  const { contextFileIds, clearContext, removeFromContext } = useContextStore();
  const { offlineFiles, addOfflineFile } = useMetricsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const contextFiles = offlineFiles.filter((f) => contextFileIds.includes(f.id));

  const handleSaveSession = async () => {
    if (messages.length <= 1) {
      alert('没有可保存的对话内容');
      return;
    }

    const name = sessionName || `会话_${new Date().toLocaleString('zh-CN')}`;
    setIsSaving(true);

    try {
      const result = await api.saveSession(
        name,
        messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        })),
        contextFileIds
      );

      // Add saved session file to offline files
      addOfflineFile({
        id: result.fileId,
        name: `${name}.md`,
        format: 'markdown',
        size: '1 KB',
        uploadedAt: new Date(),
        summary: result.summary,
        tags: result.tags,
        status: 'ready',
      });

      alert('会话已保存');
    } catch (error) {
      console.error('Save session error:', error);
      alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewContext = () => {
    if (isModified) {
      const confirm = window.confirm('当前会话未保存，确定要清空吗？');
      if (!confirm) return;
    }
    clearContext();
    clearChat();
  };

  const handleExport = async (format: 'markdown' | 'docx') => {
    if (messages.length <= 1) {
      alert('没有可导出的对话内容');
      return;
    }

    try {
      const result = await api.exportChat(
        messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        })),
        format,
        sessionName || '对话记录'
      );

      // Download file
      api.downloadFile(result.content, result.filename, result.mimeType);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      alert(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    <div
      className="px-4 py-3 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Session Info */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="未命名会话"
          className="text-sm font-medium bg-transparent border-none outline-none"
          style={{ color: 'var(--text-primary)', width: '150px' }}
        />
        {isModified && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-orange)' }}
            title="未保存"
          />
        )}
      </div>

      {/* Context Files */}
      {contextFiles.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap max-w-[300px]">
          {contextFiles.slice(0, 3).map((file) => (
            <span
              key={file.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded"
              style={{
                backgroundColor: 'var(--accent-blue)' + '20',
                color: 'var(--accent-blue)',
              }}
            >
              <FileText size={10} />
              {file.name.length > 15 ? file.name.slice(0, 15) + '...' : file.name}
              <button
                onClick={() => removeFromContext(file.id)}
                className="hover:opacity-70"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          {contextFiles.length > 3 && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              +{contextFiles.length - 3} 更多
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
            }}
            title="导出对话"
          >
            <Download size={14} />
            <span className="hidden sm:inline">导出</span>
          </button>

          {showExportMenu && (
            <div
              className="absolute top-full right-0 mt-1 py-1 rounded-lg shadow-lg z-10"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
              }}
            >
              <button
                onClick={() => handleExport('markdown')}
                className="w-full px-3 py-1.5 text-xs text-left hover:bg-opacity-10"
                style={{ color: 'var(--text-primary)' }}
              >
                导出为 Markdown
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="w-full px-3 py-1.5 text-xs text-left hover:bg-opacity-10"
                style={{ color: 'var(--text-primary)' }}
              >
                导出为 DOCX
              </button>
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSaveSession}
          disabled={isSaving}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          title="保存会话"
        >
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          <span className="hidden sm:inline">保存</span>
        </button>

        {/* New Context */}
        <button
          onClick={handleNewContext}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          title="新建会话"
        >
          <FilePlus size={14} />
          <span className="hidden sm:inline">新建</span>
        </button>
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { messages, isLoading } = useChatStore();
  const { currentIntegration, isIntegrating, selectedFiles } = useMetricsStore();
  const { addToContext, contextFileIds } = useContextStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Import selected files to context
  const handleImportToContext = () => {
    selectedFiles.forEach((fileId) => {
      if (!contextFileIds.includes(fileId)) {
        addToContext(fileId);
      }
    });
  };

  const hasSelectedFiles = selectedFiles.length > 0;
  const newFilesToImport = selectedFiles.filter((id) => !contextFileIds.includes(id));

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Session Header */}
      <SessionHeader />

      {/* Import Button */}
      {hasSelectedFiles && newFilesToImport.length > 0 && (
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            backgroundColor: 'var(--accent-blue)' + '10',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <span className="text-xs" style={{ color: 'var(--accent-blue)' }}>
            已选择 {newFilesToImport.length} 个文件
          </span>
          <button
            onClick={handleImportToContext}
            className="px-3 py-1 text-xs rounded"
            style={{
              backgroundColor: 'var(--accent-blue)',
              color: 'white',
            }}
          >
            导入数据源
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Integration Report */}
        {(currentIntegration || isIntegrating) && <IntegrationReportView />}

        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{
                  borderColor: 'var(--text-muted)',
                  borderTopColor: 'transparent',
                }}
              />
            </div>
            <div
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'var(--text-muted)',
                    animationDelay: '0ms',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'var(--text-muted)',
                    animationDelay: '150ms',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'var(--text-muted)',
                    animationDelay: '300ms',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea />
    </div>
  );
}
