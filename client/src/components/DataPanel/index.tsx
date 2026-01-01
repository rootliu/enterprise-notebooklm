import { useDataSourceStore } from '../../store';
import { DataSourceList } from './DataSourceList';
import { DataSourceDetail } from './DataSourceDetail';
import { AddDataSourceModal } from './AddDataSourceModal';

export function DataPanel() {
  const { dataSources, currentDetailId, viewMode } = useDataSourceStore();
  const currentSource = dataSources.find((s) => s.id === currentDetailId);

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {viewMode === 'detail' && currentSource ? (
        <DataSourceDetail source={currentSource} />
      ) : (
        <DataSourceList />
      )}
      <AddDataSourceModal />
    </div>
  );
}
