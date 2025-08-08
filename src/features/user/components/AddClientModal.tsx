import React from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClientModal = ({ isOpen, onClose }: AddClientModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showButton={false}
      title="Add Client"
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
          onClick: () => onClose(),
          size: "medium",
        },
      ]}
      content={
        <div className="space-y-4 mt-2">
          {/* Full width inputs */}
          <Inputs label="USERNAME" placeholder="Enter Username" />

          {/* Full width address */}
          <Inputs label="ADDRESS" placeholder="Enter Address" />

          {/* 2-column grid for email and contact number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <Inputs label="EMAIL" placeholder="Enter Email" type="email" />
            <Inputs
              label="CONTACT NUMBER"
              placeholder="Enter Contact Number"
              type="tel"
            />
          </div>
        </div>
      }
    ></Modal>
  );
};

export default AddClientModal;
