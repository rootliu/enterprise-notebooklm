import { useDataSourceStore } from '../../store';

export function StatusBar() {
  const { dataSources } = useDataSourceStore();
  const connectedCount = dataSources.filter(d => d.status === 'connected').length;

  return (
    <footer className="h-8 bg-gray-50 border-t border-gray-200 px-4 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            connectedCount > 0 ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        <span>
          Connected to {connectedCount} data source{connectedCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-400">Last sync: just now</span>
        <span className="text-gray-400">v0.1.0</span>
      </div>
    </footer>
  );
}
