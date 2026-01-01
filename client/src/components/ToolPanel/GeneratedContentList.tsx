import {
  FileText,
  Image,
  Presentation,
  FileSpreadsheet,
  Mic,
  Database,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useGeneratedContentStore } from '../../store';
import type { GeneratedContent } from '../../types';

const typeIcons = {
  report: FileText,
  brief: Image,
  ppt: Presentation,
  csv: FileSpreadsheet,
  podcast: Mic,
  datasource: Database,
};

const typeLabels = {
  report: 'Report',
  brief: 'Brief',
  ppt: 'Presentation',
  csv: 'Export',
  podcast: 'Podcast',
  datasource: 'Data Source',
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

interface ContentItemProps {
  content: GeneratedContent;
}

function ContentItem({ content }: ContentItemProps) {
  const { removeContent } = useGeneratedContentStore();
  const Icon = typeIcons[content.type];

  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200">
        <Icon size={20} className="text-gray-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 text-base truncate">
          {content.name}
        </div>
        <div className="text-sm text-gray-500">
          {typeLabels[content.type]} · {formatTimeAgo(content.createdAt)}
        </div>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={16} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50"
            align="end"
          >
            <DropdownMenu.Item className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer outline-none">
              <ExternalLink size={16} />
              Open
            </DropdownMenu.Item>
            <DropdownMenu.Item className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer outline-none">
              <Download size={16} />
              Download
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
            <DropdownMenu.Item
              className="flex items-center gap-2 px-4 py-2 text-base text-red-600 hover:bg-red-50 cursor-pointer outline-none"
              onClick={() => removeContent(content.id)}
            >
              <Trash2 size={16} />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export function GeneratedContentList() {
  const { contents } = useGeneratedContentStore();

  if (contents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-base">
        No generated content yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {contents.map((content) => (
        <ContentItem key={content.id} content={content} />
      ))}
    </div>
  );
}
