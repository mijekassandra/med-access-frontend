import React from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";

interface AddUserMedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserMedicalModal = ({ isOpen, onClose }: AddUserMedicalModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showButton={false}
      title="Add User Medical Record"
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
            <Inputs label="DIAGNOSIS" placeholder="Enter Diagnosis" />
            <Inputs
              label="DATE OF RECORD"
              placeholder="Enter Date of Record"
              type="datetime-local"
            />
          </div>

          {/* Full width treatment plan */}
          <Inputs
            label="TREATMENT PLAN"
            placeholder="Enter Treatment Plan"
            isTextarea
            maxCharacter={150}
          />
        </div>
      }
    ></Modal>
  );
};

export default AddUserMedicalModal;
