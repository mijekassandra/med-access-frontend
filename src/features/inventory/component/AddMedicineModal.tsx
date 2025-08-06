import React from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMedicineModal = ({ isOpen, onClose }: AddMedicineModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showButton={false}
      title="Add Medicine"
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
          <Inputs label="MEDICINE NAME" placeholder="Enter Medicine Name" />

          {/* 2-column grid for other inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <Inputs label="DOSAGE" placeholder="Enter Dosage" />
            <Inputs label="STOCK" placeholder="Enter Stock" />
            <Inputs
              label="EXPIRY DATE"
              placeholder="Enter Expiry Date"
              type="date"
            />
            <Inputs label="BATCH NO" placeholder="Enter Batch No" />
          </div>

          {/* Full width description */}
          <Inputs
            label="DESCRIPTION"
            placeholder="Enter Description"
            isTextarea
            maxCharacter={150}
          />
        </div>
      }
    ></Modal>
  );
};

export default AddMedicineModal;
