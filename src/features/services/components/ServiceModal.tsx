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
  serviceName: string;
  price: number;
  additionalInfo: string;
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
    serviceName: "",
    price: 0,
    additionalInfo: "",
    image: null,
    imagePreview: "",
  });

  const [formErrors, setFormErrors] = useState({
    serviceName: "",
    price: "",
    additionalInfo: "",
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
        serviceName: service.serviceName || "",
        price: service.price || 0,
        additionalInfo: service.additionalInfo || "",
        image: null,
        imagePreview: service.image || "",
      });
    } else if (mode === "add") {
      setFormData({
        serviceName: "",
        price: 0,
        additionalInfo: "",
        image: null,
        imagePreview: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      serviceName: "",
      price: "",
      additionalInfo: "",
      image: "",
    });
  }, [service, mode, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
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

      // Validate file size (max 5MB per API docs)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      // Validate file type (per API docs)
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Image must be JPEG, PNG, or GIF",
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
      serviceName: "",
      price: "",
      additionalInfo: "",
      image: "",
    };

    // Check if serviceName is empty
    if (!formData.serviceName.trim()) {
      errors.serviceName = "This field is required";
    }

    // Check if serviceName exceeds max length (200 chars per API docs)
    if (formData.serviceName.length > 200) {
      errors.serviceName = "Service name must be 200 characters or less";
    }

    // Check if price is valid
    if (formData.price < 0) {
      errors.price = "Price cannot be negative";
    }

    // Check if additionalInfo exceeds max length (1000 chars per API docs)
    if (formData.additionalInfo.length > 1000) {
      errors.additionalInfo = "Additional info must be 1000 characters or less";
    }

    // Image is optional per API docs, so no validation needed

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
        serviceName: formData.serviceName,
        price: formData.price,
        additionalInfo: formData.additionalInfo,
        image: formData.image,
      };

      // Call onSave with the service data
      if (onSave) {
        await onSave(serviceData);
      }

      // Note: Success message is handled in Services.tsx
      // Only show error here if onSave throws
    } catch (err: any) {
      console.error("Error saving service:", err);
      const errorMessage =
        err?.data?.message ||
        err?.error ||
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
      serviceName: "",
      price: 0,
      additionalInfo: "",
      image: null,
      imagePreview: "",
    });
    setFormErrors({
      serviceName: "",
      price: "",
      additionalInfo: "",
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
          <div className="space-y-3 mt-2">
            {/* Service Name Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <div>
                <Inputs
                  label="SERVICE NAME"
                  placeholder="Enter service name"
                  value={formData.serviceName}
                  onChange={(e) =>
                    handleInputChange("serviceName", e.target.value)
                  }
                  disabled={mode === "view"}
                  error={!!formErrors.serviceName}
                  maxCharacter={200}
                />
                {formErrors.serviceName && (
                  <p className="text-caption-reg text-red-500 ml-1 mt-1">
                    {formErrors.serviceName}
                  </p>
                )}
              </div>

              {/* Service Price Input */}
              <div>
                <Inputs
                  label="SERVICE PRICE"
                  placeholder="Enter service price"
                  type="number"
                  value={formData.price.toString()}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  disabled={mode === "view"}
                  error={!!formErrors.price}
                />
                {formErrors.price && (
                  <p className="text-caption-reg text-red-500 ml-1 mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>
            </div>

            {/* Service Additional Info Input */}
            <div>
              <Inputs
                label="ADDITIONAL INFO"
                placeholder="Enter additional information (optional)"
                isTextarea
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.additionalInfo}
                className="min-h-[80px]"
                maxCharacter={1000}
              />
              {formErrors.additionalInfo && (
                <p className="text-caption-reg text-red-500 ml-1 mt-1">
                  {formErrors.additionalInfo}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
              <p className="text-caption-all-caps text-szGrey500">
                SERVICE IMAGE
              </p>
              <div className="border-2 border-dashed border-szGrey300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
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
                        PNG, JPG, GIF up to 5MB
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
