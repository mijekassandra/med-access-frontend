import React from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPersonnelModal = ({ isOpen, onClose }: AddPersonnelModalProps) => {
  return (
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
          onClick: () => onClose(),
          size: "medium",
        },
      ]}
      content={
        <div className="space-y-4 mt-2">
          {/* Full width inputs */}
          <Inputs label="FULL NAME" placeholder="Enter Full Name" />

          {/* 2-column grid for other inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <Inputs label="SPECIALIZATION" placeholder="Enter Specialization" />
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
  );
};

export default AddPersonnelModal;
