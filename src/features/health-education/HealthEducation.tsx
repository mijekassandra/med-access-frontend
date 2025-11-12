import React, { useState, useEffect, useMemo, useCallback } from "react";

//components
import HealthEducationCard from "./components/HealthEducationCard";
import AddHealthEducationModal from "./components/AddHealthEducationModal";
import ContainerWrapper from "../../components/ContainerWrapper";
import ButtonsIcon from "../../global-components/ButtonsIcon";
import SnackbarAlert from "../../global-components/SnackbarAlert";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Inputs from "../../global-components/Inputs";
import { useAuth } from "../auth/hooks/useAuth";
import { Add, SearchNormal1 } from "iconsax-react";
import Loading from "../../components/Loading";

// types
import type { HealthEducationItem } from "./api/healthEducationApi";

// rtk query
import {
  useGetHealthEducationQuery,
  useDeleteHealthEducationMutation,
} from "./api/healthEducationApi";

const HealthEducation: React.FC = () => {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedItem, setSelectedItem] = useState<
    HealthEducationItem | undefined
  >(undefined);
  const [healthEducationContent, setHealthEducationContent] = useState<
    HealthEducationItem[]
  >([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Search debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Load health education content using RTK Query
  const {
    data: healthEducationResponse,
    isLoading,
    error,
    refetch,
  } = useGetHealthEducationQuery();

  // Delete mutation
  const [deleteHealthEducation, { isLoading: isDeleting }] =
    useDeleteHealthEducationMutation();

  // Update local state when data changes
  useEffect(() => {
    if (healthEducationResponse?.data) {
      setHealthEducationContent(healthEducationResponse.data);
    }
  }, [healthEducationResponse]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      setSnackbarMessage(
        "Failed to load health education content. Please try again."
      );
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [error]);

  // Search term debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Search health education content
  const searchHealthEducation = useCallback(
    (
      content: HealthEducationItem[],
      searchTerm: string
    ): HealthEducationItem[] => {
      if (!searchTerm.trim()) return content;

      const searchLower = searchTerm.toLowerCase().trim();

      return content.filter((item) => {
        // Search in specific fields with priority
        const searchableFields = [
          item.title,
          item.headline,
          item.body,
          item.contentType,
          item._id,
          item.url,
        ];

        return searchableFields.some((field) => {
          if (field == null) return false;
          return field.toString().toLowerCase().includes(searchLower);
        });
      });
    },
    []
  );

  const handleSaveContent = () => {
    // RTK Query will automatically refetch and update the cache
    // No need to manually update local state
    refetch();
  };

  const handleEdit = (id: string | number) => {
    const item = healthEducationContent.find((c) => c._id === String(id));
    if (!item) return;
    setSelectedItem(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    setItemToDelete(String(id));
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const result = await deleteHealthEducation(itemToDelete).unwrap();
      if (result.success) {
        setSnackbarMessage(
          "Health education content has been deleted successfully!"
        );
        setSnackbarType("success");
        setShowSnackbar(true);
        setShowDeleteModal(false);
        setItemToDelete(null);
        refetch();
      } else {
        throw new Error(
          result.message || "Failed to delete health education content"
        );
      }
    } catch (err: any) {
      console.error("Error deleting health education content:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to delete health education content. Please try again.";

      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleOpenModal = () => {
    setSelectedItem(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filter and sort content
  const filteredContent = useMemo(() => {
    const filtered = searchHealthEducation(
      healthEducationContent,
      debouncedSearchTerm
    );

    // Sort by createdAt in descending order (newest first)
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [healthEducationContent, debouncedSearchTerm, searchHealthEducation]);

  // Use filteredContent directly (already sorted)
  const sortedContent = filteredContent;

  // Handle loading and error states
  if (isLoading) {
    return <Loading message="Loading health education content..." />;
  }

  return (
    <ContainerWrapper>
      <div className="flex flex-col gap-6">
        {/* Header with search */}
        <div className="flex gap-3">
          <Inputs
            type="text"
            placeholder="Search health education content by title, headline, content, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
            className="flex-1"
          />
          {user?.role === "admin" && (
            <ButtonsIcon
              variant="primary"
              size="medium"
              icon={<Add variant="Linear" />}
              onClick={handleOpenModal}
            />
          )}
        </div>

        {/* Display content dynamically */}
        <div className="space-y-6">
          {sortedContent.length > 0 ? (
            sortedContent.map((content) => (
              <HealthEducationCard
                key={content._id}
                id={content._id}
                title={content.title}
                headline={content.headline}
                content_type={content.contentType}
                body={content.body}
                url={content.url || ""}
                isPublished={content.isPublished}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-body-base-reg text-szBlack500">
                {debouncedSearchTerm
                  ? `No health education content found matching "${debouncedSearchTerm}"`
                  : "No health education content found"}
              </p>
            </div>
          )}
        </div>

        {/* Add Health Education Modal */}
        <AddHealthEducationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          healthEducation={selectedItem}
          onSave={handleSaveContent}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onClick={confirmDelete}
          description="Are you sure you want to delete this health education content?"
          buttonLabel={isDeleting ? "Deleting..." : "Delete"}
          isLoading={isDeleting}
        />

        {/* Snackbar for error messages */}
        <SnackbarAlert
          isOpen={showSnackbar}
          title={snackbarMessage}
          type={snackbarType}
          onClose={handleCloseSnackbar}
          duration={5000}
        />
      </div>
    </ContainerWrapper>
  );
};

export default HealthEducation;
