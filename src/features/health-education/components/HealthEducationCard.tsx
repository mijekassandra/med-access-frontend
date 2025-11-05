import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  Video,
  DocumentText,
  ArrowDown2,
  ArrowUp2,
  Edit2,
  Trash,
} from "iconsax-react";
import Chip from "../../../global-components/Chip";

interface HealthEducationCardProps {
  icon?: React.ReactNode;
  id: number | string;
  title: string;
  headline: string;
  body?: string;
  content_type: "article" | "video";
  url?: string;
  className?: string;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  isPublished?: boolean;
}

const HealthEducationCard: React.FC<HealthEducationCardProps> = ({
  icon,
  id,
  title,
  headline,
  body,
  content_type,
  url,
  className = "",
  onEdit,
  onDelete,
  isPublished,
}) => {
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);

  // Convert YouTube URL to embed format if needed
  const getEmbedUrl = (videoUrl: string): string => {
    // If it's already an embed URL, return as is
    if (videoUrl.includes("youtube.com/embed/")) {
      return videoUrl;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = "";

    // Handle youtube.com/watch?v= format
    const watchMatch = videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    // If we found a video ID, return the embed URL
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If we can't convert it, return the original URL
    return videoUrl;
  };

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

  // For article content, show card with styling
  return (
    <div
      className={`rounded-lg border p-6 ${variantStyles.secondary.container} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${variantStyles.secondary.iconBg} text-white`}
          >
            {React.cloneElement(displayIcon as React.ReactElement, {
              className: "w-5 h-5",
            })}
          </div>
          <h5
            className={`text-h5 font-montserrat font-semibold ${variantStyles.secondary.title}`}
          >
            {title}
          </h5>
        </div>
        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            {!isPublished && (
              <Chip label="Archived" type="colored" color="blue" />
            )}
            <button
              className="flex justify-center items-center w-10 h-10 group cursor-pointer transition-colors duration-200"
              aria-label="Edit"
              onClick={() => onEdit && onEdit(id)}
            >
              <Edit2
                className="h-5 w-5 text-szPrimary700 group-hover:text-szPrimary900"
                variant="Linear"
              />
            </button>
            {/* <button
              className="flex justify-center items-center w-10 h-10 group cursor-pointer transition-colors duration-200"
              aria-label="Delete"
              onClick={() => onDelete && onDelete(id)}
            >
              <Trash
                className="h-5 w-5 text-red-600 group-hover:text-red-800"
                variant="Linear"
              />
            </button> */}
          </div>
        )}
      </div>

      {/* Render article content */}
      <div className="space-y-3">
        <h4
          className={`text-h5 font-montserrat font-semibold leading-tight ${
            variantStyles.secondary.headline
          } ${content_type === "video" ? "mb-3" : ""}`}
        >
          {headline}
        </h4>
        {content_type === "video" && url && (
          <div className={`w-full ${className}`}>
            <iframe
              className="w-full h-72 rounded-lg"
              src={getEmbedUrl(url)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
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
