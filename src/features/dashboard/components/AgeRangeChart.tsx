import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { useGetAllUsersQuery } from "../../user/api/userApi";
import Loading from "../../../components/Loading";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AgeRangeChartProps {
  className?: string;
}

const AgeRangeChart: React.FC<AgeRangeChartProps> = ({ className = "" }) => {
  // Fetch all users
  const { data: usersData, isLoading, error } = useGetAllUsersQuery();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter only patients (role === "user")
  const filteredPatients = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.filter((user) => user.role === "user");
  }, [usersData]);

  // Calculate age range distribution
  const ageRangeData = useMemo(() => {
    const ranges = [
      { label: "0-17", min: 0, max: 17, color: "#3B82F6" },
      { label: "18-25", min: 18, max: 25, color: "#10B981" },
      { label: "26-35", min: 26, max: 35, color: "#F59E0B" },
      { label: "36-45", min: 36, max: 45, color: "#EF4444" },
      { label: "46-55", min: 46, max: 55, color: "#8B5CF6" },
      { label: "56-65", min: 56, max: 65, color: "#EC4899" },
      { label: "66+", min: 66, max: 999, color: "#6366F1" },
    ];

    return ranges.map((range) => {
      const count = filteredPatients.filter((patient) => {
        if (!patient.dateOfBirth) return false;
        const age = calculateAge(patient.dateOfBirth);
        return age >= range.min && age <= range.max;
      }).length;

      return {
        label: range.label,
        value: count,
        color: range.color,
      };
    });
  }, [filteredPatients]);

  const total = ageRangeData.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: ageRangeData.map((item) => item.label),
    datasets: [
      {
        label: "Number of Patients",
        data: ageRangeData.map((item) => item.value),
        backgroundColor: ageRangeData.map((item) => item.color),
        borderColor: ageRangeData.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            const value = context.parsed.y;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `Patients: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: "Montserrat, sans-serif",
            size: 11,
          },
          color: "#303030",
        },
        grid: {
          color: "#E3E3E3",
        },
      },
      x: {
        ticks: {
          font: {
            family: "Montserrat, sans-serif",
            size: 11,
          },
          color: "#303030",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h5 className="text-h5 text-szBlack700">Patient Age Range Distribution</h5>
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
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default AgeRangeChart;

