import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type {
  MedicineInventory,
  MedicineInventoryUpdate,
} from "../api/medicineInventoryApi";

// RTK Query
import {
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
} from "../api/medicineInventoryApi";

// Utils - removed unused imports

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  medicine?: MedicineInventory;
  onSave?: (medicine: MedicineInventory) => void;
}

const AddMedicineModal = ({
  isOpen,
  onClose,
  mode,
  medicine,
  onSave,
}: AddMedicineModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    dosage: "",
    stock: 0,
    expiration_date: "",
    batch_no: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    brand: "",
    description: "",
    dosage: "",
    stock: "",
    expiration_date: "",
    batch_no: "",
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [createMedicine, { isLoading: isAdding }] = useCreateMedicineMutation();
  const [updateMedicine, { isLoading: isEditing }] =
    useUpdateMedicineMutation();

  const isLoading = isAdding || isEditing;

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (medicine && (mode === "edit" || mode === "view")) {
      setFormData({
        name: medicine.name || "",
        brand: medicine.brand || "",
        description: medicine.description || "",
        dosage: medicine.dosage || "",
        stock: medicine.stock || 0,
        expiration_date: medicine.expiration_date
          ? new Date(medicine.expiration_date).toISOString().split("T")[0]
          : "",
        batch_no: medicine.batch_no || "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        brand: "",
        description: "",
        dosage: "",
        stock: 0,
        expiration_date: "",
        batch_no: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      name: "",
      brand: "",
      description: "",
      dosage: "",
      stock: "",
      expiration_date: "",
      batch_no: "",
    });
  }, [medicine, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "stock" ? parseInt(value) || 0 : value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validation function - all fields are required
  const validateForm = () => {
    const errors = {
      name: "",
      brand: "",
      description: "",
      dosage: "",
      stock: "",
      expiration_date: "",
      batch_no: "",
    };

    // Check if name is empty (required)
    if (!formData.name.trim()) {
      errors.name = "This field is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Medicine name must be at least 2 characters";
    }

    // Check if brand is empty (required)
    if (!formData.brand.trim()) {
      errors.brand = "This field is required";
    } else if (formData.brand.trim().length < 2) {
      errors.brand = "Brand name must be at least 2 characters";
    }

    // Check if description is empty (required)
    if (!formData.description.trim()) {
      errors.description = "This field is required";
    } else if (formData.description.trim().length < 5) {
      errors.description = "Description must be at least 5 characters";
    }

    // Check if dosage is empty (required)
    if (!formData.dosage.trim()) {
      errors.dosage = "This field is required";
    } else if (formData.dosage.trim().length < 2) {
      errors.dosage = "Dosage must be at least 2 characters";
    }

    // Check if stock is provided (required)
    if (formData.stock === undefined || formData.stock === null) {
      errors.stock = "This field is required";
    } else if (formData.stock < 0) {
      errors.stock = "Stock cannot be negative";
    } else if (formData.stock === 0) {
      errors.stock = "Stock must be greater than 0";
    }

    // Check if expiration date is provided (required)
    if (!formData.expiration_date) {
      errors.expiration_date = "This field is required";
    } else {
      const expiryDate = new Date(formData.expiration_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate < today) {
        errors.expiration_date = "Expiration date cannot be in the past";
      }
    }

    // Check if batch number is empty (required)
    if (!formData.batch_no.trim()) {
      errors.batch_no = "This field is required";
    } else if (formData.batch_no.trim().length < 2) {
      errors.batch_no = "Batch number must be at least 2 characters";
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  // FOR ADD AND EDIT
  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields correctly.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      if (mode === "add") {
        // Prepare data for API call - convert to backend format
        const medicineData = {
          name: formData.name.trim(),
          brand: formData.brand.trim() || "",
          description: formData.description.trim() || "",
          dosage: formData.dosage.trim() || "",
          stock: formData.stock,
          expiration_date: formData.expiration_date || null,
          batch_no: formData.batch_no.trim() || "",
        };

        const result = await createMedicine(medicineData).unwrap();

        setSnackbarMessage("Medicine has been added successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave && result.data) {
          onSave(result.data);
        }

        onClose();
      } else if (mode === "edit" && medicine?._id) {
        // Prepare data for edit API call
        const medicineData: MedicineInventoryUpdate = {
          name: formData.name.trim(),
          brand: formData.brand.trim() || "",
          description: formData.description.trim() || "",
          dosage: formData.dosage.trim() || "",
          stock: formData.stock,
          expiration_date: formData.expiration_date || null,
          batch_no: formData.batch_no.trim() || "",
        };

        const result = await updateMedicine({
          id: medicine._id,
          data: medicineData,
        }).unwrap();

        setSnackbarMessage("Medicine has been updated successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the updated data if provided
        if (onSave && result.data) {
          onSave(result.data);
        }

        onClose();
      }
    } catch (err: any) {
      console.error("Error saving medicine:", err);
      const errorMessage =
        err?.data?.message ||
        `Failed to ${
          mode === "add" ? "add" : "update"
        } medicine. Please try again.`;
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      brand: "",
      description: "",
      dosage: "",
      stock: 0,
      expiration_date: "",
      batch_no: "",
    });
    setFormErrors({
      name: "",
      brand: "",
      description: "",
      dosage: "",
      stock: "",
      expiration_date: "",
      batch_no: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD MEDICINE";
      case "edit":
        return "EDIT MEDICINE";
      case "view":
        return "MEDICINE DETAILS";
      default:
        return "MEDICINE";
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="MEDICINE NAME"
                placeholder="Enter Medicine Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.name}
              />
              <Inputs
                label="BRAND"
                placeholder="Enter Brand Name"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.brand}
              />
            </div>

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="DOSAGE"
                placeholder="Enter Dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange("dosage", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.dosage}
              />
              <Inputs
                label="STOCK"
                placeholder="Enter Stock"
                type="number"
                value={formData.stock.toString()}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.stock}
              />
              <Inputs
                label="EXPIRY DATE"
                placeholder="Select expiration date"
                type="date"
                value={formData.expiration_date}
                onChange={(e) =>
                  handleInputChange("expiration_date", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.expiration_date}
              />
              <Inputs
                label="BATCH NO"
                placeholder="Enter Batch No"
                value={formData.batch_no}
                onChange={(e) => handleInputChange("batch_no", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.batch_no}
              />
            </div>

            {/* Full width description */}
            <Inputs
              label="DESCRIPTION"
              placeholder="Enter Description"
              isTextarea
              className="h-[110px]"
              maxCharacter={200}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.description}
            />
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

export default AddMedicineModal;
