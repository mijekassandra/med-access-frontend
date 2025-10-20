import { useState, useEffect, useMemo, useCallback } from "react";

//icons
import { Edit2, SearchNormal1 } from "iconsax-react";

//components
import ContainerWrapper from "../../components/ContainerWrapper";
import Button from "../../global-components/Button";
import Inputs from "../../global-components/Inputs";
import CardContainer from "../../global-components/CardContainer";
import Chip from "../../global-components/Chip";
import Divider from "../../global-components/Divider";
import Pagination from "../../global-components/Pagination";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import UploadAnnouncement from "./components/UploadAnnouncement";
import EditAnnouncementModal from "./components/EditAnnouncementModal";
import SnackbarAlert from "../../global-components/SnackbarAlert";

// types
import type { AnnouncementTable } from "../../types/database";

// integration
import {
  useGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useAddAnnouncementMutation,
} from "./api/announcementApi";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
  });
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditAnnouncementModalOpen, setIsEditAnnouncementModalOpen] =
    useState(false);
  const [isViewAnnouncementModalOpen, setIsViewAnnouncementModalOpen] =
    useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementTable | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // Pagination constants
  const ITEMS_PER_PAGE = 3; // Show 3 announcements per page

  // Search debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  //! rtk query -----------------------
  const { data: announcements = [] } = useGetAnnouncementsQuery();

  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();
  const [addAnnouncement] = useAddAnnouncementMutation();

  useEffect(() => {
    console.log("selectedAnnouncement: ", selectedAnnouncement);
  }, [selectedAnnouncement]);

  //! Pagination -----------------------
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //! Search term -----------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  //? Edit save -----------------------
  const handleEditSave = (updatedAnnouncement: AnnouncementTable) => {
    // TODO: Implement edit API call
    console.log("Edit announcement:", updatedAnnouncement);
  };

  //? Delete confirm -----------------------
  const handleDeleteConfirm = async () => {
    if (selectedAnnouncement) {
      try {
        await deleteAnnouncement({ id: selectedAnnouncement.id }).unwrap();
        setIsDeleteConfirmationOpen(false);
        setSelectedAnnouncement(null);
        setSnackbarMessage("Announcement deleted successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        setSnackbarMessage("Failed to delete announcement. Please try again.");
        setSnackbarType("error");
        setShowSnackbar(true); // Keep the modal open so the user can try again
      }
    }
  };

  //! Close modals -----------------------
  const handleCloseModals = () => {
    setIsEditAnnouncementModalOpen(false);
    setIsViewAnnouncementModalOpen(false);
    setSelectedAnnouncement(null);
  };

  //! Close snackbar -----------------------
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  //! Search announcements -----------------------
  const searchAnnouncements = useCallback(
    (
      announcements: AnnouncementTable[],
      searchTerm: string
    ): AnnouncementTable[] => {
      if (!searchTerm.trim()) return announcements;

      const searchLower = searchTerm.toLowerCase().trim();

      return announcements.filter((announcement) => {
        // Search in specific fields with priority
        const searchableFields = [
          announcement.title,
          announcement.content,
          announcement.id.toString(),
          new Date(announcement.created_at).toLocaleDateString(),
        ];

        return searchableFields.some((field) => {
          if (field == null) return false;
          return field.toString().toLowerCase().includes(searchLower);
        });
      });
    },
    []
  );

  //! Filter announcements based on search term -----------------------
  const filteredAnnouncements = useMemo(() => {
    return searchAnnouncements(announcements, debouncedSearchTerm);
  }, [announcements, debouncedSearchTerm, searchAnnouncements]);

  //! Calculate pagination -----------------------
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    startIndex,
    endIndex
  );

  // Validation function
  const validateForm = () => {
    const errors = {
      title: "",
      content: "",
    };

    // Check if title is empty
    if (!title.trim()) {
      errors.title = "This field is required";
    }

    // Check if content is empty
    if (!content.trim()) {
      errors.content = "This field is required";
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const handlePostSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    setIsPosting(true);

    try {
      // Create announcement data
      const announcementData = {
        title: title.trim(),
        content: content.trim(),
        author_id: 1, // TODO: Get from auth context
        is_published: true,
        status: "active" as const,
        created_at: new Date().toISOString(), // Set current date automatically
      };

      await addAnnouncement(announcementData).unwrap();

      setSnackbarMessage("Announcement posted successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Post submission failed:", error);
      setSnackbarMessage("Failed to post announcement. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsPosting(false);
    }
  };

  // const handleDeletePost = (announcement: AnnouncementTable) => {
  //   setSelectedAnnouncement(announcement);
  //   setIsDeleteConfirmationOpen(true);
  // };

  const handleEditPost = (announcement: AnnouncementTable) => {
    setSelectedAnnouncement(announcement);
    setIsEditAnnouncementModalOpen(true);
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value);
    // Clear error when user starts typing
    if (formErrors.title) {
      setFormErrors((prev) => ({
        ...prev,
        title: "",
      }));
    }
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(e.target.value);
    // Clear error when user starts typing
    if (formErrors.content) {
      setFormErrors((prev) => ({
        ...prev,
        content: "",
      }));
    }
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload from the UploadAnnouncement component
    console.log("File uploaded from component:", file);
  };

  return (
    <ContainerWrapper>
      <div className="space-y-6">
        {/* Header with search */}
        <div className="flex flex-col lg:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
          <Inputs
            type="text"
            placeholder="Search announcements by title, content, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />
        </div>

        {/* View Announcement Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <h4 className="text-h4 text-szBlack700">View Announcements</h4>
            <Divider className="flex-1 h-full " />
          </div>

          {/* Dynamic Announcements */}
          {paginatedAnnouncements.length > 0 ? (
            paginatedAnnouncements.map((announcement) => (
              <CardContainer
                key={announcement.id}
                content={
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 ">
                      <div className="flex items-center gap-3">
                        <h6 className="text-h6 font-montserrat font-bold text-szPrimary900 ">
                          {announcement.title}
                        </h6>
                        <Edit2
                          onClick={() => handleEditPost(announcement)}
                          size={16}
                          className="text-szPrimary700 cursor-pointer hover:text-szPrimary900"
                        />
                      </div>
                      {announcement.status === "archived" && (
                        <Chip label="Archived" type="colored" color="blue" />
                      )}

                      {/* 
                      <ButtonsIcon
                        variant="warning"
                        icon={<Trash />}
                        size="small"
                        onClick={() => handleDeletePost(announcement)}
                      /> */}
                    </div>

                    <div className="space-y-3 text-body-base-reg text-szBlack700 mt-2">
                      <div className="whitespace-pre-line">
                        {announcement.content}
                      </div>

                      <div className="flex justify-between items-center text-sm text-szBlack500">
                        <span>
                          Created:{" "}
                          {new Date(
                            announcement.created_at
                          ).toLocaleDateString()}
                        </span>
                        {announcement.updated_at && (
                          <span>
                            Updated:{" "}
                            {new Date(
                              announcement.updated_at
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                }
              />
            ))
          ) : (
            <CardContainer
              content={
                <div className="text-center py-8">
                  <p className="text-body-base-reg text-szBlack500">
                    {debouncedSearchTerm
                      ? `No announcements found matching "${debouncedSearchTerm}"`
                      : "No announcements found"}
                  </p>
                </div>
              }
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          )}
        </div>

        {/* Write Post Section */}
        <div className="gap-6">
          <CardContainer
            title="Create Announcement"
            content={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="space-y-4">
                  <Inputs
                    label="TITLE"
                    placeholder="Enter Title"
                    value={title}
                    onChange={handleTitleChange}
                    error={!!formErrors.title}
                  />
                  <Inputs
                    label="CONTENT"
                    isTextarea
                    placeholder="Write your announcement here..."
                    value={content}
                    onChange={handleContentChange}
                    className="min-h-[200px]"
                    error={!!formErrors.content}
                  />
                  <div className="flex justify-center">
                    <Button
                      label="Post Announcement"
                      variant="primary"
                      size="large"
                      onClick={handlePostSubmit}
                      disabled={!title.trim() || !content.trim()}
                      loading={isPosting}
                      fullWidth
                    />
                  </div>
                </div>
                <UploadAnnouncement onUpload={handleFileUpload} />
              </div>
            }
          />
        </div>
      </div>

      {/* Edit Announcement Modal */}
      <EditAnnouncementModal
        isOpen={isEditAnnouncementModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        announcement={selectedAnnouncement || undefined}
        onSave={handleEditSave}
      />

      {/* View Announcement Modal */}
      <EditAnnouncementModal
        isOpen={isViewAnnouncementModalOpen}
        onClose={handleCloseModals}
        mode="view"
        announcement={selectedAnnouncement || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedAnnouncement(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Announcement"
        description={`Are you sure you want to delete the announcement "${selectedAnnouncement?.title}"? 
        This action cannot be undone.`}
        isLoading={isDeleting}
      />

      {/* Snackbar Alert */}
      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </ContainerWrapper>
  );
};

export default Announcement;
