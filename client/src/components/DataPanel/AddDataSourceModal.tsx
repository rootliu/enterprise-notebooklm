import * as Dialog from '@radix-ui/react-dialog';
import { X, FileSpreadsheet, Database, FileText, Globe, Upload } from 'lucide-react';
import { useState } from 'react';
import { useUIStore, useDataSourceStore } from '../../store';
import type { DataSource } from '../../types';

type Step = 'select' | 'csv' | 'database' | 'pdf' | 'web';

export function AddDataSourceModal() {
  const { activeModal, closeModal } = useUIStore();
  const { addDataSource } = useDataSourceStore();
  const [step, setStep] = useState<Step>('select');
  const [isUploading, setIsUploading] = useState(false);

  const isOpen = activeModal === 'addDataSource';

  const handleClose = () => {
    closeModal();
    setTimeout(() => setStep('select'), 200);
  };

  const handleFileUpload = (type: 'csv' | 'pdf') => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      const newSource: DataSource = {
        id: `new-${Date.now()}`,
        name: type === 'csv' ? 'uploaded_data.csv' : 'uploaded_doc.pdf',
        type: 'file',
        format: type,
        summary: 'Analyzing data source...',
        tags: [],
        rowCount: type === 'csv' ? 500 : undefined,
        columnCount: type === 'csv' ? 8 : undefined,
        fileSize: type === 'csv' ? '1.2 MB' : '3.5 MB',
        lastUpdated: new Date(),
        status: 'connected',
      };
      addDataSource(newSource);
      setIsUploading(false);
      handleClose();
    }, 1500);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[480px] max-h-[85vh] overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {step === 'select' && 'Add Data Source'}
              {step === 'csv' && 'Upload CSV File'}
              {step === 'database' && 'Connect to Database'}
              {step === 'pdf' && 'Upload PDF Document'}
              {step === 'web' && 'Add Web Data Source'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4">
            {step === 'select' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex flex-col items-center gap-2 p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => setStep('csv')}
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet size={24} className="text-emerald-600" />
                  </div>
                  <span className="font-medium text-gray-900">CSV</span>
                </button>

                <button
                  className="flex flex-col items-center gap-2 p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => setStep('database')}
                >
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Database size={24} className="text-violet-600" />
                  </div>
                  <span className="font-medium text-gray-900">Database</span>
                </button>

                <button
                  className="flex flex-col items-center gap-2 p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => setStep('pdf')}
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-900">PDF</span>
                </button>

                <button
                  className="flex flex-col items-center gap-2 p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => setStep('web')}
                >
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Globe size={24} className="text-cyan-600" />
                  </div>
                  <span className="font-medium text-gray-900">Web</span>
                </button>
              </div>
            )}

            {(step === 'csv' || step === 'pdf') && (
              <div>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => handleFileUpload(step)}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag & drop your {step.toUpperCase()} file here
                      </p>
                      <p className="text-xs text-gray-400">
                        or click to browse (max 100MB)
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setStep('select')}
                  >
                    Back
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => handleFileUpload(step)}
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}

            {step === 'database' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Database Type
                  </label>
                  <div className="flex gap-3">
                    {['PostgreSQL', 'MySQL', 'SQLite'].map((db) => (
                      <label
                        key={db}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="dbType"
                          className="text-blue-500"
                          defaultChecked={db === 'PostgreSQL'}
                        />
                        <span className="text-sm text-gray-700">{db}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Host
                    </label>
                    <input
                      type="text"
                      placeholder="localhost"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Port
                    </label>
                    <input
                      type="text"
                      placeholder="5432"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Database
                  </label>
                  <input
                    type="text"
                    placeholder="mydb"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="admin"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setStep('select')}
                  >
                    Back
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    Test Connection
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Connect
                  </button>
                </div>
              </div>
            )}

            {step === 'web' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.example.com/data"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Method
                  </label>
                  <div className="flex gap-3">
                    {['GET', 'POST'].map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="method"
                          className="text-blue-500"
                          defaultChecked={method === 'GET'}
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headers (optional)
                  </label>
                  <textarea
                    placeholder='{"Authorization": "Bearer ..."}'
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setStep('select')}
                  >
                    Back
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Fetch Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
