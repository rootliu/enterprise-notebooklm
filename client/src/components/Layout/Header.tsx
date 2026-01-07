import { Settings, HelpCircle, User, Database } from 'lucide-react';

export function Header() {
  return (
    <header
      className="h-14 px-5 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-blue)' }}
        >
          <Database size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Enterprise NotebookLM
          </h1>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>ERP Edition</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title="Help"
        >
          <HelpCircle size={20} />
        </button>
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
          title="User"
        >
          <User size={18} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </header>
  );
}
