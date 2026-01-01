import {
  FileText,
  Image,
  Presentation,
  Download,
  Mic,
  PlusCircle,
} from 'lucide-react';
import { useUIStore } from '../../store';
import { ToolButton } from './ToolButton';
import { GeneratedContentList } from './GeneratedContentList';
import { DataDetailView } from './DataDetailView';
import { InsightsReportModal, BriefGeneratorModal, DataExporterModal } from './ToolModals';

export function ToolPanel() {
  const { rightPanelMode, openModal } = useUIStore();

  if (rightPanelMode === 'detail') {
    return (
      <div className="h-full bg-white border-l border-gray-200">
        <DataDetailView />
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Tools Section */}
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900 mb-4">TOOLS</h2>

        <div className="space-y-2">
          <ToolButton
            icon={FileText}
            label="Generate Insights"
            sublabel="Report"
            onClick={() => openModal('insightsReport')}
          />
          <ToolButton
            icon={Image}
            label="Generate One-Page"
            sublabel="Brief"
            onClick={() => openModal('briefGenerator')}
          />
          <ToolButton
            icon={Presentation}
            label="Generate"
            sublabel="Presentation"
            onClick={() => openModal('pptGenerator')}
          />
          <ToolButton
            icon={Download}
            label="Export Data"
            onClick={() => openModal('dataExporter')}
          />
          <ToolButton
            icon={Mic}
            label="Generate Podcast"
            sublabel="Coming Soon"
            disabled
          />
          <ToolButton
            icon={PlusCircle}
            label="Create New"
            sublabel="Data Source"
            onClick={() => openModal('dataSourceCreator')}
          />
        </div>
      </div>

      {/* Generated Content Section */}
      <div className="flex-1 overflow-y-auto p-5">
        <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
          Generated Content
        </h3>
        <GeneratedContentList />
      </div>

      {/* Modals */}
      <InsightsReportModal />
      <BriefGeneratorModal />
      <DataExporterModal />
    </div>
  );
}
