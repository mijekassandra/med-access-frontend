import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface Patient {
  id: string;
  username: string;
  address: string;
  email: string;
  contactNumber: string;
  dateRegistered: string;
}

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  patient?: Patient;
  onSave?: (patient: Patient) => void;
}

const AddPatientModal = ({
  isOpen,
  onClose,
  mode,
  patient,
  onSave,
}: AddPatientModalProps) => {
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    email: "",
    contactNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (patient && (mode === "edit" || mode === "view")) {
      setFormData({
        username: patient.username,
        address: patient.address,
        email: patient.email,
        contactNumber: patient.contactNumber,
      });
    } else if (mode === "add") {
      setFormData({
        username: "",
        address: "",
        email: "",
        contactNumber: "",
      });
    }
  }, [patient, mode, isOpen]);

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
        id: patient?.id || "",
        ...formData,
        dateRegistered: patient?.dateRegistered || new Date().toISOString(),
      });
    }

    onClose();
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      address: "",
      email: "",
      contactNumber: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD PATIENT";
      case "edit":
        return "EDIT PATIENT";
      case "view":
        return "PATIENT DETAILS";
      default:
        return "PATIENT";
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
              label="USERNAME"
              placeholder="Enter Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={mode === "view"}
            />

            {/* Full width address */}
            <Inputs
              label="ADDRESS"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={mode === "view"}
            />

            {/* 2-column grid for email and contact number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="EMAIL"
                placeholder="Enter Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={mode === "view"}
              />
              <Inputs
                label="CONTACT NUMBER"
                placeholder="Enter Contact Number"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                disabled={mode === "view"}
              />
            </div>
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={`Patient has been ${
          mode === "edit" ? "updated" : "added"
        } successfully.`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddPatientModal;
