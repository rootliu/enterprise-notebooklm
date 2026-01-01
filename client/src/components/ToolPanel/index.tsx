import {
  TrendingUp,
  Spline,
  Sparkles,
  AlertTriangle,
  BarChart3,
  GitMerge,
  FileText,
  FileImage,
  Presentation,
  Headphones,
  Download,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { useUIStore } from '../../store';
import { ToolButtonGrid } from './ToolButtonGrid';
import { ToolCategory } from './ToolCategory';
import { GeneratedContentList } from './GeneratedContentList';
import { DataDetailView } from './DataDetailView';
import { InsightsReportModal, BriefGeneratorModal, DataExporterModal } from './ToolModals';

// Tool colors
const COLORS = {
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  red: '#EF4444',
  green: '#10B981',
  cyan: '#06B6D4',
  pink: '#EC4899',
  gray: '#6B7280',
};

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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">STUDIO</h2>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
          <Settings size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Tools Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Data Analysis */}
        <ToolCategory title="Data Analysis" />
        <div className="grid grid-cols-2 gap-3 px-4">
          <ToolButtonGrid
            icon={TrendingUp}
            label="Predict"
            color={COLORS.blue}
            onClick={() => openModal('prediction')}
          />
          <ToolButtonGrid
            icon={Spline}
            label="Fit"
            color={COLORS.purple}
            onClick={() => openModal('curveFitting')}
          />
          <ToolButtonGrid
            icon={Sparkles}
            label="Features"
            color={COLORS.orange}
            onClick={() => openModal('featureExtraction')}
          />
          <ToolButtonGrid
            icon={AlertTriangle}
            label="Anomaly"
            color={COLORS.red}
            onClick={() => openModal('anomalyDetection')}
          />
          <ToolButtonGrid
            icon={BarChart3}
            label="Stats"
            color={COLORS.green}
            onClick={() => openModal('statisticalAnalysis')}
          />
          <ToolButtonGrid
            icon={GitMerge}
            label="Correlate"
            color={COLORS.cyan}
            onClick={() => openModal('correlationAnalysis')}
          />
        </div>

        {/* Content Generation */}
        <ToolCategory title="Content Generation" />
        <div className="grid grid-cols-2 gap-3 px-4">
          <ToolButtonGrid
            icon={FileText}
            label="Report"
            color={COLORS.blue}
            onClick={() => openModal('insightsReport')}
          />
          <ToolButtonGrid
            icon={FileImage}
            label="Brief"
            color={COLORS.purple}
            onClick={() => openModal('briefGenerator')}
          />
          <ToolButtonGrid
            icon={Presentation}
            label="PPT"
            color={COLORS.orange}
            onClick={() => openModal('pptGenerator')}
          />
          <ToolButtonGrid
            icon={Headphones}
            label="Audio"
            color={COLORS.pink}
            comingSoon
          />
        </div>

        {/* Data Operations */}
        <ToolCategory title="Data Operations" />
        <div className="grid grid-cols-2 gap-3 px-4 mb-4">
          <ToolButtonGrid
            icon={Download}
            label="Export"
            color={COLORS.gray}
            onClick={() => openModal('dataExporter')}
          />
          <ToolButtonGrid
            icon={PlusCircle}
            label="Create"
            color={COLORS.green}
            onClick={() => openModal('dataSourceCreator')}
          />
        </div>

        {/* Generated Content Section */}
        <div className="border-t border-gray-200 mt-2">
          <div className="px-4 py-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Generated Content
            </h3>
          </div>
          <div className="px-4 pb-4">
            <GeneratedContentList />
          </div>
        </div>
      </div>

      {/* Modals */}
      <InsightsReportModal />
      <BriefGeneratorModal />
      <DataExporterModal />
    </div>
  );
}
