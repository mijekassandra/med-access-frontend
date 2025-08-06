import React from "react";
import { ExportCurve } from "iconsax-react";

interface HealthEducationCardProps {
  icon: React.ReactNode;
  title: string;
  headline: string;
  summary: string;
  onDownload?: () => void;
  className?: string;
}

const HealthEducationCard: React.FC<HealthEducationCardProps> = ({
  icon,
  title,
  headline,
  summary,
  onDownload,
  className = "",
}) => {
  const variantStyles = {
    secondary: {
      container: "bg-szSecondary50 border-szSecondary200",
      iconBg: "bg-szSecondary500",
      title: "text-szSecondary700",
      headline: "text-szBlack700",
      summary: "text-szDarkGrey600",
    },
  };

  //   const currentVariant = variantStyles[variant];

  return (
    <div
      className={`rounded-lg border p-6 ${variantStyles.secondary.container} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${variantStyles.secondary.iconBg} text-white`}
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-6 h-6",
            })}
          </div>
          <div className="">
            <h5
              className={`text-h5 font-montserrat font-semibold ${variantStyles.secondary.title}`}
            >
              {title}
            </h5>
          </div>
        </div>
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
            aria-label="Download"
          >
            <ExportCurve className="icon-md text-szGrey500" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h4
          className={`text-h5 font-montserrat font-semibold leading-tight ${variantStyles.secondary.headline}`}
        >
          {headline}
        </h4>
        <p
          className={`text-body-base-reg leading-relaxed ${variantStyles.secondary.summary}`}
        >
          {summary}
        </p>
      </div>
    </div>
  );
};

export default HealthEducationCard;
