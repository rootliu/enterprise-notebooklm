import { useState } from 'react';
import {
  FileSpreadsheet,
  FileJson,
  FileText,
  Image,
  Upload,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useMetricsStore, type OfflineFile } from '../../store/metricsStore';

const formatIcons: Record<string, React.ElementType> = {
  excel: FileSpreadsheet,
  csv: FileSpreadsheet,
  json: FileJson,
  pdf: FileText,
  word: FileText,
  image: Image,
};

const formatColors: Record<string, string> = {
  excel: 'var(--accent-green)',
  csv: 'var(--accent-green)',
  json: 'var(--accent-orange)',
  pdf: 'var(--accent-red)',
  word: 'var(--accent-blue)',
  image: 'var(--accent-purple)',
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${diffDays}天前`;
}

// File Card Component
function FileCard({ file }: { file: OfflineFile }) {
  const { selectedFiles, toggleFileSelection, selectedFileDetail, setSelectedFileDetail } =
    useMetricsStore();

  const isSelected = selectedFiles.includes(file.id);
  const isExpanded = selectedFileDetail?.id === file.id;
  const Icon = formatIcons[file.format] || FileText;
  const color = formatColors[file.format] || 'var(--text-muted)';

  const handleToggle = () => {
    if (isExpanded) {
      setSelectedFileDetail(null);
    } else {
      setSelectedFileDetail(file);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFileSelection(file.id);
  };

  return (
    <div
      className="rounded-lg overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent',
      }}
    >
      {/* Header */}
      <div
        className="p-3 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '20' }}
          >
            <Icon size={20} style={{ color }} />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {file.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {file.size}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                •
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatTimeAgo(file.uploadedAt)}
              </span>
            </div>
          </div>

          {/* Selection Checkbox */}
          <button
            onClick={handleSelect}
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--bg-hover)',
              border: isSelected ? 'none' : '1px solid var(--border-light)',
            }}
          >
            {isSelected && <Check size={12} className="text-white" />}
          </button>

          {/* Expand Icon */}
          {isExpanded ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </div>

      {/* Expanded Detail - Summary and Tags */}
      {isExpanded && (
        <div
          className="px-3 pb-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div className="pt-3 space-y-3">
            {/* Summary */}
            {file.summary && (
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  摘要
                </span>
                <p
                  className="mt-1 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {file.summary}
                </p>
              </div>
            )}

            {/* Tags */}
            {file.tags.length > 0 && (
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  标签
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {file.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{ backgroundColor: color + '20', color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function OfflineTab() {
  const { offlineFiles } = useMetricsStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file upload logic here
  };

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2">
      {/* Upload Area */}
      <div
        className="p-4 rounded-lg text-center transition-all cursor-pointer"
        style={{
          backgroundColor: isDragOver ? 'var(--accent-blue)' + '20' : 'var(--bg-tertiary)',
          border: `1px dashed ${isDragOver ? 'var(--accent-blue)' : 'var(--border-light)'}`,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload
          size={24}
          style={{ color: isDragOver ? 'var(--accent-blue)' : 'var(--text-muted)', margin: '0 auto' }}
        />
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          拖拽文件到此处上传
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          支持 CSV, Excel, JSON, PDF, Word, 图片
        </p>
      </div>

      {/* File List */}
      {offlineFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FileText size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            暂无上传文件
          </p>
        </div>
      ) : (
        offlineFiles.map((file) => (
          <FileCard key={file.id} file={file} />
        ))
      )}
    </div>
  );
}
