interface Props {
  title: string;
}

export function ToolCategory({ title }: Props) {
  return (
    <div className="flex items-center gap-2 mx-4 my-3">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
