import React, { useState } from "react";
import {
  ExportCurve,
  Video,
  DocumentText,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-react";

interface HealthEducationCardProps {
  icon?: React.ReactNode;
  title: string;
  headline: string;
  body?: string;
  content_type: "article" | "video";
  url?: string;
  onDownload?: () => void;
  className?: string;
}

const HealthEducationCard: React.FC<HealthEducationCardProps> = ({
  icon,
  title,
  headline,
  body,
  content_type,
  url,
  onDownload,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const variantStyles = {
    secondary: {
      container: "bg-szSecondary50 border-szSecondary200",
      iconBg: "bg-szSecondary500",
      title: "text-szSecondary700",
      headline: "text-szBlack700",
      summary: "text-szDarkGrey600",
    },
  };

  // Default icon based on content type if no icon provided
  const defaultIcon = content_type === "video" ? <Video /> : <DocumentText />;
  const displayIcon = icon || defaultIcon;

  // Check if content is long enough to need truncation (roughly 4 lines)
  const shouldShowExpandButton = body && body.length > 200;

  // For video content, return plain iframe without card styling
  if (content_type === "video" && url) {
    return (
      <div className={`w-full ${className}`}>
        <iframe
          className="w-full h-72 rounded-lg"
          src={url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  // For article content, show card with styling
  return (
    <div
      className={`rounded-lg border p-6 ${variantStyles.secondary.container} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${variantStyles.secondary.iconBg} text-white`}
          >
            {React.cloneElement(displayIcon as React.ReactElement, {
              className: "w-6 h-6",
            })}
          </div>
          <h5
            className={`text-h5 font-montserrat font-semibold ${variantStyles.secondary.title}`}
          >
            {title}
          </h5>
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

      {/* Render article content */}
      <div className="space-y-3">
        <h4
          className={`text-h5 font-montserrat font-semibold leading-tight ${variantStyles.secondary.headline}`}
        >
          {headline}
        </h4>
        {body && (
          <div className="space-y-3">
            <div
              className={`text-body-base-reg leading-relaxed ${variantStyles.secondary.summary} whitespace-pre-line`}
              style={
                !isExpanded && shouldShowExpandButton
                  ? {
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
                  : {}
              }
            >
              {body}
            </div>
            {shouldShowExpandButton && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center w-full gap-2 text-szPrimary600 hover:text-szPrimary700 transition-colors duration-200 text-sm font-medium"
              >
                {isExpanded ? (
                  <>
                    <ArrowUp2 className="icon-md" />
                  </>
                ) : (
                  <>
                    <ArrowDown2 className="icon-md" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthEducationCard;
