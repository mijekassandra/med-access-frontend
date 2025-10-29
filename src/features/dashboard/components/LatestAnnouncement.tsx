import React from "react";
import { useGetAnnouncementsQuery } from "../../announcements/api/announcementApi";
import Loading from "../../../components/Loading";
import { Notification, Calendar, User } from "iconsax-react";

const LatestAnnouncement: React.FC = () => {
  const {
    data: announcementsData,
    isLoading,
    error,
  } = useGetAnnouncementsQuery({ published: true });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-szPrimary200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Notification size={20} className="text-szPrimary700" />
            <h6 className="text-h6 font-bold text-szPrimary700">
              Latest Announcement
            </h6>
          </div>
        </div>
        <div className="p-4">
          <Loading message="Loading latest announcement..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-szPrimary200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Notification size={20} className="text-szPrimary700" />
            <h6 className="text-h6 font-bold text-szPrimary700">
              Latest Announcement
            </h6>
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="text-red-500 mb-2">
            <Notification size={32} className="mx-auto" />
          </div>
          <p className="text-body-base-reg text-szBlack500">
            Failed to load announcements
          </p>
        </div>
      </div>
    );
  }

  if (!announcementsData?.data || announcementsData.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-szPrimary200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Notification size={20} className="text-szPrimary700" />
            <h6 className="text-h6 font-bold text-szPrimary700">
              Latest Announcement
            </h6>
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="text-szBlack300 mb-2">
            <Notification size={32} className="mx-auto" />
          </div>
          <p className="text-body-base-reg text-szBlack500">
            No announcements available
          </p>
        </div>
      </div>
    );
  }

  // Get the latest announcement (first one from the sorted list)
  const latestAnnouncement = announcementsData.data[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-szPrimary200 to-szPrimary100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-szPrimary700 rounded-md">
            <Notification size={16} className="text-white" />
          </div>
          <h6 className="text-h6 font-bold text-szPrimary700">
            Latest Announcement
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-4">
        {/* Title */}
        <div>
          <h5 className="text-h5 font-semibold text-szBlack800 leading-tight mb-2">
            {latestAnnouncement.title}
          </h5>
        </div>

        {/* Content Preview */}
        <div className="max-h-56 overflow-y-auto">
          <p className="text-body-small-reg text-szBlack600 leading-relaxed">
            {latestAnnouncement.content}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-row pt-2 gap-2 items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-szBlack500">
            <Calendar size={12} className="text-szDarkGrey600" />
            <p className="text-caption-reg text-szDarkGrey600">
              {new Date(latestAnnouncement.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm text-szBlack500">
            <User size={12} className="text-szDarkGrey600" />
            <p className="text-caption-reg text-szDarkGrey600">
              By {latestAnnouncement.author.firstName}{" "}
              {latestAnnouncement.author.lastName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestAnnouncement;
