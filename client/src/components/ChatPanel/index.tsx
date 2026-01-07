import { useRef, useEffect } from 'react';
import { useChatStore, useMetricsStore } from '../../store';
import { MessageItem } from './MessageItem';
import { InputArea } from './InputArea';
import { IntegrationReportView } from './IntegrationReportView';

export function ChatPanel() {
  const { messages, isLoading } = useChatStore();
  const { currentIntegration, isIntegrating } = useMetricsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Integration Report */}
        {(currentIntegration || isIntegrating) && (
          <IntegrationReportView />
        )}

        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{
                  borderColor: 'var(--text-muted)',
                  borderTopColor: 'transparent',
                }}
              />
            </div>
            <div
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: 'var(--text-muted)', animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: 'var(--text-muted)', animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: 'var(--text-muted)', animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea />
    </div>
  );
}
