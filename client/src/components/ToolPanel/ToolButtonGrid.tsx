import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  icon: LucideIcon;
  label: string;
  color?: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}

export function ToolButtonGrid({
  icon: Icon,
  label,
  color = '#6B7280',
  disabled,
  comingSoon,
  onClick
}: Props) {
  const isDisabled = disabled || comingSoon;

  return (
    <button
      className={clsx(
        'flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl transition-all min-h-[80px]',
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md cursor-pointer active:translate-y-0'
      )}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      <div
        className="w-9 h-9 flex items-center justify-center mb-2"
        style={{ color }}
      >
        <Icon size={24} />
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {label}
      </span>
      {comingSoon && (
        <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded mt-1">
          Soon
        </span>
      )}
    </button>
  );
}
