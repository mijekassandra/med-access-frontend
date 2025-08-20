import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface Client {
  id: string;
  username: string;
  address: string;
  email: string;
  contactNumber: string;
  dateRegistered: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  client?: Client;
  onSave?: (client: Client) => void;
}

const AddClientModal = ({
  isOpen,
  onClose,
  mode,
  client,
  onSave,
}: AddClientModalProps) => {
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
    if (client && (mode === "edit" || mode === "view")) {
      setFormData({
        username: client.username,
        address: client.address,
        email: client.email,
        contactNumber: client.contactNumber,
      });
    } else if (mode === "add") {
      setFormData({
        username: "",
        address: "",
        email: "",
        contactNumber: "",
      });
    }
  }, [client, mode, isOpen]);

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
        id: client?.id || "",
        ...formData,
        dateRegistered: client?.dateRegistered || new Date().toISOString(),
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
        return "ADD CLIENT";
      case "edit":
        return "EDIT CLIENT";
      case "view":
        return "CLIENT DETAILS";
      default:
        return "CLIENT";
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
        title={`Client has been ${
          mode === "edit" ? "updated" : "added"
        } successfully.`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddClientModal;
