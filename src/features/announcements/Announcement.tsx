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
import Dropdown from "../../global-components/Dropdown";

// types
import type { Announcement as AnnouncementType } from "./api/announcementApi";

// integration
import {
  useGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useCreateAnnouncementMutation,
} from "./api/announcementApi";
import Loading from "../../components/Loading";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    useState<AnnouncementType | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Pagination constants
  const ITEMS_PER_PAGE = 3; // Show 3 announcements per page

  // Search debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  //! rtk query -----------------------
  const {
    data: announcementsResponse,
    error: fetchError,
    isLoading: isLoadingAnnouncements,
  } = useGetAnnouncementsQuery();
  const announcements = announcementsResponse?.data || [];

  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();
  const [createAnnouncement] = useCreateAnnouncementMutation();

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      console.error("Failed to fetch announcements:", fetchError);
      setSnackbarMessage("Failed to load announcements. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [fetchError]);

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

  //! Filter selection handler -----------------------
  const handleSelectionChange = (
    selected:
      | { label: string; value: string }
      | { label: string; value: string }[]
  ) => {
    const option = Array.isArray(selected) ? selected[0] : selected;
    setSelectedFilter(option.value);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedFilter]);

  //? Delete confirm -----------------------
  const handleDeleteConfirm = async () => {
    if (selectedAnnouncement) {
      try {
        await deleteAnnouncement(selectedAnnouncement._id).unwrap();
        setIsDeleteConfirmationOpen(false);
        setSelectedAnnouncement(null);
        setSnackbarMessage("Announcement deleted successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          "Failed to delete announcement. Please try again.";
        setSnackbarMessage(errorMessage);
        setSnackbarType("error");
        setShowSnackbar(true);
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
      announcements: AnnouncementType[],
      searchTerm: string
    ): AnnouncementType[] => {
      if (!searchTerm.trim()) return announcements;

      const searchLower = searchTerm.toLowerCase().trim();

      return announcements.filter((announcement) => {
        // Search in specific fields with priority
        const searchableFields = [
          announcement.title,
          announcement.content,
          announcement._id,
          new Date(announcement.createdAt).toLocaleDateString(),
          announcement.author.firstName,
          announcement.author.lastName,
        ];

        return searchableFields.some((field) => {
          if (field == null) return false;
          return field.toString().toLowerCase().includes(searchLower);
        });
      });
    },
    []
  );

  //! Filter announcements based on search term and filter -----------------------
  const filteredAnnouncements = useMemo(() => {
    // First apply search filter
    let filtered = searchAnnouncements(announcements, debouncedSearchTerm);

    // Then apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((announcement) => {
        if (selectedFilter === "published") return announcement.isPublished;
        if (selectedFilter === "archived") return !announcement.isPublished;
        return true;
      });
    }

    return filtered;
  }, [announcements, debouncedSearchTerm, selectedFilter, searchAnnouncements]);

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
      let announcementData;

      if (selectedFile) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("content", content.trim());
        formData.append("isPublished", "true");
        formData.append("attachment", selectedFile);
        announcementData = formData;
      } else {
        // Create regular object for no file
        announcementData = {
          title: title.trim(),
          content: content.trim(),
          isPublished: true,
        };
      }

      await createAnnouncement(announcementData).unwrap();

      setSnackbarMessage("Announcement posted successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);
      setTitle("");
      setContent("");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Post submission failed:", error);
      const errorMessage =
        error?.data?.message ||
        "Failed to post announcement. Please try again.";
      setSnackbarMessage(errorMessage);
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

  const handleEditPost = (announcement: AnnouncementType) => {
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

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <ContainerWrapper>
      <div className="space-y-6">
        {/* Header with search */}
        <div className="flex gap-3">
          <Inputs
            type="text"
            placeholder="Search announcements by title, content, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
            className="flex-1"
          />
          <div className="flex flex-wrap justify-center w-40">
            <Dropdown
              options={[
                { label: "All", value: "all" },
                { label: "Published", value: "published" },
                { label: "Archived", value: "archived" },
              ]}
              label="Filter by:"
              placeholder="Filter by"
              onSelectionChange={handleSelectionChange}
              value={{
                label:
                  selectedFilter === "all"
                    ? "All"
                    : selectedFilter === "published"
                    ? "Published"
                    : "Archived",
                value: selectedFilter,
              }}
              size="small"
            />
          </div>
        </div>

        {/* View Announcement Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <h4 className="text-h4 text-szBlack700">View Announcements</h4>
            <Divider className="flex-1 h-full " />
          </div>

          {/* Dynamic Announcements */}
          {isLoadingAnnouncements ? (
            <CardContainer
              content={
                <Loading
                  message="Loading announcements..."
                  spinnerSize="large"
                />
              }
            />
          ) : paginatedAnnouncements.length > 0 ? (
            paginatedAnnouncements.map((announcement) => (
              <CardContainer
                key={announcement._id}
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
                      {!announcement.isPublished && (
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
                      <div className="whitespace-pre-line">
                        {announcement.content}
                      </div>

                      <div className="flex justify-between items-center text-sm text-szBlack500">
                        <span>
                          Created:{" "}
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </span>
                        {announcement.updatedAt && (
                          <span>
                            Updated:{" "}
                            {new Date(
                              announcement.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-szBlack400">
                        By: {announcement.author.firstName}{" "}
                        {announcement.author.lastName}
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
                <div className="flex-1 flex flex-col gap-4">
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
                    className="min-h-[180px]"
                    error={!!formErrors.content}
                  />
                </div>
                <div className="h-full ">
                  <UploadAnnouncement
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                  />
                </div>
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
