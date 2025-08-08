import React, { useState } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import Dropdown from "../../../global-components/Dropdown";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitReportLoading, setIsSubmitReportLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSnackbar(true);
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitReportLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitReportLoading(false);
    setShowSnackbar(true);
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

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
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
            loading: isLoading,
          },
          {
            label: "Submit Report",
            variant: "secondary",
            onClick: handleSubmit,
            size: "medium",
            loading: isSubmitReportLoading,
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

      <SnackbarAlert
        isOpen={showSnackbar}
        title="Health report has been saved successfully."
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddHealthReport;
