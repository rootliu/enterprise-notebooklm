import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function ToolButton({ icon: Icon, label, sublabel, disabled, onClick }: Props) {
  return (
    <button
      className={clsx(
        'w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg text-left transition-all',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-gray-600" />
      </div>
      <div>
        <div className="font-medium text-gray-800 text-base">{label}</div>
        {sublabel && (
          <div className="text-sm text-gray-500">{sublabel}</div>
        )}
      </div>
    </button>
  );
}
