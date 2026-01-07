import { useState } from 'react';
import {
  Database,
  FileText,
  MessageSquare,
  Globe,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Table,
} from 'lucide-react';
import { useMetricsStore } from '../../store/metricsStore';

const sourceTypeIcons: Record<string, React.ElementType> = {
  metric: Database,
  file: FileText,
  im: MessageSquare,
  web: Globe,
};

const sourceTypeColors: Record<string, string> = {
  metric: 'var(--accent-blue)',
  file: 'var(--accent-green)',
  im: 'var(--accent-purple)',
  web: 'var(--accent-orange)',
};

export function IntegrationReportView() {
  const {
    currentIntegration,
    isIntegrating,
    confirmIntegration,
    cancelIntegration,
  } = useMetricsStore();
  const [showTable, setShowTable] = useState(true);
  const [showChart, setShowChart] = useState(true);

  if (isIntegrating) {
    return (
      <div
        className="rounded-xl p-6 mb-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2
            size={40}
            className="animate-spin mb-4"
            style={{ color: 'var(--accent-blue)' }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Agent 正在分析并集成数据...
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            分析列结构、匹配字段、生成图表
          </p>
        </div>
      </div>
    );
  }

  if (!currentIntegration) {
    return null;
  }

  const { name, description, sources, tags, tableData, chartConfig } = currentIntegration;

  return (
    <div
      className="rounded-xl overflow-hidden mb-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-blue)' + '20' }}
            >
              <Database size={20} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={cancelIntegration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
              }}
            >
              <X size={14} />
              取消
            </button>
            <button
              onClick={confirmIntegration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
              }}
            >
              <Check size={14} />
              确认保存
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-full"
              style={{
                backgroundColor: 'var(--accent-blue)' + '20',
                color: 'var(--accent-blue)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sources */}
        <div className="flex flex-wrap gap-2 mt-3">
          {sources.map((source) => {
            const Icon = sourceTypeIcons[source.type] || Database;
            const color = sourceTypeColors[source.type] || 'var(--text-muted)';
            return (
              <div
                key={source.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                style={{
                  backgroundColor: color + '15',
                  color: color,
                }}
              >
                <Icon size={12} />
                {source.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Section */}
      <div style={{ borderBottom: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full flex items-center justify-between px-4 py-2 transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center gap-2">
            <Table size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              数据表格
            </span>
          </div>
          {showTable ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </button>

        {showTable && tableData && (
          <div className="p-4 overflow-x-auto">
            <table
              className="w-full text-xs"
              style={{ borderCollapse: 'collapse' }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  {tableData.columns.map((col, index) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left font-medium"
                      style={{
                        color: 'var(--text-primary)',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)',
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2"
                        style={{
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--border-color)',
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div>
        <button
          onClick={() => setShowChart(!showChart)}
          className="w-full flex items-center justify-between px-4 py-2 transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              图表分析
            </span>
          </div>
          {showChart ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </button>

        {showChart && chartConfig && (
          <div className="p-4">
            {/* Mock Chart Visualization */}
            <div
              className="rounded-lg p-4 h-48 flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <div className="flex items-end gap-2 h-32">
                {chartConfig.data.map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-8 rounded-t transition-all"
                      style={{
                        height: `${(value / Math.max(...chartConfig.data)) * 100}%`,
                        backgroundColor: chartConfig.colors[index % chartConfig.colors.length],
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {chartConfig.labels[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p
              className="text-xs text-center mt-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {chartConfig.title}
            </p>
          </div>
        )}
      </div>

      {/* Discussion prompt */}
      <div
        className="px-4 py-3"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          💬 关于这个集成报表有什么问题？可以在下方输入框中讨论...
        </p>
      </div>
    </div>
  );
}
