import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { useGetAllUsersQuery } from "../../user/api/userApi";
import Loading from "../../../components/Loading";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface GenderDistributionChartProps {
  className?: string;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  className = "",
}) => {
  // Fetch all users
  const { data: usersData, isLoading, error } = useGetAllUsersQuery();

  // Filter only patients (role === "user")
  const filteredPatients = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.filter((user) => user.role === "user");
  }, [usersData]);

  // Calculate gender distribution
  const genderData = useMemo(() => {
    const maleCount = filteredPatients.filter(
      (p) => p.gender === "male"
    ).length;
    const femaleCount = filteredPatients.filter(
      (p) => p.gender === "female"
    ).length;
    const otherCount = filteredPatients.filter(
      (p) => p.gender === "other"
    ).length;

    return [
      {
        label: "Male",
        value: maleCount,
        color: "#3B82F6",
        hoverColor: "#2563EB",
      },
      {
        label: "Female",
        value: femaleCount,
        color: "#EC4899",
        hoverColor: "#DB2777",
      },
      ...(otherCount > 0
        ? [
            {
              label: "Other",
              value: otherCount,
              color: "#8B5CF6",
              hoverColor: "#7C3AED",
            },
          ]
        : []),
    ];
  }, [filteredPatients]);

  const total = genderData.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: genderData.map((item) => item.label),
    datasets: [
      {
        data: genderData.map((item) => item.value),
        backgroundColor: genderData.map((item) => item.color),
        borderColor: genderData.map((item) => item.color),
        borderWidth: 2,
        hoverBackgroundColor: genderData.map((item) => item.hoverColor),
        hoverBorderColor: genderData.map((item) => item.hoverColor),
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
          color: "#303030",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1E1F24",
        bodyColor: "#303030",
        borderColor: "#E3E3E3",
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
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
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
      className={`bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h5 className="text-h5 text-szBlack700">Patient Gender Distribution</h5>
        <div className="text-right">
          <p className="text-caption-reg text-szGrey500">Total Patients</p>
          <p className="text-h4 text-szBlack900 font-bold">
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loading message="Loading patient data..." />
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-red-500">
            Error loading patient data. Please try again later.
          </p>
        </div>
      ) : total === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-gray-500">No patient data available</p>
        </div>
      ) : (
        <div className="h-64">
          <Pie data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default GenderDistributionChart;

