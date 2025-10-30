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

// Utils
import {
  formatDateForInput,
  parseDateFromInput,
  isDateInFuture,
  getTodayDate,
} from "../../../utils/dateUtils";

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
    expirationDate: new Date(),
    batch_no: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    brand: "",
    description: "",
    dosage: "",
    stock: "",
    expirationDate: "",
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
        name: medicine.name,
        brand: medicine.brand,
        description: medicine.description,
        dosage: medicine.dosage,
        stock: medicine.stock,
        expirationDate: new Date(medicine.expirationDate), // Convert string to Date
        batch_no: medicine.batch_no,
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        brand: "",
        description: "",
        dosage: "",
        stock: 0,
        expirationDate: getTodayDate(), // Use today's date as default
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
      expirationDate: "",
      batch_no: "",
    });
  }, [medicine, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "stock"
          ? parseInt(value) || 0
          : field === "expirationDate"
          ? parseDateFromInput(value) || prev.expirationDate // Keep existing date if invalid
          : value,
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
      name: "",
      brand: "",
      description: "",
      dosage: "",
      stock: "",
      expirationDate: "",
      batch_no: "",
    };

    // Check if name is empty
    if (!formData.name.trim()) {
      errors.name = "This field is required";
    }

    // Check if description is empty
    if (!formData.description.trim()) {
      errors.description = "This field is required";
    }

    // Check if dosage is empty
    if (!formData.dosage.trim()) {
      errors.dosage = "This field is required";
    }

    // Check if stock is empty or 0
    if (!formData.stock || formData.stock <= 0) {
      errors.stock = "This field is required";
    }

    // Check if batch number is empty
    if (!formData.batch_no.trim()) {
      errors.batch_no = "This field is required";
    }

    // Check if expiration date is valid and not in the past
    if (!formData.expirationDate || !isDateInFuture(formData.expirationDate)) {
      errors.expirationDate = "This field is required";
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
        // Prepare data for API call (exclude id for new medicine)
        const medicineData = {
          name: formData.name,
          brand: formData.brand,
          description: formData.description,
          dosage: formData.dosage,
          stock: formData.stock,
          expirationDate: formData.expirationDate,
          batch_no: formData.batch_no,
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
          name: formData.name,
          brand: formData.brand,
          description: formData.description,
          dosage: formData.dosage,
          stock: formData.stock,
          expirationDate: formData.expirationDate,
          batch_no: formData.batch_no,
        };

        setSnackbarMessage("Medicine has been updated successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);
        const result = await updateMedicine({
          id: medicine._id,
          data: medicineData,
        }).unwrap();

        // Call onSave with the updated data if provided
        if (onSave && result.data) {
          onSave(result.data);
        }

        onClose();
      }
    } catch (err) {
      console.error("Error saving medicine:", err);
      setSnackbarMessage(
        `Failed to ${
          mode === "add" ? "add" : "update"
        } medicine. Please try again.`
      );
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
      expirationDate: getTodayDate(),
      batch_no: "",
    });
    setFormErrors({
      name: "",
      brand: "",
      description: "",
      dosage: "",
      stock: "",
      expirationDate: "",
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
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.name}
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
                label="EXPIRY DATE (DD/MM/YYYY)"
                placeholder="DD/MM/YYYY"
                type="date"
                value={formatDateForInput(formData.expirationDate)}
                onChange={(e) =>
                  handleInputChange("expirationDate", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.expirationDate}
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
