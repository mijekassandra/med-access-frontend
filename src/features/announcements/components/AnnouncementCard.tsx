import React from "react";

//components
import CardContainer from "../../../global-components/CardContainer";
import Chip from "../../../global-components/Chip";

//icons
import { Edit2 } from "iconsax-react";

//types
import type { Announcement as AnnouncementType } from "../api/announcementApi";

interface AnnouncementCardProps {
  announcement: AnnouncementType;
  onEdit: (announcement: AnnouncementType) => void;
  showEditButton?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  showEditButton = true,
}) => {
  return (
    <CardContainer
      key={announcement._id}
      content={
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 ">
            <div className="flex items-center gap-3">
              <h6 className="text-h6 font-montserrat font-bold text-szPrimary900 ">
                {announcement.title}
              </h6>
              {showEditButton && (
                <Edit2
                  onClick={() => onEdit(announcement)}
                  size={16}
                  className="text-szPrimary700 cursor-pointer hover:text-szPrimary900"
                />
              )}
            </div>
            {!announcement.isPublished && (
              <Chip label="Archived" type="colored" color="blue" />
            )}
          </div>

          {announcement.attachment && (
            <div className="mt-3">
              <img
                src={announcement.attachment}
                alt={announcement.title}
                className="w-full h-72 object-cover rounded-md"
                onError={(e) => {
                  console.error(
                    "Image failed to load:",
                    announcement.attachment
                  );
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="mt-2">
                <a
                  href={announcement.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-szPrimary700 hover:text-szPrimary900 underline text-sm"
                >
                  View Full Image
                </a>
              </div>
            </div>
          )}

          <div className="space-y-3 text-body-base-reg text-szBlack700 mt-2">
            <div className="whitespace-pre-line">{announcement.content}</div>

            <div className="flex justify-between items-center text-sm text-szBlack500">
              <span>
                Created: {new Date(announcement.createdAt).toLocaleDateString()}
              </span>
              {announcement.updatedAt && (
                <span>
                  Updated:{" "}
                  {new Date(announcement.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="text-xs text-szBlack400">
              By: {announcement.author.firstName} {announcement.author.lastName}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default AnnouncementCard;
