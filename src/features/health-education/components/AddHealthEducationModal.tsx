import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import RadioButton from "../../../global-components/RadioButton";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type { HealthEducationContentTable } from "../../../types/database";

// RTK Query
import {
  useAddHealthEducationMutation,
  useEditHealthEducationMutation,
} from "../api/healthEducationApi";

interface AddHealthEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  healthEducation?: HealthEducationContentTable;
  onSave?: (healthEducation: HealthEducationContentTable) => void;
}

export interface HealthEducationFormData {
  title: string;
  headline: string;
  content_type: "article" | "video";
  body: string;
  url: string;
}

const AddHealthEducationModal: React.FC<AddHealthEducationModalProps> = ({
  isOpen,
  onClose,
  mode,
  healthEducation,
  onSave,
}) => {
  const [formData, setFormData] = useState<HealthEducationFormData>({
    title: "",
    headline: "",
    content_type: "article",
    body: "",
    url: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    headline: "",
    content_type: "",
    body: "",
    url: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [addHealthEducation, { isLoading: isAdding }] =
    useAddHealthEducationMutation();
  const [editHealthEducation, { isLoading: isEditing }] =
    useEditHealthEducationMutation();

  const isLoading = isAdding || isEditing;

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (healthEducation && (mode === "edit" || mode === "view")) {
      setFormData({
        title: healthEducation.title,
        headline: healthEducation.headline,
        content_type: healthEducation.content_type,
        body: healthEducation.body,
        url: healthEducation.url,
      });
    } else if (mode === "add") {
      setFormData({
        title: "",
        headline: "",
        content_type: "article",
        body: "",
        url: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      title: "",
      headline: "",
      content_type: "",
      body: "",
      url: "",
    });
  }, [healthEducation, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
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
      headline: "",
      content_type: "",
      body: "",
      url: "",
    };

    // Check if title is empty
    if (!formData.title.trim()) {
      errors.title = "This field is required";
    }

    // Check if headline is empty
    if (!formData.headline.trim()) {
      errors.headline = "This field is required";
    }

    // Check if content type is selected
    if (!formData.content_type) {
      errors.content_type = "This field is required";
    }

    // Check content-specific fields
    if (formData.content_type === "article") {
      if (!formData.body.trim()) {
        errors.body = "This field is required";
      }
    } else if (formData.content_type === "video") {
      if (!formData.url.trim()) {
        errors.url = "This field is required";
      } else if (!isValidYouTubeUrl(formData.url)) {
        errors.url = "Please enter a valid YouTube URL";
      }
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
    return youtubeRegex.test(url);
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
        // Prepare data for API call (exclude id for new content)
        const healthEducationData = {
          title: formData.title,
          headline: formData.headline,
          content_type: formData.content_type,
          body: formData.body,
          url: formData.content_type === "video" ? formData.url : "",
          created_by: 1, // Current user ID - in real app, get from auth context
        };

        const result = await addHealthEducation(healthEducationData).unwrap();

        setSnackbarMessage(
          "Health education content has been added successfully!"
        );
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave) {
          onSave(result);
        }

        onClose();
      } else if (mode === "edit" && healthEducation?.id) {
        // Prepare data for edit API call
        const healthEducationData = {
          title: formData.title,
          headline: formData.headline,
          content_type: formData.content_type,
          body: formData.body,
          url: formData.content_type === "video" ? formData.url : "",
        };

        await editHealthEducation({
          id: healthEducation.id,
          healthEducation: healthEducationData,
        }).unwrap();

        setSnackbarMessage(
          "Health education content has been updated successfully!"
        );
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the updated data if provided
        if (onSave) {
          onSave({
            id: healthEducation.id,
            ...healthEducationData,
            created_by: healthEducation.created_by,
            created_at: healthEducation.created_at,
          });
        }

        onClose();
      }
    } catch (err) {
      console.error("Error saving health education content:", err);
      setSnackbarMessage(
        `Failed to ${
          mode === "add" ? "add" : "update"
        } health education content. Please try again.`
      );
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      headline: "",
      content_type: "article",
      body: "",
      url: "",
    });
    setFormErrors({
      title: "",
      headline: "",
      content_type: "",
      body: "",
      url: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD HEALTH EDUCATION";
      case "edit":
        return "EDIT HEALTH EDUCATION";
      case "view":
        return "HEALTH EDUCATION DETAILS";
      default:
        return "HEALTH EDUCATION";
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
        contentHeight="h-[60vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Content Type Selection */}
            <div className="space-y-3">
              <p className="text-body-base-strong text-szBlack700">
                CONTENT TYPE
              </p>
              <div className="flex gap-6">
                <RadioButton
                  id="article"
                  name="content_type"
                  label="Article"
                  value="article"
                  checked={formData.content_type === "article"}
                  onChange={() => handleInputChange("content_type", "article")}
                  disabled={mode === "view"}
                />
                <RadioButton
                  id="video"
                  name="content_type"
                  label="Video"
                  value="video"
                  checked={formData.content_type === "video"}
                  onChange={() => handleInputChange("content_type", "video")}
                  disabled={mode === "view"}
                />
              </div>
            </div>

            {/* Full width inputs */}
            <Inputs
              label="TITLE"
              placeholder="Enter content title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.title}
            />

            <Inputs
              label="HEADLINE"
              placeholder="Enter content headline"
              value={formData.headline}
              onChange={(e) => handleInputChange("headline", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.headline}
            />

            {/* Conditional Fields */}
            {formData.content_type === "article" ? (
              <Inputs
                label="ARTICLE CONTENT"
                placeholder="Enter article content..."
                isTextarea
                value={formData.body}
                onChange={(e) => handleInputChange("body", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.body}
              />
            ) : (
              <div className="space-y-2">
                <Inputs
                  label="VIDEO URL"
                  placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  disabled={mode === "view"}
                  error={!!formErrors.url}
                />
                <p className="text-sm text-szGrey500">
                  Supported formats: youtube.com/watch?v=, youtu.be/,
                  youtube.com/embed/
                </p>
              </div>
            )}
          </div>
        }
      />

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

export default AddHealthEducationModal;
