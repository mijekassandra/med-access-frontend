import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import { useGetAllUsersQuery } from "../../user/api/userApi";

interface PregnancyRecord {
  id: string;
  fullName: string;
  startDate: string;
  weeksOfPregnancy: number;
  milestoneName: string;
  status: "Ongoing" | "Completed" | "Pending";
}

interface AddPregnancyRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  pregnancyRecord?: PregnancyRecord;
  onSave?: (pregnancyRecord: PregnancyRecord) => void;
}

const statusOptions = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
];

const AddPregnancyRecordModal = ({
  isOpen,
  onClose,
  mode,
  pregnancyRecord,
  onSave,
}: AddPregnancyRecordModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    startDate: "",
    weeksOfPregnancy: 0,
    milestoneName: "",
    status: "Ongoing" as "Ongoing" | "Completed" | "Pending",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Fetch all users for the dropdown
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery(undefined, {
    skip: !isOpen, // Only fetch when modal is open
  });

  // Transform users data into dropdown options (only users with role "user")
  const userOptions: Option[] =
    usersData?.data
      ?.filter((user) => user.role === "user")
      ?.map((user) => ({
        label: user.fullName,
        value: user.fullName,
      })) || [];

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (pregnancyRecord && (mode === "edit" || mode === "view")) {
      setFormData({
        fullName: pregnancyRecord.fullName,
        startDate: pregnancyRecord.startDate,
        weeksOfPregnancy: pregnancyRecord.weeksOfPregnancy,
        milestoneName: pregnancyRecord.milestoneName,
        status: pregnancyRecord.status,
      });
    } else if (mode === "add") {
      setFormData({
        fullName: "",
        startDate: "",
        weeksOfPregnancy: 0,
        milestoneName: "",
        status: "Ongoing",
      });
    }
  }, [pregnancyRecord, mode, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
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
        id: pregnancyRecord?.id || "",
        ...formData,
      });
    }

    onClose();
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      startDate: "",
      weeksOfPregnancy: 0,
      milestoneName: "",
      status: "Ongoing",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD PREGNANCY RECORD";
      case "edit":
        return "EDIT PREGNANCY RECORD";
      case "view":
        return "PREGNANCY RECORD DETAILS";
      default:
        return "PREGNANCY RECORD";
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
        disabled: isLoading,
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
        contentHeight="h-[55vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Full width inputs */}
            <Dropdown
              label="FULL NAME"
              size="small"
              searchable={true}
              placeholder={
                usersLoading
                  ? "Loading users..."
                  : usersError
                  ? "Error loading users"
                  : "Select Full Name"
              }
              options={userOptions}
              value={userOptions.find(
                (option) => option.value === formData.fullName
              )}
              onSelectionChange={(selected) => {
                const selectedValue = Array.isArray(selected)
                  ? selected[0]?.value
                  : selected.value;
                handleInputChange("fullName", selectedValue || "");
              }}
              disabled={mode === "view" || usersLoading || !!usersError}
              usePortal={true}
            />

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="START DATE"
                placeholder="Enter Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                disabled={mode === "view"}
              />
              <Inputs
                label="WEEKS OF PREGNANCY"
                placeholder="Enter Weeks"
                type="number"
                value={formData.weeksOfPregnancy.toString()}
                onChange={(e) =>
                  handleInputChange(
                    "weeksOfPregnancy",
                    parseInt(e.target.value) || 0
                  )
                }
                disabled={mode === "view"}
              />
            </div>

            {/* Milestone name */}
            <Inputs
              label="MILESTONE NAME"
              placeholder="Enter Milestone Name"
              value={formData.milestoneName}
              onChange={(e) =>
                handleInputChange("milestoneName", e.target.value)
              }
              disabled={mode === "view"}
            />

            {/* Status dropdown */}
            <Dropdown
              label="STATUS"
              placeholder="Select Status"
              size="small"
              options={statusOptions}
              value={statusOptions.find(
                (option) => option.value === formData.status
              )}
              onSelectionChange={(selected) =>
                handleInputChange(
                  "status",
                  Array.isArray(selected) ? selected[0]?.value : selected.value
                )
              }
              disabled={mode === "view"}
              usePortal={true}
            />
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={`Pregnancy record has been ${
          mode === "edit" ? "updated" : "added"
        } successfully.`}
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddPregnancyRecordModal;
