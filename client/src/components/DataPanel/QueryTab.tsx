import { Database, BarChart3, History, ChevronRight, Check, FileText, Lightbulb, Link2 } from 'lucide-react';
import { useMetricsStore, type MetricNode } from '../../store/metricsStore';

type SubTabType = 'db' | 'metrics' | 'records';

const subTabs: { id: SubTabType; name: string; icon: React.ElementType }[] = [
  { id: 'db', name: 'DB定制', icon: Database },
  { id: 'metrics', name: '指标体系', icon: BarChart3 },
  { id: 'records', name: '集成记录', icon: History },
];

// Metric Tree Node Component
function MetricTreeNode({ node, level }: { node: MetricNode; level: number }) {
  const {
    expandedNodes,
    toggleNode,
    selectedMetrics,
    toggleMetricSelection,
    setSelectedMetricDetail,
  } = useMetricsStore();

  const isExpanded = expandedNodes.includes(node.id);
  const isSelected = selectedMetrics.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (node.isLeaf) {
      setSelectedMetricDetail(node);
    } else if (hasChildren) {
      toggleNode(node.id);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.isLeaf) {
      toggleMetricSelection(node.id);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
        style={{
          paddingLeft: `${8 + level * 12}px`,
          backgroundColor: isSelected ? 'var(--bg-active)' : 'transparent',
        }}
        onClick={handleClick}
      >
        {/* Expand Icon */}
        {hasChildren ? (
          <ChevronRight
            size={14}
            className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          />
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}

        {/* Name */}
        <span
          className="flex-1 text-sm truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {node.nameCn}
        </span>

        {/* Selection Checkbox for leaf nodes */}
        {node.isLeaf && (
          <button
            onClick={handleSelect}
            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              border: isSelected ? 'none' : '1px solid var(--border-light)',
            }}
          >
            {isSelected && <Check size={10} className="text-white" />}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <MetricTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Metric Detail Panel
function MetricDetailPanel() {
  const { selectedMetricDetail, setSelectedMetricDetail, toggleMetricSelection, selectedMetrics } =
    useMetricsStore();

  if (!selectedMetricDetail) return null;

  const isSelected = selectedMetrics.includes(selectedMetricDetail.id);

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <button
          onClick={() => setSelectedMetricDetail(null)}
          className="text-xs"
          style={{ color: 'var(--accent-blue)' }}
        >
          ← 返回
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <FileText size={18} style={{ color: 'var(--accent-blue)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {selectedMetricDetail.nameCn}
          </h3>
        </div>

        {/* Description */}
        {selectedMetricDetail.description && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                📋 描述
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedMetricDetail.description}
            </p>
          </div>
        )}

        {/* Data Source */}
        {selectedMetricDetail.dataSource && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Link2 size={12} style={{ color: 'var(--accent-green)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                数据来源
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--accent-blue)' }}>
              {selectedMetricDetail.dataSource}
            </p>
          </div>
        )}

        {/* Enhancements */}
        {selectedMetricDetail.enhancements && selectedMetricDetail.enhancements.length > 0 && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={12} style={{ color: 'var(--accent-orange)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                可增强方向
              </span>
            </div>
            <ul className="space-y-1">
              {selectedMetricDetail.enhancements.map((item, index) => (
                <li
                  key={index}
                  className="text-sm flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--accent-orange)' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="p-4 flex gap-2"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <button
          onClick={() => toggleMetricSelection(selectedMetricDetail.id)}
          className="flex-1 py-2 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--accent-blue)',
            color: isSelected ? 'var(--text-secondary)' : 'white',
          }}
        >
          {isSelected ? '取消选择' : '选择'}
        </button>
      </div>
    </div>
  );
}

// Integration Records List
function IntegrationRecordsList() {
  const { integrationRecords } = useMetricsStore();

  if (integrationRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <History size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          暂无集成记录
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {integrationRecords.map((record) => (
        <div
          key={record.id}
          className="p-3 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {record.name}
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            {record.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {record.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 text-xs rounded"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {record.createdBy} · {new Date(record.createdAt).toLocaleDateString('zh-CN')}
          </div>
        </div>
      ))}
    </div>
  );
}

// DB Link Placeholder
function DBLinkSection() {
  return (
    <div className="p-4">
      <div
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px dashed var(--border-light)' }}
      >
        <Database size={32} style={{ color: 'var(--text-muted)', margin: '0 auto' }} />
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          链接外部数据库
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          支持 PostgreSQL, MySQL, Oracle
        </p>
        <button
          className="mt-3 px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
        >
          添加连接
        </button>
      </div>
    </div>
  );
}

export function QueryTab() {
  const { querySubTab, setQuerySubTab, metricsTree, selectedMetricDetail } = useMetricsStore();

  return (
    <div className="h-full flex flex-col relative">
      {/* Sub Tabs */}
      <div
        className="flex px-2 py-2 gap-1"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = querySubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setQuerySubTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={12} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {querySubTab === 'db' && <DBLinkSection />}
        {querySubTab === 'metrics' && (
          <div className="py-2">
            {metricsTree.map((node) => (
              <MetricTreeNode key={node.id} node={node} level={0} />
            ))}
          </div>
        )}
        {querySubTab === 'records' && <IntegrationRecordsList />}
      </div>

      {/* Metric Detail Overlay */}
      {selectedMetricDetail && <MetricDetailPanel />}
    </div>
  );
}
