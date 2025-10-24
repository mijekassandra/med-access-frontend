import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MedicalRecordsPieChartProps {
  patientRecords?: number;
  pregnancyRecords?: number;
  className?: string;
}

const MedicalRecordsPieChart: React.FC<MedicalRecordsPieChartProps> = ({
  patientRecords = 150,
  pregnancyRecords = 75,
  className = "",
}) => {
  const primaryColor = "#29574D";
  const secondaryColor = "#FFE6B6";

  const primaryColorHover = "#2B6F6B";
  const secondaryColorHover = "#FED580";

  const data = {
    labels: ["Patient Records", "Pregnancy Records"],
    datasets: [
      {
        data: [patientRecords, pregnancyRecords],
        backgroundColor: [primaryColor, secondaryColor],
        borderColor: [primaryColor, secondaryColor],
        borderWidth: 2,
        hoverBackgroundColor: [primaryColorHover, secondaryColorHover],
        hoverBorderColor: [primaryColorHover, secondaryColorHover],
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

  const total = patientRecords + pregnancyRecords;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${className}`}
    >
      <div className="flex justify-between items-center gap-3 mb-3">
        <h5 className="text-h5 text-szBlack700">Medical Records</h5>
        <div className="text-right">
          <p className="text-caption-reg text-szGrey500">Total</p>
          <p className="text-h4 text-szBlack900 font-bold">
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className={`w-full h-full ${className}`}>
        <div className="h-52">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPieChart;
