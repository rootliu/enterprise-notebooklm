import { useState } from 'react';
import {
  FileText,
  FileImage,
  Presentation,
  Download,
  Settings,
  Clock,
  MoreHorizontal,
  Database,
  GripVertical,
  Check,
} from 'lucide-react';
import { useGeneratedContentStore, useMetricsStore, useUIStore } from '../../store';
import { InsertMetricsModal } from './InsertMetricsModal';

const contentTools = [
  { id: 'report', name: '报告', icon: FileText, color: 'var(--accent-blue)' },
  { id: 'brief', name: '简报', icon: FileImage, color: 'var(--accent-purple)' },
  { id: 'ppt', name: 'PPT', icon: Presentation, color: 'var(--accent-orange)' },
  { id: 'export', name: '导出', icon: Download, color: 'var(--text-secondary)' },
];

const typeIcons: Record<string, React.ElementType> = {
  report: FileText,
  brief: FileImage,
  ppt: Presentation,
  csv: Download,
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

export function StudioPanel() {
  const { contents } = useGeneratedContentStore();
  const { selectedMetrics, integrationRecords, saveRecordToQuery } = useMetricsStore();
  const { openModal } = useUIStore();
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [draggedRecordId, setDraggedRecordId] = useState<string | null>(null);

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          STUDIO
        </h2>
        <button
          className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Content Generation Tools */}
      <div className="px-4 py-3">
        <h3
          className="text-xs font-medium uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          内容生成
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {contentTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => openModal(tool.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                }}
              >
                <Icon size={16} style={{ color: tool.color }} />
                <span className="text-sm">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Insert to Metrics Button */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setShowInsertModal(true)}
          disabled={selectedMetrics.length === 0}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: selectedMetrics.length > 0 ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
            color: selectedMetrics.length > 0 ? 'white' : 'var(--text-muted)',
          }}
        >
          <Database size={16} />
          <span className="text-sm">插入指标数据源</span>
        </button>
        {selectedMetrics.length === 0 && (
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            请先在左侧选择指标
          </p>
        )}
      </div>

      {/* Integration Records / Deliverables */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <div className="px-4 py-3">
          <h3
            className="text-xs font-medium uppercase tracking-wide mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            工作交付件
          </h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            可拖拽到左侧 Query 保存为记录
          </p>

          {integrationRecords.length === 0 ? (
            <div
              className="text-center py-6"
              style={{ color: 'var(--text-muted)' }}
            >
              <Database size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无集成报表</p>
              <p className="text-xs mt-1">选择数据源后点击"集成"生成</p>
            </div>
          ) : (
            <div className="space-y-2">
              {integrationRecords.map((record) => (
                <div
                  key={record.id}
                  draggable
                  onDragStart={() => setDraggedRecordId(record.id)}
                  onDragEnd={() => setDraggedRecordId(null)}
                  className="group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all"
                  style={{
                    backgroundColor: draggedRecordId === record.id ? 'var(--accent-blue)' + '20' : 'var(--bg-tertiary)',
                    border: draggedRecordId === record.id ? '1px dashed var(--accent-blue)' : '1px solid transparent',
                  }}
                >
                  <GripVertical
                    size={14}
                    className="opacity-30 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <Database size={16} style={{ color: 'var(--accent-blue)' }} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {record.name}
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Clock size={10} />
                      {formatTimeAgo(record.createdAt)}
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {record.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-[10px] rounded"
                          style={{
                            backgroundColor: 'var(--accent-blue)' + '20',
                            color: 'var(--accent-blue)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => saveRecordToQuery(record.id)}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--accent-green)' }}
                      title="保存到Query记录"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generated Content List */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <h3
            className="text-xs font-medium uppercase tracking-wide mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            已生成内容
          </h3>

          {contents.length === 0 ? (
            <div
              className="text-center py-6"
              style={{ color: 'var(--text-muted)' }}
            >
              <FileText size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无生成内容</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contents.map((content) => {
                const Icon = typeIcons[content.type] || FileText;
                return (
                  <div
                    key={content.id}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <Icon size={16} style={{ color: 'var(--accent-blue)' }} />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {content.name}
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Clock size={10} />
                        {formatTimeAgo(content.createdAt)}
                      </div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Insert Metrics Modal */}
      {showInsertModal && (
        <InsertMetricsModal onClose={() => setShowInsertModal(false)} />
      )}
    </div>
  );
}
