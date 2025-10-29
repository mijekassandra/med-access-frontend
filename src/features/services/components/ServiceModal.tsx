import React, { useState, useEffect } from "react";

// components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import { Gallery } from "iconsax-react";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit" | "view";
  service?: any; // You can define a proper service type later
  onSave?: (service: any) => void;
}

export interface ServiceFormData {
  name: string;
  description: string;
  image: File | null;
  imagePreview: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  mode = "add",
  service,
  onSave,
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (service && (mode === "edit" || mode === "view")) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        image: null,
        imagePreview: service.imageUrl || "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        description: "",
        image: null,
        imagePreview: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      name: "",
      description: "",
      image: "",
    });
  }, [service, mode, isOpen]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 10MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));

      // Clear image error
      setFormErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {
      name: "",
      description: "",
      image: "",
    };

    // Check if name is empty
    if (!formData.name.trim()) {
      errors.name = "This field is required";
    }

    // Check if description is empty
    if (!formData.description.trim()) {
      errors.description = "This field is required";
    }

    // Check if image is provided (only for add mode)
    if (mode === "add" && !formData.image && !formData.imagePreview) {
      errors.image = "Please upload an image";
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API call
      const serviceData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        imagePreview: formData.imagePreview,
      };

      // Simulate API call - replace with actual API call
      console.log("Service data:", serviceData);

      setSnackbarMessage(
        `Service has been ${mode === "add" ? "added" : "updated"} successfully!`
      );
      setSnackbarType("success");
      setShowSnackbar(true);

      // Call onSave with the result if provided
      if (onSave) {
        onSave(serviceData);
      }

      onClose();
    } catch (err: any) {
      console.error("Error saving service:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `Failed to ${
          mode === "add" ? "add" : "update"
        } service. Please try again.`;

      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
      imagePreview: "",
    });
    setFormErrors({
      name: "",
      description: "",
      image: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD NEW SERVICE";
      case "edit":
        return "EDIT SERVICE";
      case "view":
        return "SERVICE DETAILS";
      default:
        return "SERVICE";
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
            {/* Service Name Input */}
            <Inputs
              label="SERVICE NAME"
              placeholder="Enter service name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.name}
            />

            {/* Service Description Input */}
            <Inputs
              label="SERVICE DESCRIPTION"
              placeholder="Enter service description"
              isTextarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.description}
              className="min-h-[80px]"
            />

            {/* Image Upload */}
            <div className="space-y-1">
              <p className="text-caption-all-caps text-szGrey500">
                SERVICE IMAGE
              </p>
              <div className="border-2 border-dashed border-szGrey300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={mode === "view"}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${
                    mode === "view" ? "cursor-not-allowed" : ""
                  }`}
                >
                  {formData.imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={formData.imagePreview}
                        alt="Service preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-szGrey600">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 flex flex-col items-center justify-center">
                      <Gallery />
                      <p className="text-sm text-szGrey600">
                        Click to upload image
                      </p>
                      <p className="text-xs text-szGrey500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
              {formErrors.image && (
                <p className="text-caption-reg text-red-500 ml-1">
                  {formErrors.image}
                </p>
              )}
            </div>
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

export default ServiceModal;
