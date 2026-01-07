import { MessageSquare, User, Paperclip, Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useMetricsStore, type IMMessage } from '../../store/metricsStore';

const platformColors: Record<string, string> = {
  feishu: '#3370ff',
  wecom: '#07c160',
  email: 'var(--accent-orange)',
};

const platformNames: Record<string, string> = {
  feishu: '飞书',
  wecom: '企微',
  email: '邮件',
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${diffDays}天前`;
}

// IM Message Card - WeChat Merged Message Style
function IMMessageCard({ message }: { message: IMMessage }) {
  const { selectedIMMessages, toggleIMSelection, selectedIMDetail, setSelectedIMDetail } =
    useMetricsStore();

  const isSelected = selectedIMMessages.includes(message.id);
  const isExpanded = selectedIMDetail?.id === message.id;
  const color = platformColors[message.platform];

  const handleToggle = () => {
    if (isExpanded) {
      setSelectedIMDetail(null);
    } else {
      setSelectedIMDetail(message);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleIMSelection(message.id);
  };

  return (
    <div
      className="rounded-lg overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent',
      }}
    >
      {/* Header - WeChat Merged Message Style */}
      <div
        className="p-3 cursor-pointer"
        onClick={handleToggle}
      >
        {/* Sender Info */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <User size={14} style={{ color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {message.sender}
              </span>
              <span
                className="px-1.5 py-0.5 text-xs rounded"
                style={{ backgroundColor: color + '20', color }}
              >
                {platformNames[message.platform]}
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {message.department}
            </span>
          </div>
          {/* Selection Checkbox */}
          <button
            onClick={handleSelect}
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--bg-hover)',
              border: isSelected ? 'none' : '1px solid var(--border-light)',
            }}
          >
            {isSelected && <Check size={12} className="text-white" />}
          </button>
        </div>

        {/* Summary */}
        <p
          className="text-sm mb-2 line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {message.summary}
        </p>

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Paperclip size={12} style={{ color: 'var(--text-muted)' }} />
            {message.attachments.map((att, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 text-xs rounded"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                {att.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Clock size={10} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatTimeAgo(message.timestamp)}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </div>

      {/* Expanded Detail - Summary and Tags */}
      {isExpanded && (
        <div
          className="px-3 pb-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div className="pt-3">
            {/* Full Content */}
            {message.fullContent && (
              <div className="mb-3">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  完整内容
                </span>
                <p
                  className="mt-1 text-sm whitespace-pre-line"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {message.fullContent}
                </p>
              </div>
            )}

            {/* Tags */}
            <div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                标签
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {message.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: 'var(--accent-blue)' + '20', color: 'var(--accent-blue)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function IMTab() {
  const { imMessages } = useMetricsStore();

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2">
      {imMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <MessageSquare size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            暂无 IM 消息
          </p>
        </div>
      ) : (
        imMessages.map((message) => (
          <IMMessageCard key={message.id} message={message} />
        ))
      )}
    </div>
  );
}
