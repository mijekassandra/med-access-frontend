import React, { useState } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import Dropdown from "../../../global-components/Dropdown";

interface AddHealthReportProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddHealthReport = ({ isOpen, onClose }: AddHealthReportProps) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    content: "",
    date: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving report:", formData);
    // Here you would typically save the data
    onClose();
  };

  const handleSubmit = () => {
    console.log("Submitting report:", formData);
    // Here you would typically submit the report
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      type: "",
      content: "",
      date: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showButton={false}
      title="HEALTH DATA REPORT"
      modalWidth="w-[640px]"
      contentHeight="h-[50vh]"
      headerOptions="left"
      footerOptions="stacked-left"
      footerButtons={[
        {
          label: "Cancel",
          variant: "ghost",
          onClick: handleCancel,
          size: "medium",
        },
        {
          label: "Save",
          variant: "primary",
          onClick: handleSave,
          size: "medium",
        },
        {
          label: "Submit Report",
          variant: "secondary",
          onClick: handleSubmit,
          size: "medium",
        },
      ]}
      content={
        <div className="space-y-4 mt-2">
          {/* Full width inputs */}
          <Inputs
            label="TITLE OF REPORT"
            placeholder=""
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
          <div className="z-50">
            <Dropdown
              label="TYPE OF REPORT"
              size="small"
              placeholder=""
              options={[
                {
                  label: "Morbidity",
                  value: "morbidity",
                },
                {
                  label: "Immunization",
                  value: "immunization",
                },
                {
                  label: "Maternity",
                  value: "maternity",
                },
                {
                  label: "Pediatrics",
                  value: "pediatrics",
                },
              ]}
              usePortal={true}
              onSelectionChange={(e) =>
                handleInputChange("type", e.target.value)
              }
            />
          </div>

          <Inputs
            label="DATA/CONTENT"
            placeholder=""
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
          />

          <Inputs
            label="DATE OF REPORT"
            placeholder="Enter date of report"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div>
      }
    />
  );
};

export default AddHealthReport;
