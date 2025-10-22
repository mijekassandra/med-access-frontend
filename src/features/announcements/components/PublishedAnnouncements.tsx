import React from "react";
import { useGetAnnouncementsQuery } from "../api/announcementApi";
import CardContainer from "../../../global-components/CardContainer";

const PublishedAnnouncements: React.FC = () => {
  const {
    data: response,
    error,
    isLoading,
  } = useGetAnnouncementsQuery({ published: true });
  const announcements = response?.data || [];

  if (isLoading) {
    return (
      <CardContainer
        content={
          <div className="text-center py-8">
            <p className="text-body-base-reg text-szBlack500">
              Loading published announcements...
            </p>
          </div>
        }
      />
    );
  }

  if (error) {
    return (
      <CardContainer
        content={
          <div className="text-center py-8">
            <p className="text-body-base-reg text-red-500">
              Failed to load published announcements.
            </p>
          </div>
        }
      />
    );
  }

  if (announcements.length === 0) {
    return (
      <CardContainer
        content={
          <div className="text-center py-8">
            <p className="text-body-base-reg text-szBlack500">
              No published announcements found.
            </p>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <CardContainer
          key={announcement._id}
          content={
            <div className="space-y-3">
              <h6 className="text-h6 font-montserrat font-bold text-szPrimary900">
                {announcement.title}
              </h6>
              <div className="text-body-base-reg text-szBlack700 whitespace-pre-line">
                {announcement.content}
              </div>
              <div className="flex justify-between items-center text-sm text-szBlack500">
                <span>
                  By: {announcement.author.firstName}{" "}
                  {announcement.author.lastName}
                </span>
                <span>
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              {announcement.attachment && (
                <div className="mt-3">
                  <a
                    href={announcement.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-szPrimary700 hover:text-szPrimary900 underline"
                  >
                    View Attachment
                  </a>
                </div>
              )}
            </div>
          }
        />
      ))}
    </div>
  );
};

export default PublishedAnnouncements;
