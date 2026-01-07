import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message, Citation } from '../../types';
import { useUIStore } from '../../store';

interface Props {
  message: Message;
}

export function MessageItem({ message }: Props) {
  const { setDataDetail } = useUIStore();
  const isUser = message.role === 'user';

  const handleCitationClick = (citation: Citation) => {
    setDataDetail({
      dataSourceId: citation.dataSourceId,
      dataSourceName: citation.dataSourceName,
      rows: [citation.location.rowStart || 0, citation.location.rowEnd || 100],
      columns: citation.location.columns || [],
      data: [],
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: isUser ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
        }}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} style={{ color: 'var(--text-secondary)' }} />
        )}
      </div>

      {/* Content */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}
        style={{
          backgroundColor: isUser ? 'var(--accent-blue)' : 'var(--bg-secondary)',
          color: isUser ? 'white' : 'var(--text-primary)',
        }}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm max-w-none prose-invert">
            <ReactMarkdown
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table
                      className="min-w-full text-xs rounded-lg overflow-hidden"
                      style={{ border: '1px solid var(--border-color)' }}
                    >
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>{children}</thead>
                ),
                th: ({ children }) => (
                  <th
                    className="px-3 py-2 text-left font-medium"
                    style={{
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    className="px-3 py-2"
                    style={{
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    {children}
                  </td>
                ),
                h2: ({ children }) => (
                  <h2
                    className="text-base font-semibold mt-4 mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    className="text-sm font-semibold mt-3 mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                ),
                li: ({ children }) => (
                  <li style={{ color: 'var(--text-secondary)' }}>{children}</li>
                ),
                p: ({ children }) => (
                  <p className="my-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic" style={{ color: 'var(--text-muted)' }}>
                    {children}
                  </em>
                ),
                code: ({ children }) => (
                  <code
                    className="px-1 rounded text-xs"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--accent-blue)',
                    }}
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div
            className="mt-2 pt-2"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <div className="flex flex-wrap gap-1.5">
              {message.citations.map((citation, index) => (
                <button
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--accent-blue)',
                  }}
                  onClick={() => handleCitationClick(citation)}
                >
                  <span className="font-medium">{citation.dataSourceName}</span>
                  {citation.location.rowStart && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      :L{citation.location.rowStart}-{citation.location.rowEnd}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
