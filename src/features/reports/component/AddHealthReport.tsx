import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type { HealthReportTable } from "../../../types/database";

// integration
import {
  useAddHealthReportMutation,
  useEditHealthReportMutation,
} from "../api/healthReportsApi";

interface AddHealthReportProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  report?: HealthReportTable;
  onSave?: (report: HealthReportTable) => void;
}

const AddHealthReport = ({
  isOpen,
  onClose,
  mode,
  report,
}: // onSave,
AddHealthReportProps) => {
  const [formData, setFormData] = useState({
    title: "",
    report_type: "",
    data_collected: "",
    report_date: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    report_type: "",
    data_collected: "",
    report_date: "",
  });
  // const [isLoading, setIsLoading] = useState(false);
  // const [isSubmitReportLoading, setIsSubmitReportLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [addHealthReport, { isLoading: isAdding }] =
    useAddHealthReportMutation();
  const [editHealthReport, { isLoading: isEditing }] =
    useEditHealthReportMutation();

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (report && (mode === "edit" || mode === "view")) {
      setFormData({
        title: report.title,
        report_type: report.report_type,
        data_collected: report.data_collected,
        report_date: new Date(report.report_date).toISOString().split("T")[0],
      });
    } else if (mode === "add") {
      setFormData({
        title: "",
        report_type: "",
        data_collected: "",
        report_date: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      title: "",
      report_type: "",
      data_collected: "",
      report_date: "",
    });
  }, [report, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {
      title: "",
      report_type: "",
      data_collected: "",
      report_date: "",
    };

    // Check if title is empty
    if (!formData.title.trim()) {
      errors.title = "This field is required";
    }

    // Check if report type is empty
    if (!formData.report_type.trim()) {
      errors.report_type = "This field is required";
    }

    // Check if data collected is empty
    if (!formData.data_collected.trim()) {
      errors.data_collected = "This field is required";
    }

    // Check if report date is empty
    if (!formData.report_date.trim()) {
      errors.report_date = "This field is required";
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  // Handle save
  const handleSave = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }
    try {
      if (mode === "add") {
        await addHealthReport({
          doctor_id: 1,
          title: formData.title,
          report_type: formData.report_type,
          data_collected: formData.data_collected,
          report_date: new Date(formData.report_date),
          status: "active",
        }).unwrap();

        setSnackbarMessage("Health report added successfully!");
        setSnackbarType("success");
      } else if (mode === "edit" && report) {
        await editHealthReport({
          id: report.id,
          report: {
            title: formData.title,
            report_type: formData.report_type,
            data_collected: formData.data_collected,
            report_date: new Date(formData.report_date),
          },
        }).unwrap();

        setSnackbarMessage("Health report updated successfully!");
        setSnackbarType("success");
      }

      setShowSnackbar(true);
      onClose();
    } catch (error) {
      console.error("Failed to save report:", error);
      setSnackbarMessage("Failed to save report. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  // const handleSubmit = async () => {
  //   // Validate form first
  //   if (!validateForm()) {
  //     setSnackbarMessage("Please fill in all required fields.");
  //     setSnackbarType("error");
  //     setShowSnackbar(true);
  //     return;
  //   }

  //   try {
  //     setIsSubmitReportLoading(true);

  //     // First save the report, then submit
  //     await addHealthReport({
  //       doctor_id: 1, // TODO: Get from auth context
  //       title: formData.title,
  //       report_type: formData.report_type,
  //       data_collected: formData.data_collected,
  //       report_date: new Date(formData.report_date),
  //     }).unwrap();

  //     // TODO: Add submit report API call here
  //     // await submitHealthReport({ report_id: newReport.report_id }).unwrap();

  //     setSnackbarMessage("Health report submitted successfully!");
  //     setSnackbarType("success");
  //     setShowSnackbar(true);
  //     onClose();
  //   } catch (error) {
  //     console.error("Failed to submit report:", error);
  //     setSnackbarMessage("Failed to submit report. Please try again.");
  //     setSnackbarType("error");
  //     setShowSnackbar(true);
  //   } finally {
  //     setIsSubmitReportLoading(false);
  //   }
  // };

  const handleCancel = () => {
    setFormData({
      title: "",
      report_type: "",
      data_collected: "",
      report_date: "",
    });
    setFormErrors({
      title: "",
      report_type: "",
      data_collected: "",
      report_date: "",
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
        return "EDIT HEALTH DATA REPORT";
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
          loading: isEditing,
        },
      ];
    }

    // Add mode
    return [
      ...baseButtons,
      {
        label: "Submit",
        variant: "primary" as const,
        onClick: handleSave,
        size: "medium" as const,
        loading: isAdding,
      },
      // {
      //   label: "Submit Report",
      //   variant: "secondary" as const,
      //   onClick: handleSubmit,
      //   size: "medium" as const,
      //   loading: isSubmitReportLoading,
      // },
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
        contentHeight="h-[60vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Full width inputs */}
            <Inputs
              label="TITLE OF REPORT"
              placeholder="Enter report title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.title}
            />
            <div className="z-50">
              <Dropdown
                label="TYPE OF REPORT"
                size="small"
                placeholder="Select report type"
                error={!!formErrors.report_type}
                options={[
                  {
                    label: "Morbidity",
                    value: "Morbidity",
                  },
                  {
                    label: "Immunization",
                    value: "Immunization",
                  },
                  {
                    label: "Maternal Health",
                    value: "Maternal Health",
                  },
                  {
                    label: "Pediatric",
                    value: "Pediatric",
                  },
                  {
                    label: "Emergency",
                    value: "Emergency",
                  },
                ]}
                usePortal={true}
                value={
                  formData.report_type
                    ? {
                        label: formData.report_type,
                        value: formData.report_type,
                      }
                    : undefined
                }
                onSelectionChange={(selected: Option | Option[]) => {
                  if (Array.isArray(selected)) return;
                  handleInputChange("report_type", selected.label);
                }}
                disabled={mode === "view"}
              />
            </div>

            <Inputs
              label="DATE OF REPORT"
              placeholder="Enter date of report"
              type="date"
              value={formData.report_date}
              onChange={(e) => handleInputChange("report_date", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.report_date}
            />
            <Inputs
              label="DATA/CONTENT"
              placeholder="Enter report data/content"
              value={formData.data_collected}
              onChange={(e) =>
                handleInputChange("data_collected", e.target.value)
              }
              disabled={mode === "view"}
              error={!!formErrors.data_collected}
              isTextarea
              maxCharacter={1000}
            />
          </div>
        }
      />

      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddHealthReport;
