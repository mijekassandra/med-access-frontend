import React, { useState, useEffect } from "react";

//componetns
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import RadioButton from "../../../global-components/RadioButton";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type {
  HealthEducationItem,
  HealthEducationCreate,
  HealthEducationUpdate,
} from "../api/healthEducationApi";

// RTK Query
import {
  useCreateHealthEducationMutation,
  useUpdateHealthEducationMutation,
} from "../api/healthEducationApi";

interface AddHealthEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  healthEducation?: HealthEducationItem;
  onSave?: (healthEducation: HealthEducationItem) => void;
}

export interface HealthEducationFormData {
  title: string;
  headline: string;
  contentType: "article" | "video";
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
    contentType: "article",
    body: "",
    url: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    headline: "",
    contentType: "",
    body: "",
    url: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [createHealthEducation, { isLoading: isCreating }] =
    useCreateHealthEducationMutation();
  const [updateHealthEducation, { isLoading: isUpdating }] =
    useUpdateHealthEducationMutation();

  const isLoading = isCreating || isUpdating;

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (healthEducation && (mode === "edit" || mode === "view")) {
      setFormData({
        title: healthEducation.title,
        headline: healthEducation.headline,
        contentType: healthEducation.contentType,
        body: healthEducation.body,
        url: healthEducation.url || "",
      });
    } else if (mode === "add") {
      setFormData({
        title: "",
        headline: "",
        contentType: "article",
        body: "",
        url: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      title: "",
      headline: "",
      contentType: "",
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
      contentType: "",
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
    if (!formData.contentType) {
      errors.contentType = "This field is required";
    }

    // Check content-specific fields
    if (formData.contentType === "article") {
      if (!formData.body.trim()) {
        errors.body = "This field is required";
      }
    } else if (formData.contentType === "video") {
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

  const convertToEmbedUrl = (url: string): string => {
    // Extract video ID from various YouTube URL formats
    let videoId = "";

    // Handle youtube.com/watch?v= format
    const watchMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    // If we found a video ID, return the embed URL
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // If we can't convert it, return the original URL
    return url;
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
        // Prepare data for API call
        const healthEducationData: HealthEducationCreate = {
          title: formData.title,
          headline: formData.headline,
          contentType: formData.contentType,
          body: formData.body,
          url:
            formData.contentType === "video"
              ? convertToEmbedUrl(formData.url)
              : null,
        };

        const result = await createHealthEducation(
          healthEducationData
        ).unwrap();

        if (result.success && result.data) {
          setSnackbarMessage(
            "Health education content has been added successfully!"
          );
          setSnackbarType("success");
          setShowSnackbar(true);

          // Call onSave with the result if provided
          if (onSave) {
            onSave(result.data);
          }

          onClose();
        } else {
          throw new Error(
            result.message || "Failed to create health education content"
          );
        }
      } else if (mode === "edit" && healthEducation?._id) {
        // Prepare data for edit API call
        const healthEducationData: HealthEducationUpdate = {
          title: formData.title,
          headline: formData.headline,
          contentType: formData.contentType,
          body: formData.body,
          url:
            formData.contentType === "video"
              ? convertToEmbedUrl(formData.url)
              : null,
        };

        const result = await updateHealthEducation({
          id: healthEducation._id,
          data: healthEducationData,
        }).unwrap();

        if (result.success && result.data) {
          setSnackbarMessage(
            "Health education content has been updated successfully!"
          );
          setSnackbarType("success");
          setShowSnackbar(true);

          // Call onSave with the updated data if provided
          if (onSave) {
            onSave(result.data);
          }

          onClose();
        } else {
          throw new Error(
            result.message || "Failed to update health education content"
          );
        }
      }
    } catch (err: any) {
      console.error("Error saving health education content:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `Failed to ${
          mode === "add" ? "add" : "update"
        } health education content. Please try again.`;

      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      headline: "",
      contentType: "article",
      body: "",
      url: "",
    });
    setFormErrors({
      title: "",
      headline: "",
      contentType: "",
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
        disabled: isLoading,
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
            <div className="space-y-2">
              <p className="text-body-base-strong text-szBlack700">
                CONTENT TYPE
              </p>
              <div className="flex gap-6">
                <RadioButton
                  id="article"
                  name="contentType"
                  label="Article"
                  value="article"
                  checked={formData.contentType === "article"}
                  onChange={() => handleInputChange("contentType", "article")}
                  disabled={mode === "view"}
                />
                <RadioButton
                  id="video"
                  name="contentType"
                  label="Video"
                  value="video"
                  checked={formData.contentType === "video"}
                  onChange={() => handleInputChange("contentType", "video")}
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
            {formData.contentType === "video" && (
              <div className="flex flex-col">
                <Inputs
                  label="VIDEO URL"
                  placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  disabled={mode === "view"}
                  error={!!formErrors.url}
                />
                <p className="text-caption-reg text-szGrey500 ml-1">
                  Supported formats: youtube.com/watch?v=..., youtu.be/...,
                  youtube.com/embed/...
                </p>
              </div>
            )}

            <Inputs
              label="ARTICLE CONTENT"
              placeholder="Enter article content..."
              isTextarea
              value={formData.body}
              onChange={(e) => handleInputChange("body", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.body}
              className="min-h-[170px]"
            />
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
