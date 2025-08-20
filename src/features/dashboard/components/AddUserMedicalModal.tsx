import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface MedicalRecord {
  id: string;
  fullName: string;
  diagnosis: string;
  dateOfRecord: string;
  treatmentPlan: string;
}

interface AddUserMedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  medicalRecord?: MedicalRecord;
  onSave?: (medicalRecord: MedicalRecord) => void;
}

const AddUserMedicalModal = ({
  isOpen,
  onClose,
  mode,
  medicalRecord,
  onSave,
}: AddUserMedicalModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    diagnosis: "",
    dateOfRecord: "",
    treatmentPlan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (medicalRecord && (mode === "edit" || mode === "view")) {
      setFormData({
        fullName: medicalRecord.fullName,
        diagnosis: medicalRecord.diagnosis,
        dateOfRecord: medicalRecord.dateOfRecord,
        treatmentPlan: medicalRecord.treatmentPlan,
      });
    } else if (mode === "add") {
      setFormData({
        fullName: "",
        diagnosis: "",
        dateOfRecord: "",
        treatmentPlan: "",
      });
    }
  }, [medicalRecord, mode, isOpen]);

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
        id: medicalRecord?.id || "",
        ...formData,
      });
    }

    onClose();
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      diagnosis: "",
      dateOfRecord: "",
      treatmentPlan: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD USER MEDICAL RECORD";
      case "edit":
        return "EDIT USER MEDICAL RECORD";
      case "view":
        return "USER MEDICAL RECORD DETAILS";
      default:
        return "USER MEDICAL RECORD";
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
              label="FULL NAME"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              disabled={mode === "view"}
            />

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="DIAGNOSIS"
                placeholder="Enter Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                disabled={mode === "view"}
              />
              <Inputs
                label="DATE OF RECORD"
                placeholder="Enter Date of Record"
                type="datetime-local"
                value={formData.dateOfRecord}
                onChange={(e) =>
                  handleInputChange("dateOfRecord", e.target.value)
                }
                disabled={mode === "view"}
              />
            </div>

            {/* Full width treatment plan */}
            <Inputs
              label="TREATMENT PLAN"
              placeholder="Enter Treatment Plan"
              isTextarea
              maxCharacter={150}
              value={formData.treatmentPlan}
              onChange={(e) =>
                handleInputChange("treatmentPlan", e.target.value)
              }
              disabled={mode === "view"}
            />
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={`User medical record has been ${
          mode === "edit" ? "updated" : "added"
        } successfully.`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddUserMedicalModal;
