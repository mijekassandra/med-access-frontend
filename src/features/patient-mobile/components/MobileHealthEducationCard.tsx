import React, { useState } from "react";
import { Video, DocumentText, ArrowDown2, ArrowUp2 } from "iconsax-react";
import type { HealthEducationContentTable } from "../../../types/database";

interface HealthEducationCardProps extends HealthEducationContentTable {
  category: string;
}

const MobileHealthEducationCard: React.FC<HealthEducationCardProps> = ({
  title,
  body,
  content_type = "article",
  url,
  category = "HEALTH",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center bg-szSecondary200 justify-center flex-shrink-0`}
          >
            {content_type === "video" ? (
              <Video size={24} className="text-szSecondary500" />
            ) : (
              <DocumentText size={24} className="text-szSecondary500" />
            )}
          </div>

          {/* Content --------------------*/}
          <div className="flex-1 min-w-0">
            {/* Category */}
            <p
              className={`text-caption-reg text-szGrey500 font-medium uppercase tracking-wide`}
            >
              {category}
            </p>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Body Section - Full width, no left padding */}
      <div className="px-4 pb-3">
        <p
          className="text-gray-700 text-sm leading-relaxed overflow-hidden"
          style={
            isExpanded
              ? {}
              : {
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.5",
                  maxHeight: "4.5em",
                }
          }
        >
          {body}
        </p>
      </div>

      {/* Video Content Section - Only show when expanded and content_type is video */}
      {isExpanded && content_type === "video" && url && (
        <div className="px-4 pb-4">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h4 className="text-szSecondary500 font-semibold text-sm mb-3">
              Video Content:
            </h4>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <p className="text-gray-700 text-sm font-mono break-all">{url}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          {content_type === "video" ? (
            <Video size={16} />
          ) : (
            <DocumentText size={16} />
          )}
          <span className="text-sm capitalize">{content_type}</span>
        </div>

        <button
          onClick={handleToggleExpanded}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <p className="text-body-small-reg font-medium">
            {isExpanded ? "Show less" : "Show more"}
          </p>
          {isExpanded ? <ArrowUp2 size={16} /> : <ArrowDown2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default MobileHealthEducationCard;
