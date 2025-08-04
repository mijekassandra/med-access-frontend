import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "blue" | "green" | "orange" | "purple" | "grey";
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  variant = "blue",
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
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between h-full">
        <div className="">
          <p className="text-szDarkGrey600 text-body-small-strong">{title}</p>
          <h3 className="text-h3 text-szBlack800">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: `w-6 h-6 ${colors.iconText}`,
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
