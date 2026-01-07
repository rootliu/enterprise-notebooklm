import { useState } from 'react';
import { X, Database, Check } from 'lucide-react';
import { useMetricsStore } from '../../store';

interface Props {
  onClose: () => void;
}

const targetCategories = [
  { id: 'standard', name: '标准报表', description: '添加到标准报表数据源' },
  { id: 'kpi', name: 'KPI指标', description: '添加为KPI监控指标' },
  { id: 'forecast', name: '预测报表', description: '用于趋势预测分析' },
  { id: 'insight', name: '分析洞察', description: '添加到洞察分析库' },
];

export function InsertMetricsModal({ onClose }: Props) {
  const { selectedMetrics, metricsTree, clearSelection } = useMetricsStore();
  const [selectedTarget, setSelectedTarget] = useState('standard');
  const [isInserting, setIsInserting] = useState(false);
  const [insertSuccess, setInsertSuccess] = useState(false);

  // Find metric names from IDs
  const findMetricName = (id: string): string => {
    const search = (nodes: typeof metricsTree): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.nameCn;
        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(metricsTree) || id;
  };

  const handleInsert = async () => {
    setIsInserting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsInserting(false);
    setInsertSuccess(true);

    setTimeout(() => {
      clearSelection();
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              <Database size={16} className="text-white" />
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              插入指标数据源
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {/* Selected Metrics */}
          <div className="mb-4">
            <label
              className="text-xs font-medium uppercase tracking-wide mb-2 block"
              style={{ color: 'var(--text-muted)' }}
            >
              已选指标 ({selectedMetrics.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedMetrics.map((id) => (
                <span
                  key={id}
                  className="px-2.5 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {findMetricName(id)}
                </span>
              ))}
            </div>
          </div>

          {/* Target Category */}
          <div>
            <label
              className="text-xs font-medium uppercase tracking-wide mb-2 block"
              style={{ color: 'var(--text-muted)' }}
            >
              目标分类
            </label>
            <div className="space-y-2">
              {targetCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedTarget(cat.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor:
                      selectedTarget === cat.id ? 'var(--bg-active)' : 'var(--bg-tertiary)',
                    border:
                      selectedTarget === cat.id
                        ? '1px solid var(--accent-blue)'
                        : '1px solid transparent',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedTarget === cat.id ? 'var(--accent-blue)' : 'var(--bg-hover)',
                    }}
                  >
                    {selectedTarget === cat.id && <Check size={12} className="text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {cat.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {cat.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-5 py-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            取消
          </button>
          <button
            onClick={handleInsert}
            disabled={isInserting || insertSuccess}
            className="px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
            style={{
              backgroundColor: insertSuccess ? 'var(--accent-green)' : 'var(--accent-blue)',
              color: 'white',
            }}
          >
            {isInserting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                插入中...
              </>
            ) : insertSuccess ? (
              <>
                <Check size={16} />
                已插入
              </>
            ) : (
              <>
                <Database size={16} />
                确认插入
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
