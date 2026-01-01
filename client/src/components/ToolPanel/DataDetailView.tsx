import { ArrowLeft, MessageSquare, Download, ExternalLink } from 'lucide-react';
import { useUIStore } from '../../store';

export function DataDetailView() {
  const { dataDetail, setDataDetail } = useUIStore();

  if (!dataDetail) return null;

  // Mock data for the detail view
  const mockData = [
    { row: 45, revenue: '¥12,345', region: '华东', product: 'Product A' },
    { row: 46, revenue: '¥23,456', region: '华东', product: 'Product B' },
    { row: 47, revenue: '¥34,567', region: '华南', product: 'Product A' },
    { row: 48, revenue: '¥45,678', region: '华北', product: 'Product C' },
    { row: 49, revenue: '¥56,789', region: '华东', product: 'Product B' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 mb-3 transition-colors"
          onClick={() => setDataDetail(null)}
        >
          <ArrowLeft size={16} />
          Tools
        </button>

        <h2 className="font-semibold text-gray-900">Data Detail</h2>
        <p className="text-sm text-gray-500 mt-1">
          Source: {dataDetail.dataSourceName}
        </p>
        <p className="text-xs text-gray-400">
          Rows: {dataDetail.rows[0]}-{dataDetail.rows[1]}
          {dataDetail.columns.length > 0 && (
            <> · Columns: {dataDetail.columns.join(', ')}</>
          )}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Data Preview */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Data Preview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 font-medium text-gray-600">
                    Row
                  </th>
                  <th className="text-left py-2 pr-3 font-medium text-gray-600">
                    Revenue
                  </th>
                  <th className="text-left py-2 pr-3 font-medium text-gray-600">
                    Region
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Product
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((row, index) => (
                  <tr
                    key={row.row}
                    className={`border-b border-gray-50 ${
                      index < 2 ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-1.5 pr-3 text-gray-400">{row.row}</td>
                    <td className="py-1.5 pr-3 text-gray-900 font-mono">
                      {row.revenue}
                    </td>
                    <td className="py-1.5 pr-3 text-gray-700">{row.region}</td>
                    <td className="py-1.5 text-gray-700">{row.product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column Stats */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Column Stats (Selected Range)
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 font-mono mb-1">revenue</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Sum:</span>{' '}
                  <span className="text-gray-700">¥172,835</span>
                </div>
                <div>
                  <span className="text-gray-400">Avg:</span>{' '}
                  <span className="text-gray-700">¥34,567</span>
                </div>
                <div>
                  <span className="text-gray-400">Min:</span>{' '}
                  <span className="text-gray-700">¥12,345</span>
                </div>
                <div>
                  <span className="text-gray-400">Max:</span>{' '}
                  <span className="text-gray-700">¥56,789</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <MessageSquare size={16} />
              Ask about this data
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Download size={16} />
              Export selection
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ExternalLink size={16} />
              View full dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
