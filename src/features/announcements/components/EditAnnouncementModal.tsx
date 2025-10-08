import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type { AnnouncementTable } from "../../../types/database";

// RTK Query
import {
  useAddAnnouncementMutation,
  useEditAnnouncementMutation,
} from "../api/announcementApi";

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  announcement?: AnnouncementTable;
  onSave?: (announcement: AnnouncementTable) => void;
}

const EditAnnouncementModal = ({
  isOpen,
  onClose,
  mode,
  announcement,
  onSave,
}: EditAnnouncementModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_published: true,
    attachment_url: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
    attachment_url: "",
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [addAnnouncement, { isLoading: isAdding }] =
    useAddAnnouncementMutation();
  const [editAnnouncement, { isLoading: isEditing }] =
    useEditAnnouncementMutation();

  const isLoading = isAdding || isEditing;

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (announcement && (mode === "edit" || mode === "view")) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        is_published: announcement.is_published,
        attachment_url: announcement.attachment_url || "",
      });
    } else if (mode === "add") {
      setFormData({
        title: "",
        content: "",
        is_published: true,
        attachment_url: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      title: "",
      content: "",
      attachment_url: "",
    });
  }, [announcement, mode, isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {
      title: "",
      content: "",
      attachment_url: "",
    };

    // Check if title is empty
    if (!formData.title.trim()) {
      errors.title = "This field is required";
    }

    // Check if content is empty
    if (!formData.content.trim()) {
      errors.content = "This field is required";
    }

    // Check if attachment URL is provided and valid (only for add mode)
    if (mode === "add" && formData.attachment_url.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.attachment_url.trim())) {
        errors.attachment_url = "Please enter a valid URL";
      }
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  // FOR ADD AND EDIT
  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      if (mode === "add") {
        // Prepare data for API call (exclude id for new announcement)
        const announcementData = {
          title: formData.title,
          content: formData.content,
          author_id: 1, // TODO: Get from auth context
          is_published: formData.is_published,
          attachment_url: formData.attachment_url || undefined,
        };

        const result = await addAnnouncement(announcementData).unwrap();

        setSnackbarMessage("Announcement has been added successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave) {
          onSave(result);
        }

        onClose();
      } else if (mode === "edit" && announcement?.id) {
        // Prepare data for edit API call - only title and content can be edited
        const announcementData = {
          title: formData.title,
          content: formData.content,
        };

        await editAnnouncement({
          id: announcement.id,
          announcement: announcementData,
        }).unwrap();

        setSnackbarMessage("Announcement has been updated successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the updated data if provided
        if (onSave) {
          onSave({
            id: announcement.id,
            ...announcementData,
            author_id: announcement.author_id,
            created_at: announcement.created_at,
            updated_at: new Date(),
            is_published: announcement.is_published, // Keep original values
            attachment_url: announcement.attachment_url, // Keep original values
          });
        }

        onClose();
      }
    } catch (err) {
      console.error("Error saving announcement:", err);
      setSnackbarMessage(
        `Failed to ${
          mode === "add" ? "add" : "update"
        } announcement. Please try again.`
      );
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      content: "",
      is_published: true,
      attachment_url: "",
    });
    setFormErrors({
      title: "",
      content: "",
      attachment_url: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD ANNOUNCEMENT";
      case "edit":
        return "EDIT ANNOUNCEMENT";
      case "view":
        return "ANNOUNCEMENT DETAILS";
      default:
        return "ANNOUNCEMENT";
    }
  };

  const getFooterButtons = () => {
    if (mode === "view") {
      return [];
    }

    return [
      {
        label: "Cancel",
        variant: "ghost" as const,
        onClick: handleCancel,
        size: "medium" as const,
      },
      {
        label: mode === "edit" ? "Save Changes" : "Submit",
        variant: "primary" as const,
        onClick: handleSubmit,
        size: "medium" as const,
        loading: isLoading,
      },
    ];
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title={getModalTitle()}
        modalWidth="w-[640px]"
        contentHeight="h-[55vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Title input */}
            <Inputs
              label="ANNOUNCEMENT TITLE"
              placeholder="Enter Announcement Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.title}
            />

            {/* Content textarea */}
            <Inputs
              label="ANNOUNCEMENT CONTENT"
              placeholder="Enter announcement content..."
              isTextarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.content}
              className="min-h-[200px]"
            />

            {/* Attachment URL field - only show in add mode */}
            {mode === "add" && (
              <Inputs
                label="ATTACHMENT URL (OPTIONAL)"
                placeholder="Enter attachment URL (e.g., https://example.com/file.pdf)"
                value={formData.attachment_url}
                onChange={(e) =>
                  handleInputChange("attachment_url", e.target.value)
                }
                error={!!formErrors.attachment_url}
              />
            )}
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default EditAnnouncementModal;
