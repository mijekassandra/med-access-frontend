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

interface ChartData {
  label: string;
  value: number;
  color: string;
  hoverColor: string;
}

interface FilteredChartProps {
  title: string;
  data: ChartData[];
  className?: string;
  onFilterChange?: (filter: string) => void;
  filterOptions?: Array<{ label: string; value: string }>;
  defaultFilter?: string;
  chartHeight?: string;
}

const FilteredChart: React.FC<FilteredChartProps> = ({
  title,
  data,
  className = "",
  onFilterChange,
  filterOptions = [
    { label: "Today", value: "today" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ],
  defaultFilter = "today",
  chartHeight = "h-52",
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

  const handleFilterChange = (selected: Option | Option[]) => {
    const filter = Array.isArray(selected) ? selected[0] : selected;
    setSelectedFilter(filter);
    onFilterChange?.(filter.value);
  };

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 2,
        hoverBackgroundColor: data.map((item) => item.hoverColor),
        hoverBorderColor: data.map((item) => item.hoverColor),
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
          padding: 20,
          usePointStyle: true,
          font: {
            family: "Montserrat, sans-serif",
            size: 12,
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
    <div className={`w-full h-full ${className}`}>
      {/* Header with title and filter */}
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-h5 text-szBlack700">{title}</h5>
        <div className="w-32">
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

export default FilteredChart;
