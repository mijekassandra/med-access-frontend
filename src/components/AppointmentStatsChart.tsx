import React, { useState } from "react";
import FilteredChart from "./FilteredChart";

interface AppointmentStatsChartProps {
  className?: string;
}

// Mock data - replace with actual API calls
const mockData = {
  today: [
    { label: "Completed", value: 12, color: "#B6CBBD", hoverColor: "#284738" }, // szPrimary200, szPrimary500
    { label: "Pending", value: 8, color: "#FFE6B6", hoverColor: "#FCB315" }, // szSecondary200, szSecondary500
    { label: "Cancelled", value: 2, color: "#FFEFEB", hoverColor: "#FF5324" }, // error50, error700
  ],
  weekly: [
    { label: "Completed", value: 85, color: "#B6CBBD", hoverColor: "#284738" },
    { label: "Pending", value: 45, color: "#FFE6B6", hoverColor: "#FCB315" },
    { label: "Cancelled", value: 12, color: "#FFEFEB", hoverColor: "#FF5324" },
  ],
  monthly: [
    { label: "Completed", value: 320, color: "#B6CBBD", hoverColor: "#284738" },
    { label: "Pending", value: 180, color: "#FFE6B6", hoverColor: "#FCB315" },
    { label: "Cancelled", value: 45, color: "#FFEFEB", hoverColor: "#FF5324" },
  ],
  yearly: [
    {
      label: "Completed",
      value: 3840,
      color: "#B6CBBD",
      hoverColor: "#284738",
    },
    { label: "Pending", value: 2160, color: "#FFE6B6", hoverColor: "#FCB315" },
    { label: "Cancelled", value: 540, color: "#FFEFEB", hoverColor: "#FF5324" },
  ],
};

const AppointmentStatsChart: React.FC<AppointmentStatsChartProps> = ({
  className = "",
}) => {
  const [currentData, setCurrentData] = useState(mockData.today);

  const handleFilterChange = (filter: string) => {
    // This is where you would make API calls based on the filter
    // For now, we'll use mock data
    switch (filter) {
      case "today":
        setCurrentData(mockData.today);
        break;
      case "weekly":
        setCurrentData(mockData.weekly);
        break;
      case "monthly":
        setCurrentData(mockData.monthly);
        break;
      case "yearly":
        setCurrentData(mockData.yearly);
        break;
      default:
        setCurrentData(mockData.today);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${className}`}
    >
      <FilteredChart
        title="Appointment Statistics"
        data={currentData}
        onFilterChange={handleFilterChange}
        defaultFilter="today"
        chartHeight="h-52"
      />
    </div>
  );
};

export default AppointmentStatsChart;
