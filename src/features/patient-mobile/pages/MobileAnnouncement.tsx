import React, { useState } from "react";

import { SearchNormal1 } from "iconsax-react";
//rtk
import { useGetAnnouncementsQuery } from "../../announcements/api/announcementApi";

//components
import MobileAnnouncementCard from "../components/MobileAnnouncementCard";
import MobileError from "../mobile-global-components/MobileError";
import MobileLoading from "../mobile-global-components/MobileLoading";
import NoSearchFound from "../../../global-components/NoSearchFound";
import Inputs from "../../../global-components/Inputs";
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";

// Use the same interface as the MobileAnnouncementCard component
interface AnnouncementData {
  id: string | number;
  title: string;
  date: string;
  content: string;
}

const MobileAnnouncement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: announcements, isLoading, error } = useGetAnnouncementsQuery();

  // Transform API data to match component interface
  const transformedAnnouncements: AnnouncementData[] = announcements
    ? announcements
        .filter((announcement) => announcement.isPublished)
        .map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          date: new Date(announcement.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          content: announcement.content,
        }))
    : [];

  // Filter announcements based on search term
  const filteredAnnouncements = transformedAnnouncements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <MobileLoading message="Loading announcements..." spinnerSize="large" />
    );
  }

  if (error) {
    return (
      <MobileError
        title="Unable to load announcements"
        description="Please contact the administrator for assistance."
        // icon={NotificationBing}
      />
    );
  }

  return (
    <div className="min-h-screen bg-szWhite100 mb-6">
      {/* Header */}
      <div className="px-4 pt-4">
        <MobilePageTitle
          title="Announcements"
          description="Stay informed with the latest health updates and important notices"
        />

        {/* Search Bar */}
        <Inputs
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className="my-4"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {filteredAnnouncements.length === 0 ? (
          <NoSearchFound
            hasSearchTerm={!!searchTerm}
            searchTitle="No announcements found"
            noItemsTitle="No announcements available"
            searchDescription="Try adjusting your search terms."
            noItemsDescription="Check back later for new announcements."
            icon={SearchNormal1}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-szDarkGrey600 text-body-base-reg">
                {filteredAnnouncements.length} announcement
                {filteredAnnouncements.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredAnnouncements.map((announcement) => (
              <MobileAnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAnnouncement;
