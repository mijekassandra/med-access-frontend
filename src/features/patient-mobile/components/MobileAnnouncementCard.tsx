import React, { useState } from "react";
import { Notification } from "iconsax-react";
import Button from "../../../global-components/Button";

interface AnnouncementData {
  id: string | number;
  title: string;
  date: string;
  content: string;
}

interface MobileAnnouncementCardProps {
  announcement: AnnouncementData;
}

const MobileAnnouncementCard: React.FC<MobileAnnouncementCardProps> = ({
  announcement,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-szWhite100 rounded-xl p-4 shadow-sm border border-szGray200">
      {/* Header Section */}
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-shrink-0 mt-1">
          <Notification
            size={26}
            variant="Bold"
            className="text-szPrimary700"
          />
        </div>
        <h5 className="text-szBlack700 text-h5 font-bold tracking-tight uppercase leading-tight">
          {announcement.title}
        </h5>
      </div>

      {/* Date Section */}
      <div className="mb-4">
        <p className="text-szDarkGrey600 text-body-base-reg">
          Date: {announcement.date}
        </p>
      </div>

      {/* Body Text Section */}
      <div
        className={`mb-6 transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-none" : "max-h-20"
        }`}
      >
        <p className="text-szGray900 text-body-base-reg leading-relaxed">
          {announcement.content}
        </p>
      </div>

      {/* Show More Button */}
      <Button
        variant={isExpanded ? "secondary" : "primary"}
        label={isExpanded ? "Show Less" : "Show More"}
        size="medium"
        fullWidth
        onClick={handleShowMore}
      />
    </div>
  );
};

export default MobileAnnouncementCard;
