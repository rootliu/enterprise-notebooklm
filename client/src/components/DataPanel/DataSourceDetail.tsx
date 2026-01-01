import { ArrowLeft, FileSpreadsheet, Database, FileText, Globe } from 'lucide-react';
import { useDataSourceStore } from '../../store';
import type { DataSource } from '../../types';

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

const formatLabels = {
  csv: 'CSV File',
  excel: 'Excel File',
  json: 'JSON File',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  pdf: 'PDF Document',
  api: 'Web API',
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return date.toLocaleDateString();
}

interface Props {
  source: DataSource;
}

export function DataSourceDetail({ source }: Props) {
  const { setCurrentDetail } = useDataSourceStore();
  const Icon = formatIcons[source.format] || FileSpreadsheet;

  // Mock schema data
  const mockSchema = [
    { name: 'date', type: 'date', nullable: false, nullRate: '0%' },
    { name: 'revenue', type: 'number', nullable: true, nullRate: '2%' },
    { name: 'region', type: 'string', nullable: false, nullRate: '0%' },
    { name: 'product', type: 'string', nullable: false, nullRate: '0%' },
    { name: 'units', type: 'number', nullable: true, nullRate: '5%' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 mb-3 transition-colors"
          onClick={() => setCurrentDetail(null)}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon size={20} className="text-gray-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{source.name}</h2>
            <p className="text-xs text-gray-500">
              {formatLabels[source.format]}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          {source.rowCount && (
            <span>{source.rowCount.toLocaleString()} rows</span>
          )}
          {source.columnCount && <span>·</span>}
          {source.columnCount && <span>{source.columnCount} columns</span>}
          {source.fileSize && <span>·</span>}
          {source.fileSize && <span>{source.fileSize}</span>}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Last updated: {formatTimeAgo(source.lastUpdated)}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Summary */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {source.summary}
          </p>
        </div>

        {/* Schema */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Schema
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 font-medium text-gray-600">
                    Column
                  </th>
                  <th className="text-left py-2 pr-3 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Null
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockSchema.map((col) => (
                  <tr key={col.name} className="border-b border-gray-50">
                    <td className="py-1.5 pr-3 text-gray-900 font-mono">
                      {col.name}
                    </td>
                    <td className="py-1.5 pr-3 text-gray-600">{col.type}</td>
                    <td className="py-1.5 text-gray-400">{col.nullRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {source.columnCount && source.columnCount > 5 && (
            <button className="mt-2 text-xs text-blue-600 hover:text-blue-700">
              View all {source.columnCount} columns
            </button>
          )}
        </div>

        {/* Statistics */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Statistics
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 font-mono">revenue</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Min:</span>{' '}
                  <span className="text-gray-700">¥1,234</span>
                </div>
                <div>
                  <span className="text-gray-400">Max:</span>{' '}
                  <span className="text-gray-700">¥98,765</span>
                </div>
                <div>
                  <span className="text-gray-400">Mean:</span>{' '}
                  <span className="text-gray-700">¥45,678</span>
                </div>
                <div>
                  <span className="text-gray-400">Median:</span>{' '}
                  <span className="text-gray-700">¥42,000</span>
                </div>
              </div>
              <div className="mt-2 h-6 flex items-end gap-0.5">
                {[2, 4, 6, 8, 10, 9, 7, 5, 4, 3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-400 rounded-t"
                    style={{ height: `${h * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {source.tags.map((tag) => (
              <button
                key={tag.id}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {tag.name}
              </button>
            ))}
            <button className="px-2 py-0.5 text-xs bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors">
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
