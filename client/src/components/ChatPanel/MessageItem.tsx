import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message, Citation } from '../../types';
import { useUIStore } from '../../store';
import { clsx } from 'clsx';

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
      data: [], // Would be populated from actual data
    });
  };

  return (
    <div
      className={clsx(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-blue-500' : 'bg-gray-200'
        )}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-gray-600" />
        )}
      </div>

      {/* Content */}
      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-gray-600 border-b border-gray-100">
                    {children}
                  </td>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold text-gray-900 mt-4 mb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-gray-800 mt-3 mb-1">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 my-2">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                p: ({ children }) => (
                  <p className="my-2 text-gray-700 leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-600">{children}</em>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-1.5">
              {message.citations.map((citation, index) => (
                <button
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition-colors"
                  onClick={() => handleCitationClick(citation)}
                >
                  <span className="font-medium">{citation.dataSourceName}</span>
                  {citation.location.rowStart && (
                    <span className="text-blue-500">
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
