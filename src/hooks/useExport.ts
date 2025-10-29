import { useState } from 'react';
import type { ExportData, ExportColumn, ExportDateConfig } from '../types/export';

interface UseExportOptions {
  data: ExportData[];
  columns: ExportColumn[];
  title?: string;
  filename?: string;
  dateConfig?: ExportDateConfig;
  onExport?: (format: 'pdf' | 'csv', dateRange: { start?: Date; end?: Date }) => void;
}

export const useExport = ({
  data,
  columns,
  title = "Export Data",
  filename = "export",
  dateConfig,
  onExport,
}: UseExportOptions) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };

  const exportProps = {
    isOpen: isExportModalOpen,
    onClose: closeExportModal,
    data,
    columns,
    title,
    filename,
    dateConfig,
    onExport,
  };

  return {
    isExportModalOpen,
    openExportModal,
    closeExportModal,
    exportProps,
  };
};
