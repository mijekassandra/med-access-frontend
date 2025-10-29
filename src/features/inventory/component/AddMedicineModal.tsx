import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type { MedicineTable } from "../../../types/database";

// RTK Query
import {
  useAddMedicineInventoryMutation,
  useEditMedicineInventoryMutation,
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
  medicine?: MedicineTable;
  onSave?: (medicine: MedicineTable) => void;
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
    expiration_date: new Date(),
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
  const [addMedicine, { isLoading: isAdding }] =
    useAddMedicineInventoryMutation();
  const [editMedicine, { isLoading: isEditing }] =
    useEditMedicineInventoryMutation();

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
        expiration_date: new Date(medicine.expiration_date), // Convert string to Date
        batch_no: medicine.batch_no,
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        brand: "",
        description: "",
        dosage: "",
        stock: 0,
        expiration_date: getTodayDate(), // Use today's date as default
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
      [field]:
        field === "stock"
          ? parseInt(value) || 0
          : field === "expiration_date"
          ? parseDateFromInput(value) || prev.expiration_date // Keep existing date if invalid
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
      expiration_date: "",
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
    if (
      !formData.expiration_date ||
      !isDateInFuture(formData.expiration_date)
    ) {
      errors.expiration_date = "This field is required";
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
          expiration_date: formData.expiration_date,
          batch_no: formData.batch_no,
        };

        const result = await addMedicine(medicineData).unwrap();

        setSnackbarMessage("Medicine has been added successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave) {
          onSave(result);
        }

        onClose();
      } else if (mode === "edit" && medicine?.id) {
        // Prepare data for edit API call
        const medicineData = {
          name: formData.name,
          description: formData.description,
          dosage: formData.dosage,
          stock: formData.stock,
          expiration_date: formData.expiration_date,
          batch_no: formData.batch_no,
        };

        await editMedicine({
          id: medicine.id,
          medicine: medicineData,
        }).unwrap();

        setSnackbarMessage("Medicine has been updated successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the updated data if provided
        if (onSave) {
          onSave({
            id: medicine.id,
            brand: formData.brand,
            ...medicineData,
          });
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
      expiration_date: getTodayDate(),
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
                value={formatDateForInput(formData.expiration_date)}
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
