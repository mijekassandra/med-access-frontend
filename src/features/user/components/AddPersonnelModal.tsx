import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface Personnel {
  id: string;
  fullName: string;
  firstname: string;
  lastname: string;
  specialization: string;
  prcLicenseNumber: string;
  contactNumber: string;
}

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  personnel?: Personnel;
  onSave?: (personnel: Personnel) => void;
}

const AddPersonnelModal = ({
  isOpen,
  onClose,
  mode,
  personnel,
  onSave,
}: AddPersonnelModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    firstname: "",
    lastname: "",
    specialization: "",
    prcLicenseNumber: "",
    contactNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (personnel && (mode === "edit" || mode === "view")) {
      setFormData({
        fullName: personnel.fullName,
        firstname: personnel.firstname,
        lastname: personnel.lastname,
        specialization: personnel.specialization,
        prcLicenseNumber: personnel.prcLicenseNumber,
        contactNumber: personnel.contactNumber,
      });
    } else if (mode === "add") {
      setFormData({
        fullName: "",
        firstname: "",
        lastname: "",
        specialization: "",
        prcLicenseNumber: "",
        contactNumber: "",
      });
    }
  }, [personnel, mode, isOpen]);

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
        id: personnel?.id || "",
        ...formData,
      });
    }

    onClose();
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      firstname: "",
      lastname: "",
      specialization: "",
      prcLicenseNumber: "",
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
        return "ADD PERSONNEL";
      case "edit":
        return "EDIT PERSONNEL";
      case "view":
        return "PERSONNEL DETAILS";
      default:
        return "PERSONNEL";
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="FIRSTNAME"
                placeholder="Enter Firstname"
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                disabled={mode === "view"}
              />
              <Inputs
                label="LASTNAME"
                placeholder="Enter Lastname"
                value={formData.lastname}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                disabled={mode === "view"}
              />
            </div>

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="SPECIALIZATION"
                placeholder="Enter Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange("specialization", e.target.value)
                }
                disabled={mode === "view"}
              />
              <Inputs
                label="PRC LICENSE NUMBER"
                placeholder="Enter PRC License Number"
                value={formData.prcLicenseNumber}
                onChange={(e) =>
                  handleInputChange("prcLicenseNumber", e.target.value)
                }
                disabled={mode === "view"}
              />
            </div>

            {/* Full width contact number */}
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
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={`Personnel has been ${
          mode === "edit" ? "updated" : "added"
        } successfully.`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddPersonnelModal;
