import { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  FileJson,
  FileText,
  FileCode,
  Upload,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useMetricsStore, type OfflineFile } from '../../store/metricsStore';
import * as api from '../../services/api';

const formatIcons: Record<string, React.ElementType> = {
  excel: FileSpreadsheet,
  csv: FileSpreadsheet,
  json: FileJson,
  pdf: FileText,
  html: FileCode,
  markdown: FileText,
  docx: FileText,
};

const formatColors: Record<string, string> = {
  excel: 'var(--accent-green)',
  csv: 'var(--accent-green)',
  json: 'var(--accent-orange)',
  pdf: 'var(--accent-red)',
  html: 'var(--accent-purple)',
  markdown: 'var(--accent-blue)',
  docx: 'var(--accent-blue)',
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${diffDays}天前`;
}

// File Card Component
function FileCard({ file }: { file: OfflineFile }) {
  const {
    selectedFiles,
    toggleFileSelection,
    selectedFileDetail,
    setSelectedFileDetail,
    filterTags,
    addFilterTag,
  } = useMetricsStore();

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

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!filterTags.includes(tag)) {
      addFilterTag(tag);
    }
  };

  const isAnalyzing = file.status === 'analyzing' || file.status === 'uploading';
  const hasError = file.status === 'error';

  return (
    <div
      className="rounded-lg overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent',
        opacity: isAnalyzing ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div className="p-3 cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '20' }}
          >
            {isAnalyzing ? (
              <Loader2 size={20} className="animate-spin" style={{ color }} />
            ) : hasError ? (
              <AlertCircle size={20} style={{ color: 'var(--accent-red)' }} />
            ) : (
              <Icon size={20} style={{ color }} />
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-primary)' }}
            >
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
                {formatTimeAgo(new Date(file.uploadedAt))}
              </span>
              {isAnalyzing && (
                <>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    •
                  </span>
                  <span className="text-xs" style={{ color: 'var(--accent-blue)' }}>
                    分析中...
                  </span>
                </>
              )}
              {hasError && (
                <>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    •
                  </span>
                  <span className="text-xs" style={{ color: 'var(--accent-red)' }}>
                    分析失败
                  </span>
                </>
              )}
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
            disabled={isAnalyzing}
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
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
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
            {file.tags && file.tags.length > 0 && (
              <div>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  标签
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {file.tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleTagClick(tag, e)}
                      className="px-2 py-0.5 text-xs rounded-full hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ backgroundColor: color + '20', color }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error message */}
            {hasError && file.errorMessage && (
              <div>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--accent-red)' }}
                >
                  错误信息
                </span>
                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--accent-red)' }}
                >
                  {file.errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Tag Filter Component
function TagFilter() {
  const { filterTags, removeFilterTag, clearFilterTags } = useMetricsStore();

  if (filterTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {filterTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
          style={{
            backgroundColor: 'var(--accent-blue)' + '20',
            color: 'var(--accent-blue)',
          }}
        >
          {tag}
          <button
            onClick={() => removeFilterTag(tag)}
            className="hover:opacity-70"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {filterTags.length > 1 && (
        <button
          onClick={clearFilterTags}
          className="text-xs px-2 py-0.5 rounded-full hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          清除全部
        </button>
      )}
    </div>
  );
}

export function OfflineTab() {
  const {
    offlineFiles,
    addOfflineFile,
    updateOfflineFile,
    searchQuery,
    setSearchQuery,
    filterTags,
    getFilteredFiles,
  } = useMetricsStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll for file status updates
  useEffect(() => {
    const analyzingFiles = offlineFiles.filter(
      (f) => f.status === 'analyzing' || f.status === 'uploading'
    );

    if (analyzingFiles.length === 0) return;

    const interval = setInterval(async () => {
      for (const file of analyzingFiles) {
        try {
          const updated = await api.getFile(file.id);
          if (updated.status !== file.status) {
            updateOfflineFile(file.id, {
              status: updated.status as OfflineFile['status'],
              summary: updated.summary,
              tags: updated.tags,
              errorMessage: updated.errorMessage,
            });
          }
        } catch (error) {
          console.error('Failed to poll file status:', error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [offlineFiles, updateOfflineFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
    e.target.value = '';
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);

    for (const file of Array.from(files)) {
      try {
        // Upload file to backend
        const result = await api.uploadFile(file, 'summary');

        // Add to store with initial status
        const newFile: OfflineFile = {
          id: result.id,
          name: result.name,
          format: result.format as OfflineFile['format'],
          size: result.size,
          uploadedAt: new Date(),
          summary: result.summary || '正在分析文件内容...',
          tags: result.tags || [],
          status: result.status as OfflineFile['status'],
        };

        addOfflineFile(newFile);
      } catch (error) {
        console.error('Upload failed:', error);
        // Show error notification (could use a toast library)
        alert(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    setIsUploading(false);
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2">
      {/* Search Box */}
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索文件名或摘要..."
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg focus:outline-none"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tag Filter */}
      <TagFilter />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls,.pdf,.html,.htm,.md,.markdown,.docx,.doc"
        multiple
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className="p-4 rounded-lg text-center transition-all cursor-pointer"
        style={{
          backgroundColor: isDragOver
            ? 'var(--accent-blue)' + '20'
            : 'var(--bg-tertiary)',
          border: `1px dashed ${
            isDragOver ? 'var(--accent-blue)' : 'var(--border-light)'
          }`,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isUploading ? (
          <Loader2
            size={24}
            className="animate-spin mx-auto"
            style={{ color: 'var(--accent-blue)' }}
          />
        ) : (
          <Upload
            size={24}
            style={{
              color: isDragOver ? 'var(--accent-blue)' : 'var(--text-muted)',
              margin: '0 auto',
            }}
          />
        )}
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          {isUploading ? '上传中...' : '拖拽文件到此处上传'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          支持 CSV, Excel, PDF, HTML, Markdown
        </p>
      </div>

      {/* File List */}
      {filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FileText
            size={32}
            style={{ color: 'var(--text-muted)', opacity: 0.5 }}
          />
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            {searchQuery || filterTags.length > 0
              ? '没有匹配的文件'
              : '暂无上传文件'}
          </p>
        </div>
      ) : (
        filteredFiles.map((file) => <FileCard key={file.id} file={file} />)
      )}
    </div>
  );
}
