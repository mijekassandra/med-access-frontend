import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface Medicine {
  id: string;
  medicineName: string;
  dosage: string;
  stock: string;
  expiryDate: string;
  batchNo: string;
  description: string;
}

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  medicine?: Medicine;
  onSave?: (medicine: Medicine) => void;
}

const AddMedicineModal = ({
  isOpen,
  onClose,
  mode,
  medicine,
  onSave,
}: AddMedicineModalProps) => {
  const [formData, setFormData] = useState({
    medicineName: "",
    dosage: "",
    stock: "",
    expiryDate: "",
    batchNo: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (medicine && (mode === "edit" || mode === "view")) {
      setFormData({
        medicineName: medicine.medicineName,
        dosage: medicine.dosage,
        stock: medicine.stock,
        expiryDate: medicine.expiryDate,
        batchNo: medicine.batchNo,
        description: medicine.description,
      });
    } else if (mode === "add") {
      setFormData({
        medicineName: "",
        dosage: "",
        stock: "",
        expiryDate: "",
        batchNo: "",
        description: "",
      });
    }
  }, [medicine, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSnackbar(true);

    if (onSave && mode === "edit") {
      onSave({
        id: medicine?.id || "",
        ...formData,
      });
    }

    onClose();
  };

  const handleCancel = () => {
    setFormData({
      medicineName: "",
      dosage: "",
      stock: "",
      expiryDate: "",
      batchNo: "",
      description: "",
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
        contentHeight="h-[50vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Full width inputs */}
            <Inputs
              label="MEDICINE NAME"
              placeholder="Enter Medicine Name"
              value={formData.medicineName}
              onChange={(e) =>
                handleInputChange("medicineName", e.target.value)
              }
              disabled={mode === "view"}
            />

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="DOSAGE"
                placeholder="Enter Dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange("dosage", e.target.value)}
                disabled={mode === "view"}
              />
              <Inputs
                label="STOCK"
                placeholder="Enter Stock"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                disabled={mode === "view"}
              />
              <Inputs
                label="EXPIRY DATE"
                placeholder="Enter Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
                disabled={mode === "view"}
              />
              <Inputs
                label="BATCH NO"
                placeholder="Enter Batch No"
                value={formData.batchNo}
                onChange={(e) => handleInputChange("batchNo", e.target.value)}
                disabled={mode === "view"}
              />
            </div>

            {/* Full width description */}
            <Inputs
              label="DESCRIPTION"
              placeholder="Enter Description"
              isTextarea
              maxCharacter={150}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={mode === "view"}
            />
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={`Medicine has been ${
          mode === "edit" ? "updated" : "added"
        } successfully!`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddMedicineModal;
