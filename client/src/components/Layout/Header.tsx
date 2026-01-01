import { Settings, HelpCircle, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Enterprise NotebookLM
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Help"
        >
          <HelpCircle size={22} />
        </button>
        <button
          className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings size={22} />
        </button>
        <button
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          title="User"
        >
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
}
