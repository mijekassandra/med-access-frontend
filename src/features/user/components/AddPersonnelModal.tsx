import React, { useState } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPersonnelModal = ({ isOpen, onClose }: AddPersonnelModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSnackbar(true);
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title="Add Personnel"
        modalWidth="w-[640px]"
        contentHeight="h-[50vh]"
        headerOptions="left"
        footerOptions="stacked-left"
        footerButtons={[
          {
            label: "Cancel",
            variant: "ghost",
            onClick: () => onClose(),
            size: "medium",
          },
          {
            label: "Submit",
            variant: "primary",
            onClick: handleSubmit,
            size: "medium",
            loading: isLoading,
          },
        ]}
        content={
          <div className="space-y-4 mt-2">
            {/* Full width inputs */}
            <Inputs label="FULL NAME" placeholder="Enter Full Name" />

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="SPECIALIZATION"
                placeholder="Enter Specialization"
              />
              <Inputs
                label="PRC LICENSE NUMBER"
                placeholder="Enter PRC License Number"
              />
            </div>

            {/* Full width contact number */}
            <Inputs
              label="CONTACT NUMBER"
              placeholder="Enter Contact Number"
              type="tel"
            />
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title="Personnel has been added successfully."
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddPersonnelModal;
