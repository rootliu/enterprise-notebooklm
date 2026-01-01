import { FileSpreadsheet, Database, FileText, Globe, Sparkles } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import type { DataSource } from '../../types';
import { useDataSourceStore } from '../../store';
import { clsx } from 'clsx';

interface DataSourceCardProps {
  source: DataSource;
}

const formatIcons = {
  csv: FileSpreadsheet,
  excel: FileSpreadsheet,
  json: FileSpreadsheet,
  postgresql: Database,
  mysql: Database,
  sqlite: Database,
  pdf: FileText,
  api: Globe,
};

const formatColors = {
  csv: 'bg-emerald-100 text-emerald-600',
  excel: 'bg-emerald-100 text-emerald-600',
  json: 'bg-emerald-100 text-emerald-600',
  postgresql: 'bg-violet-100 text-violet-600',
  mysql: 'bg-violet-100 text-violet-600',
  sqlite: 'bg-violet-100 text-violet-600',
  pdf: 'bg-amber-100 text-amber-600',
  api: 'bg-cyan-100 text-cyan-600',
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function DataSourceCard({ source }: DataSourceCardProps) {
  const { selectedIds, toggleSelection, setCurrentDetail } = useDataSourceStore();
  const isSelected = selectedIds.includes(source.id);

  const Icon = formatIcons[source.format] || FileSpreadsheet;
  const colorClass = formatColors[source.format] || 'bg-gray-100 text-gray-600';

  const handleClick = () => {
    setCurrentDetail(source.id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={clsx(
        'p-3 border rounded-lg cursor-pointer transition-all',
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Checkbox.Root
          className={clsx(
            'w-4 h-4 mt-1 rounded border flex items-center justify-center transition-colors',
            isSelected
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-300 hover:border-blue-400'
          )}
          checked={isSelected}
          onCheckedChange={() => toggleSelection(source.id)}
          onClick={handleCheckboxClick}
        >
          <Checkbox.Indicator>
            <Check size={12} className="text-white" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <div
          className={clsx(
            'w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0',
            colorClass
          )}
        >
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-base truncate">
            {source.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {source.rowCount && `${source.rowCount.toLocaleString()} rows`}
            {source.rowCount && source.columnCount && ' · '}
            {source.columnCount && `${source.columnCount} cols`}
            {source.fileSize && ` · ${source.fileSize}`}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatTimeAgo(source.lastUpdated)}
          </p>
        </div>

        {source.type === 'generated' && (
          <Sparkles size={14} className="text-pink-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
