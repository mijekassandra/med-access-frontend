import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import Dropdown, { type Option } from "../global-components/Dropdown";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
  hoverColor: string;
}

interface GenericFilteredChartProps {
  title: string;
  data: Record<string, ChartDataItem[]>; // Backend provides data for each filter
  filterOptions: Array<{ label: string; value: string }>;
  defaultFilter?: string;
  chartHeight?: string;
  className?: string;
  onFilterChange?: (filter: string) => void;
}

const GenericFilteredChart: React.FC<GenericFilteredChartProps> = ({
  title,
  data,
  filterOptions,
  defaultFilter,
  chartHeight = "h-52",
  className = "",
  onFilterChange,
}) => {
  // Convert filter options to the format expected by Dropdown
  const dropdownOptions: Option[] = filterOptions.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  // Find the default filter option
  const defaultOption =
    dropdownOptions.find((option) => option.value === defaultFilter) ||
    dropdownOptions[0];
  const [selectedFilter, setSelectedFilter] = useState<Option>(defaultOption);

  // Get current data based on selected filter
  const currentData = data[selectedFilter.value] || [];

  // Calculate total for current data
  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  const handleFilterChange = (selected: Option | Option[]) => {
    const filter = Array.isArray(selected) ? selected[0] : selected;
    setSelectedFilter(filter);
    onFilterChange?.(filter.value);
  };

  const chartData = {
    labels: currentData.map((item) => item.label),
    datasets: [
      {
        data: currentData.map((item) => item.value),
        backgroundColor: currentData.map((item) => item.color),
        borderColor: currentData.map((item) => item.color),
        borderWidth: 2,
        hoverBackgroundColor: currentData.map((item) => item.hoverColor),
        hoverBorderColor: currentData.map((item) => item.hoverColor),
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 12,
          usePointStyle: true,
          font: {
            family: "Montserrat, sans-serif",
            size: 11,
            weight: 600,
          },
          color: "#303030", // szBlack700
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1E1F24", // szBlack900
        bodyColor: "#303030", // szBlack700
        borderColor: "#E3E3E3", // szGrey200
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-200 ${className}`}
    >
      {/* Header with title, total, and filter */}
      <div className="flex justify-between items-center gap-3 mb-3">
        <h5 className="text-h5 text-szBlack700">{title}</h5>
        <div className="text-right">
          <p className="text-caption-reg text-szGrey500">Total Records</p>
          <p className="text-h4 text-szBlack900 font-bold">
            {total.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap justify-center w-32">
          <Dropdown
            label="Filter"
            placeholder="Select period"
            options={dropdownOptions}
            value={selectedFilter}
            onSelectionChange={handleFilterChange}
            size="small"
          />
        </div>
      </div>

      {/* Chart */}
      <div className={chartHeight}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GenericFilteredChart;
