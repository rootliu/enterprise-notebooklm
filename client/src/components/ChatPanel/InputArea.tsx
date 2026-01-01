import { Send, Paperclip, Table, Tag, X } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useChatStore, useDataSourceStore } from '../../store';

export function InputArea() {
  const { inputValue, setInputValue, sendMessage, isLoading } = useChatStore();
  const { dataSources, selectedIds, toggleSelection } = useDataSourceStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedSources = dataSources.filter((s) => selectedIds.includes(s.id));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Selected Sources */}
      {selectedSources.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-sm text-gray-500">Active sources:</span>
          {selectedSources.map((source) => (
            <span
              key={source.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {source.name}
              <button
                className="hover:text-blue-900"
                onClick={() => toggleSelection(source.id)}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your data..."
          rows={1}
          className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Paperclip size={16} />
          File
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Table size={16} />
          Table
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Tag size={16} />
          Tag
        </button>
      </div>
    </div>
  );
}
