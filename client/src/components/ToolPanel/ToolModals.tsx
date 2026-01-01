import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import { X, Check } from 'lucide-react';
import { useState } from 'react';
import { useUIStore, useGeneratedContentStore } from '../../store';
import type { GeneratedContent } from '../../types';

export function InsightsReportModal() {
  const { activeModal, closeModal } = useUIStore();
  const { addContent } = useGeneratedContentStore();
  const [title, setTitle] = useState('Analysis Report');
  const [sections, setSections] = useState({
    executive: true,
    dataOverview: true,
    analysis: true,
    insights: true,
    recommendations: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const isOpen = activeModal === 'insightsReport';

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: `report-${Date.now()}`,
        type: 'report',
        name: `${title}.md`,
        createdAt: new Date(),
      };
      addContent(newContent);
      setIsGenerating(false);
      closeModal();
    }, 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[420px] max-h-[85vh] overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Generate Insights Report
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sections
              </label>
              <div className="space-y-2">
                {[
                  { key: 'executive', label: 'Executive Summary' },
                  { key: 'dataOverview', label: 'Data Overview' },
                  { key: 'analysis', label: 'Analysis Details' },
                  { key: 'insights', label: 'Key Insights' },
                  { key: 'recommendations', label: 'Recommendations' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox.Root
                      className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      checked={sections[key as keyof typeof sections]}
                      onCheckedChange={(checked) =>
                        setSections({ ...sections, [key]: checked })
                      }
                    >
                      <Checkbox.Indicator>
                        <Check size={12} className="text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['revenue', 'growth', 'region'].map((tag) => (
                  <button
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {tag}
                  </button>
                ))}
                <button className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200">
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function BriefGeneratorModal() {
  const { activeModal, closeModal } = useUIStore();
  const { addContent } = useGeneratedContentStore();
  const [title, setTitle] = useState('Q3 Sales Brief');
  const [isGenerating, setIsGenerating] = useState(false);

  const isOpen = activeModal === 'briefGenerator';

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: `brief-${Date.now()}`,
        type: 'brief',
        name: `${title}.pdf`,
        createdAt: new Date(),
      };
      addContent(newContent);
      setIsGenerating(false);
      closeModal();
    }, 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[420px] max-h-[85vh] overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Generate One-Page Brief
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option>Executive Summary</option>
                <option>Sales Report</option>
                <option>Marketing Brief</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Metrics (select 2-4)
              </label>
              <div className="space-y-2">
                {[
                  { label: 'Total Revenue', value: '¥6.8M', checked: true },
                  { label: 'Growth Rate', value: '+15%', checked: true },
                  { label: 'Customer Count', value: '1,234', checked: false },
                  { label: 'Avg Order Value', value: '¥5,500', checked: false },
                ].map((metric) => (
                  <label
                    key={metric.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox.Root
                      className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      defaultChecked={metric.checked}
                    >
                      <Checkbox.Indicator>
                        <Check size={12} className="text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-sm text-gray-700">
                      {metric.label}: <span className="font-medium">{metric.value}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Brief'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DataExporterModal() {
  const { activeModal, closeModal } = useUIStore();
  const { addContent } = useGeneratedContentStore();
  const [isExporting, setIsExporting] = useState(false);

  const isOpen = activeModal === 'dataExporter';

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: `export-${Date.now()}`,
        type: 'csv',
        name: 'exported_data.csv',
        createdAt: new Date(),
      };
      addContent(newContent);
      setIsExporting(false);
      closeModal();
    }, 1500);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[420px] max-h-[85vh] overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Export Data
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Data
              </label>
              <div className="space-y-2">
                {[
                  { label: 'sales_2024.csv (full)', checked: true },
                  { label: 'customer_db (filtered)', checked: false },
                ].map((source) => (
                  <label
                    key={source.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox.Root
                      className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      defaultChecked={source.checked}
                    >
                      <Checkbox.Indicator>
                        <Check size={12} className="text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-sm text-gray-700">{source.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Results
              </label>
              <div className="space-y-2">
                {[
                  { label: 'Monthly Summary Table', checked: true },
                  { label: 'Regional Breakdown', checked: true },
                ].map((result) => (
                  <label
                    key={result.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox.Root
                      className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      defaultChecked={result.checked}
                    >
                      <Checkbox.Indicator>
                        <Check size={12} className="text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-sm text-gray-700">{result.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    className="text-blue-500"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">CSV</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" className="text-blue-500" />
                  <span className="text-sm text-gray-700">Excel</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export Selected'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
