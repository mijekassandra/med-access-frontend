import React, { useState } from "react";
import Modal from "../global-components/Modal";
import Inputs from "../global-components/Inputs";
import RadioButton from "../global-components/RadioButton";
import type {
  ExportData,
  ExportColumn,
  ExportDateConfig,
} from "../types/export";

// Re-export types for backward compatibility
export type { ExportData, ExportColumn, ExportDateConfig };

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExportData[];
  columns: ExportColumn[];
  title?: string;
  filename?: string;
  dateConfig?: ExportDateConfig;
  onExport?: (
    format: "pdf" | "csv",
    dateRange: { start?: Date; end?: Date }
  ) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  columns,
  title = "Export Data",
  filename = "export",
  dateConfig,
  onExport,
}) => {
  const [dateRangeType, setDateRangeType] = useState<"single" | "range">(
    "single"
  );
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "pdf" | "csv") => {
    setIsExporting(true);

    try {
      // Call the onExport callback if provided
      if (onExport) {
        await onExport(format, { start: startDate, end: endDate });
      } else {
        // Default export functionality
        await defaultExport(format);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const parseDate = (value: any): Date => {
    if (!dateConfig) {
      // Fallback to default behavior
      return new Date(value);
    }

    if (dateConfig.customParser) {
      return dateConfig.customParser(value);
    }

    switch (dateConfig.dateFormat) {
      case "iso":
        return new Date(value);
      case "timestamp":
        return new Date(Number(value));
      default:
        return new Date(value);
    }
  };

  const defaultExport = async (format: "pdf" | "csv") => {
    // Filter data based on date range
    let filteredData = data;

    if (startDate && dateConfig) {
      filteredData = data.filter((item) => {
        const dateValue = item[dateConfig.columnKey];
        if (!dateValue) return false;

        const itemDate = parseDate(dateValue);
        if (isNaN(itemDate.getTime())) return false;

        if (dateRangeType === "single") {
          return itemDate.toDateString() === startDate.toDateString();
        } else {
          const end = endDate || new Date();
          return itemDate >= startDate && itemDate <= end;
        }
      });
    } else if (startDate) {
      // Fallback to default behavior if no dateConfig provided
      filteredData = data.filter((item) => {
        const itemDate = new Date(
          item.dateRegistered || item.createdAt || item.date
        );
        if (dateRangeType === "single") {
          return itemDate.toDateString() === startDate.toDateString();
        } else {
          const end = endDate || new Date();
          return itemDate >= startDate && itemDate <= end;
        }
      });
    }

    if (format === "csv") {
      exportToCSV(filteredData, columns, filename);
    } else {
      exportToPDF(filteredData, columns);
    }
  };

  const getFooterButtons = () => {
    return [
      {
        label: "Export as PDF",
        variant: "secondary" as const,
        onClick: () => handleExport("pdf"),
        disabled: isExporting,
        size: "medium" as const,
        // fullWidth: true,
      },
      {
        label: "Export as CSV",
        variant: "primary" as const,
        onClick: () => handleExport("csv"),
        disabled: isExporting,
        size: "medium" as const,
        // fullWidth: true,
      },
    ];
  };

  const exportToCSV = (
    data: ExportData[],
    columns: ExportColumn[],
    filename: string
  ) => {
    // Create CSV headers
    const headers = columns.map((col) => col.header).join(",");

    // Create CSV rows
    const rows = data.map((item) =>
      columns
        .map((col) => {
          const value = col.render ? col.render(item[col.key]) : item[col.key];
          // Clean the value for CSV (remove HTML tags, escape commas)
          const cleanValue = String(value || "")
            .replace(/<[^>]*>/g, "")
            .replace(/,/g, ";");
          return `"${cleanValue}"`;
        })
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: ExportData[], columns: ExportColumn[]) => {
    // For PDF export, we'll create a simple HTML table and use browser's print functionality
    // In a real application, you might want to use a library like jsPDF or Puppeteer

    const tableHTML = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .date-range { margin-bottom: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div class="date-range">
              ${
                startDate
                  ? `Date Range: ${startDate.toLocaleDateString()}${
                      endDate ? ` - ${endDate.toLocaleDateString()}` : ""
                    }`
                  : "All Data"
              }
            </div>
          </div>
          <table>
            <thead>
              <tr>
                ${columns.map((col) => `<th>${col.header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (item) =>
                    `<tr>${columns
                      .map((col) => {
                        const value = col.render
                          ? col.render(item[col.key])
                          : item[col.key];
                        const cleanValue = String(value || "").replace(
                          /<[^>]*>/g,
                          ""
                        );
                        return `<td>${cleanValue}</td>`;
                      })
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(tableHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const resetForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDateRangeType("single");
  };

  // Calculate filtered data count for summary
  const getFilteredDataCount = () => {
    if (!startDate || !dateConfig) {
      return data.length;
    }

    return data.filter((item) => {
      const dateValue = item[dateConfig.columnKey];
      if (!dateValue) return false;

      const itemDate = parseDate(dateValue);
      if (isNaN(itemDate.getTime())) return false;

      if (dateRangeType === "single") {
        return itemDate.toDateString() === startDate.toDateString();
      } else {
        const end = endDate || new Date();
        return itemDate >= startDate && itemDate <= end;
      }
    }).length;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const modalContent = (
    <div className="space-y-6">
      {/* Date Range Selection */}
      <div className="space-y-2">
        <h6 className="text-h6 text-szBlack700">
          Select Date Range{dateConfig ? ` (${dateConfig.label})` : ""}
        </h6>

        {/* Date Range Type Selection */}
        <div className="flex gap-4">
          <RadioButton
            id="single-date"
            name="dateRangeType"
            value="single"
            label="Single Date"
            checked={dateRangeType === "single"}
            onChange={(value) => setDateRangeType(value as "single" | "range")}
          />
          <RadioButton
            id="date-range"
            name="dateRangeType"
            value="range"
            label="Date Range"
            checked={dateRangeType === "range"}
            onChange={(value) => setDateRangeType(value as "single" | "range")}
          />
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Inputs
            label="Start Date"
            type="date"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setStartDate(
                e.target.value ? new Date(e.target.value) : undefined
              )
            }
            placeholder={
              dateRangeType === "single"
                ? "Select specific date"
                : "Select start date"
            }
          />
          {dateRangeType === "range" && (
            <Inputs
              label="End Date"
              type="date"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setEndDate(
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
              placeholder="Select end date (optional)"
            />
          )}
        </div>
      </div>

      {/* Data Summary */}
      <div className="">
        <h6 className="text-h6 mb-1">Export Summary</h6>
        <div className="space-y-1">
          <p className="text-body-small-reg text-szSecondary500">
            <span className="font-medium">Records to export:</span>{" "}
            {getFilteredDataCount()}
            {data.length !== getFilteredDataCount() && (
              <span className="text-szBlack500 ml-1">
                (of {data.length} total)
              </span>
            )}
          </p>
          {startDate && (
            <p className="text-body-small-reg text-szBlack600">
              <span className="font-medium">Date filter:</span>{" "}
              {startDate.toLocaleDateString()}
              {endDate && ` - ${endDate.toLocaleDateString()}`}
            </p>
          )}
          {dateConfig && !startDate && (
            <p className="text-body-small-reg text-szBlack500">
              No date filter applied - all records will be exported
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      showButton={false}
      onClose={handleClose}
      title={title}
      content={modalContent}
      showHeader={true}
      showFooter
      modalWidth="w-[640px]"
      contentHeight="h-[40vh]"
      footerOptions="stacked-left"
      footerButtons={getFooterButtons()}
    />
  );
};

export default ExportModal;
