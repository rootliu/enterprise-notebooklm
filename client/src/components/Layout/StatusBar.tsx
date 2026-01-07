import { useMetricsStore } from '../../store';

export function StatusBar() {
  const { selectedMetrics } = useMetricsStore();

  return (
    <footer
      className="h-7 px-4 flex items-center justify-between text-xs"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)'
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: selectedMetrics.length > 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}
        />
        <span>
          {selectedMetrics.length} metric{selectedMetrics.length !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span>Agent: Ready</span>
        <span>v0.2.0-erp</span>
      </div>
    </footer>
  );
}
