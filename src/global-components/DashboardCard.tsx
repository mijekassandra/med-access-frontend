import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "blue" | "green" | "orange" | "purple" | "grey";
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  variant = "blue",
  className = "",
}) => {
  // Color variants configuration
  const colorVariants = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
      iconText: "text-purple-600",
    },
    grey: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      iconBg: "bg-gray-100",
      iconText: "text-gray-600",
    },
  };

  const colors = colorVariants[variant];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-3 border border-gray-200 ${className}`}
    >
      <div className="flex flex-col gap-1 justify-between h-full">
        <p className="text-szDarkGrey600 text-xs font-medium leading-tight">
          {title}
        </p>
        <div className="flex flex-row justify-between w-full">
          <p className="text-xl font-bold font-montserrat text-szBlack700">
            {value}
          </p>
          <div
            className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-4 h-4 ${colors.iconText}`,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
