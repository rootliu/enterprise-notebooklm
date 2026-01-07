import { Database, MessageSquare, FolderOpen, Layers, X } from 'lucide-react';
import { useMetricsStore } from '../../store';
import { QueryTab } from './QueryTab';
import { IMTab } from './IMTab';
import { OfflineTab } from './OfflineTab';

type TabType = 'query' | 'im' | 'offline';

const tabs: { id: TabType; name: string; icon: React.ElementType }[] = [
  { id: 'query', name: 'Query', icon: Database },
  { id: 'im', name: 'IM', icon: MessageSquare },
  { id: 'offline', name: '离线', icon: FolderOpen },
];

export function DataPanel() {
  const {
    activeTab,
    setActiveTab,
    getSelectionCount,
    clearAllSelections,
    startIntegration,
    isIntegrating,
  } = useMetricsStore();

  const selectionCount = getSelectionCount();

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          数据源
        </h2>
        {selectionCount > 0 && (
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 text-xs rounded"
              style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
            >
              {selectionCount} 已选
            </span>
            <button
              onClick={clearAllSelections}
              className="p-1 rounded transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Square Tab Buttons - Text on top, Icon below */}
      <div
        className="px-3 py-3 flex gap-2"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? 'var(--bg-active)' : 'var(--bg-tertiary)',
                border: isActive ? '1px solid var(--accent-blue)' : '1px solid transparent',
              }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {tab.name}
              </span>
              <Icon
                size={20}
                style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)' }}
              />
            </button>
          );
        })}
      </div>

      {/* Integration Button - Only show when items selected */}
      {selectionCount > 0 && (
        <div className="px-3 py-2">
          <button
            onClick={startIntegration}
            disabled={isIntegrating}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors disabled:opacity-70"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            {isIntegrating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">集成中...</span>
              </>
            ) : (
              <>
                <Layers size={16} />
                <span className="text-sm">集成 ({selectionCount})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'query' && <QueryTab />}
        {activeTab === 'im' && <IMTab />}
        {activeTab === 'offline' && <OfflineTab />}
      </div>
    </div>
  );
}
