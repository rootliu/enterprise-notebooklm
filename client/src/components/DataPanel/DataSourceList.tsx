import { Search, Plus, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDataSourceStore, useUIStore } from '../../store';
import { DataSourceCard } from './DataSourceCard';

export function DataSourceList() {
  const {
    dataSources,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedIds,
  } = useDataSourceStore();
  const { openModal } = useUIStore();

  const filteredSources = dataSources
    .filter((source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.tags.some((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.format.localeCompare(b.format);
        default:
          return 0;
      }
    });

  const allTags = Array.from(
    new Map(
      dataSources.flatMap((s) => s.tags).map((t) => [t.id, t])
    ).values()
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">DATA SOURCES</h2>
          {selectedIds.length > 0 && (
            <span className="text-sm bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search data sources..."
            className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Button */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-white text-base font-medium rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => openModal('addDataSource')}
        >
          <Plus size={18} />
          Add Data Source
        </button>
      </div>

      {/* Sort & Filter */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort:</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 transition-colors">
            {sortBy === 'time' && 'Time'}
            {sortBy === 'name' && 'Name'}
            {sortBy === 'type' && 'Type'}
            <ChevronDown size={16} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
              <DropdownMenu.Item
                className="px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                onClick={() => setSortBy('time')}
              >
                Time
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                onClick={() => setSortBy('name')}
              >
                Name
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                onClick={() => setSortBy('type')}
              >
                Type
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Data Source List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSources.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-base">
            No data sources found
          </div>
        ) : (
          filteredSources.map((source) => (
            <DataSourceCard key={source.id} source={source} />
          ))
        )}
      </div>

      {/* Tags Section */}
      <div className="p-5 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 6).map((tag) => (
            <button
              key={tag.id}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {tag.name}
            </button>
          ))}
          {allTags.length > 6 && (
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors">
              +{allTags.length - 6}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
