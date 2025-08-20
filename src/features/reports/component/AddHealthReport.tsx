import React, { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface HealthReport {
  id: string;
  title: string;
  type: string;
  content: string;
  date: string;
}

interface AddHealthReportProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  report?: HealthReport;
  onSave?: (report: HealthReport) => void;
}

const AddHealthReport = ({
  isOpen,
  onClose,
  mode,
  report,
  onSave,
}: AddHealthReportProps) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    content: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitReportLoading, setIsSubmitReportLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (report && (mode === "edit" || mode === "view")) {
      setFormData({
        title: report.title,
        type: report.type,
        content: report.content,
        date: report.date,
      });
    } else if (mode === "add") {
      setFormData({
        title: "",
        type: "",
        content: "",
        date: "",
      });
    }
  }, [report, mode, isOpen]);

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

    if (onSave && mode === "edit") {
      onSave({
        id: report?.id || "",
        ...formData,
      });
    }

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

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD HEALTH DATA REPORT";
      case "edit":
        return "EDIT ";
      case "view":
        return "HEALTH DATA REPORT";
      default:
        return "HEALTH DATA REPORT";
    }
  };

  const getFooterButtons = () => {
    if (mode === "view") {
      return [];
    }

    const baseButtons = [
      {
        label: "Cancel",
        variant: "ghost" as const,
        onClick: handleCancel,
        size: "medium" as const,
      },
    ];

    if (mode === "edit") {
      return [
        ...baseButtons,
        {
          label: "Save Changes",
          variant: "primary" as const,
          onClick: handleSave,
          size: "medium" as const,
          loading: isLoading,
        },
      ];
    }

    // Add mode
    return [
      ...baseButtons,
      {
        label: "Save",
        variant: "primary" as const,
        onClick: handleSave,
        size: "medium" as const,
        loading: isLoading,
      },
      {
        label: "Submit Report",
        variant: "secondary" as const,
        onClick: handleSubmit,
        size: "medium" as const,
        loading: isSubmitReportLoading,
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
              label="TITLE OF REPORT"
              placeholder=""
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={mode === "view"}
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
                value={
                  formData.type
                    ? {
                        label: formData.type,
                        value: formData.type.toLowerCase(),
                      }
                    : undefined
                }
                onSelectionChange={(selected: Option) =>
                  handleInputChange("type", selected.label)
                }
                disabled={mode === "view"}
              />
            </div>

            <Inputs
              label="DATA/CONTENT"
              placeholder=""
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              disabled={mode === "view"}
            />

            <Inputs
              label="DATE OF REPORT"
              placeholder="Enter date of report"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              disabled={mode === "view"}
            />
          </div>
        }
      />

      <SnackbarAlert
        isOpen={showSnackbar}
        title={`Health report has been ${
          mode === "edit" ? "updated" : "saved"
        } successfully.`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddHealthReport;
