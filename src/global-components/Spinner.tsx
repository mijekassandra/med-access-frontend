import React from "react";

interface SpinnerProps {
  size?: "large" | "medium" | "small";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  className = "",
}) => {
  const loaderSizeClasses = {
    large: "w-6 h-6",
    medium: "w-6 h-6",
    small: "w-4 h-4",
  };

  return (
    <svg
      className={`animate-spin ${loaderSizeClasses[size]} ${className}`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        const x1 = 25 + 20 * Math.cos((angle * Math.PI) / 180);
        const y1 = 25 + 20 * Math.sin((angle * Math.PI) / 180);
        const x2 = 25 + 11 * Math.cos((angle * Math.PI) / 180);
        const y2 = 25 + 11 * Math.sin((angle * Math.PI) / 180);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1.5s"
              begin={`${i * 0.1875}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}
    </svg>
  );
};

export default Spinner;
