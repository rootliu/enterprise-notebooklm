import { ChevronRight, FileText, BarChart2, TrendingUp, Layers, Lightbulb, Check } from 'lucide-react';
import { useMetricsStore } from '../../store';
import type { MetricNode } from '../../types';

const categoryIcons: Record<string, React.ElementType> = {
  standard: FileText,
  kpi: BarChart2,
  forecast: TrendingUp,
  module: Layers,
  insight: Lightbulb,
};

const categoryColors: Record<string, string> = {
  standard: 'var(--accent-blue)',
  kpi: 'var(--accent-green)',
  forecast: 'var(--accent-orange)',
  module: 'var(--accent-purple)',
  insight: 'var(--accent-cyan)',
};

interface TreeNodeProps {
  node: MetricNode;
  level: number;
}

function TreeNode({ node, level }: TreeNodeProps) {
  const { expandedNodes, toggleNode, selectedMetrics, toggleMetricSelection } = useMetricsStore();
  const isExpanded = expandedNodes.includes(node.id);
  const isSelected = selectedMetrics.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = categoryIcons[node.category] || FileText;
  const color = categoryColors[node.category];

  const handleClick = () => {
    if (node.isLeaf) {
      toggleMetricSelection(node.id);
    } else if (hasChildren) {
      toggleNode(node.id);
    }
  };

  return (
    <div>
      <div
        className="tree-item flex items-center gap-2 cursor-pointer"
        style={{
          paddingLeft: `${12 + level * 16}px`,
          backgroundColor: isSelected ? 'var(--bg-active)' : undefined,
        }}
        onClick={handleClick}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <ChevronRight
            size={14}
            className={`tree-expand-icon flex-shrink-0 ${isExpanded ? 'expanded' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          />
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}

        {/* Category Icon */}
        <Icon size={14} style={{ color, flexShrink: 0 }} />

        {/* Name */}
        <span
          className="flex-1 text-sm truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {node.nameCn}
        </span>

        {/* Selection indicator for leaf nodes */}
        {node.isLeaf && isSelected && (
          <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function MetricsTree() {
  const { metricsTree } = useMetricsStore();

  return (
    <div className="py-2">
      {metricsTree.map((node) => (
        <TreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}
