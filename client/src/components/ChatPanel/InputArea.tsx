import {
  Send,
  Upload,
  Link,
  TrendingUp,
  Spline,
  Layers,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useChatStore, useMetricsStore } from '../../store';
import type { LLMModel } from '../../types';

const models: { id: LLMModel; name: string; color: string }[] = [
  { id: 'gemini', name: 'Gemini', color: '#4285f4' },
  { id: 'claude', name: 'Claude', color: '#d97706' },
  { id: 'gpt', name: 'GPT', color: '#10a37f' },
  { id: 'deepseek', name: 'DeepSeek', color: '#6366f1' },
  { id: 'qwen', name: 'Qwen', color: '#8b5cf6' },
  { id: 'glm', name: 'GLM', color: '#ec4899' },
];

const alwaysActiveTools = [
  { id: 'upload', name: '上传', icon: Upload, color: 'var(--text-secondary)', alwaysEnabled: true },
  { id: 'link', name: '链接', icon: Link, color: 'var(--text-secondary)', alwaysEnabled: true },
];

const analysisTools = [
  { id: 'predict', name: '预测', icon: TrendingUp, activeColor: 'var(--accent-blue)', description: '时间序列预测' },
  { id: 'fit', name: '拟合', icon: Spline, activeColor: 'var(--accent-purple)', description: '曲线拟合分析' },
  { id: 'classify', name: '分类', icon: Layers, activeColor: 'var(--accent-green)', description: '数据分类' },
  { id: 'extract', name: '特征', icon: Sparkles, activeColor: 'var(--accent-orange)', description: '特征提取' },
];

export function InputArea() {
  const { inputValue, setInputValue, sendMessage, isLoading } = useChatStore();
  const {
    selectedMetrics,
    selectedIMMessages,
    selectedFiles,
    currentIntegration,
    selectedModel,
    setSelectedModel,
  } = useMetricsStore();
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [activeAnalysisTool, setActiveAnalysisTool] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  // Analysis tools are enabled when user has selected metrics/files or has an integration report
  const analysisToolsEnabled =
    selectedMetrics.length > 0 ||
    selectedIMMessages.length > 0 ||
    selectedFiles.length > 0 ||
    currentIntegration !== null;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      {/* Selected Metrics Indicator */}
      {selectedMetrics.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            已选指标:
          </span>
          <span
            className="px-2 py-0.5 text-xs rounded"
            style={{
              backgroundColor: 'var(--accent-blue)',
              color: 'white',
            }}
          >
            {selectedMetrics.length} 个
          </span>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入问题，AI 将通过 Agent 获取数据并分析..."
          rows={1}
          className="w-full px-4 py-3 pr-12 text-sm rounded-xl resize-none focus:outline-none"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
          }}
          disabled={isLoading}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--accent-blue)',
            color: 'white',
          }}
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isLoading}
        >
          {isLoading ? (
            <div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mt-3">
        {/* Tools */}
        <div className="flex items-center gap-1">
          {/* Always active tools */}
          {alwaysActiveTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors hover:bg-opacity-10"
                style={{
                  color: tool.color,
                  backgroundColor: 'transparent',
                }}
                title={tool.name}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tool.name}</span>
              </button>
            );
          })}

          {/* Separator */}
          <div
            className="w-px h-4 mx-1"
            style={{ backgroundColor: 'var(--border-color)' }}
          />

          {/* Analysis tools - dynamic highlight */}
          {analysisTools.map((tool) => {
            const Icon = tool.icon;
            const isEnabled = analysisToolsEnabled;
            const isActive = activeAnalysisTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (isEnabled) {
                    setActiveAnalysisTool(isActive ? null : tool.id);
                    // TODO: Trigger analysis action
                  }
                }}
                disabled={!isEnabled}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all"
                style={{
                  color: isEnabled ? tool.activeColor : 'var(--text-muted)',
                  backgroundColor: isActive ? tool.activeColor + '20' : 'transparent',
                  opacity: isEnabled ? 1 : 0.4,
                  cursor: isEnabled ? 'pointer' : 'not-allowed',
                  border: isActive ? `1px solid ${tool.activeColor}40` : '1px solid transparent',
                }}
                title={isEnabled ? tool.description : '请先选择数据源'}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tool.name}</span>
              </button>
            );
          })}
        </div>

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentModel.color }}
            />
            {currentModel.name}
            <ChevronDown size={12} />
          </button>

          {/* Dropdown */}
          {showModelDropdown && (
            <div
              className="absolute bottom-full right-0 mb-2 py-1 rounded-lg shadow-lg min-w-[140px] z-10"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
              }}
            >
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setShowModelDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors"
                  style={{
                    color:
                      model.id === selectedModel
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                    backgroundColor:
                      model.id === selectedModel ? 'var(--bg-active)' : 'transparent',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
