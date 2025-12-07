import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Button from "../../../global-components/Button";
import {
  useAddCheckupMutation,
  type PregnancyRecord,
  type AddCheckupRequest,
} from "../api/pregnancyRecordApi";
import { Add, Calendar, DocumentText } from "iconsax-react";

interface CheckupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pregnancyRecord: PregnancyRecord | null;
  onCheckupAdded?: () => void;
  onError?: (message: string) => void;
}

const CheckupsModal = ({
  isOpen,
  onClose,
  pregnancyRecord,
  onCheckupAdded,
  onError,
}: CheckupsModalProps) => {
  const [checkupForm, setCheckupForm] = useState({
    date: "",
    remarks: "",
  });
  const [checkupErrors, setCheckupErrors] = useState({
    date: "",
    remarks: "",
  });
  const [showAddCheckupForm, setShowAddCheckupForm] = useState(false);

  const [addCheckup, { isLoading: isAddingCheckup }] = useAddCheckupMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowAddCheckupForm(false);
      setCheckupForm({ date: "", remarks: "" });
      setCheckupErrors({ date: "", remarks: "" });
    }
  }, [isOpen]);

  const handleCheckupInputChange = (field: string, value: string) => {
    setCheckupForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (checkupErrors[field as keyof typeof checkupErrors]) {
      setCheckupErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateCheckupForm = () => {
    const errors = {
      date: "",
      remarks: "",
    };

    if (!checkupForm.date) {
      errors.date = "Date is required";
    }

    if (!checkupForm.remarks) {
      errors.remarks = "Remarks are required";
    } else if (checkupForm.remarks.length > 1000) {
      errors.remarks = "Remarks must be less than 1000 characters";
    }

    setCheckupErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleAddCheckup = async () => {
    if (!pregnancyRecord) return;

    if (!validateCheckupForm()) {
      setSnackbarMessage(
        "Please fill in all required checkup fields correctly"
      );
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      const checkupData: AddCheckupRequest = {
        date: checkupForm.date,
        remarks: checkupForm.remarks,
      };

      await addCheckup({
        id: pregnancyRecord._id,
        data: checkupData,
      }).unwrap();

      setSnackbarMessage("Checkup added successfully");
      setSnackbarType("success");
      setShowSnackbar(true);
      setCheckupForm({ date: "", remarks: "" });
      setShowAddCheckupForm(false);
      setCheckupErrors({ date: "", remarks: "" });

      // Notify parent to refetch data
      onCheckupAdded?.();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to add checkup. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
      onError?.(errorMessage);
    }
  };

  const handleCancelAddCheckup = () => {
    setCheckupForm({ date: "", remarks: "" });
    setCheckupErrors({ date: "", remarks: "" });
    setShowAddCheckupForm(false);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const checkups = pregnancyRecord?.checkups || [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title={`CHECKUPS - ${pregnancyRecord?.patient 
          ? `${pregnancyRecord.patient.firstName} ${pregnancyRecord.patient.lastName}`
          : "Unknown Patient"}`}
        modalWidth="w-[640px]"
        contentHeight="h-[70vh]"
        headerOptions="left"
        showFooter={false}
        content={
          <div className="space-y-4 mt-2">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body-base-semibold text-szBlack700">
                All Checkups ({checkups.length})
              </h3>
              <Button
                label="Add Checkup"
                leftIcon={<Add size={16} />}
                size="small"
                variant="secondary"
                onClick={() => setShowAddCheckupForm(true)}
                disabled={isAddingCheckup || !pregnancyRecord}
              />
            </div>

            {/* Add Checkup Form */}
            {showAddCheckupForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3 border border-gray-200">
                <h4 className="text-body-small-semibold text-szBlack700 mb-2">
                  Add New Checkup
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Inputs
                      label="CHECKUP DATE"
                      placeholder="Enter Date"
                      type="date"
                      value={checkupForm.date}
                      onChange={(e) =>
                        handleCheckupInputChange("date", e.target.value)
                      }
                      disabled={isAddingCheckup}
                      error={!!checkupErrors.date}
                    />
                    {checkupErrors.date && (
                      <span className="text-body-small-reg text-error700 mt-1 block">
                        {checkupErrors.date}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Inputs
                    label="REMARKS"
                    placeholder="Enter Checkup Remarks (max 1000 characters)"
                    isTextarea
                    value={checkupForm.remarks}
                    onChange={(e) =>
                      handleCheckupInputChange("remarks", e.target.value)
                    }
                    disabled={isAddingCheckup}
                    error={!!checkupErrors.remarks}
                    maxCharacter={1000}
                  />
                  {checkupErrors.remarks && (
                    <span className="text-body-small-reg text-error700 mt-1 block">
                      {checkupErrors.remarks}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    label="Cancel"
                    variant="ghost"
                    size="small"
                    onClick={handleCancelAddCheckup}
                    disabled={isAddingCheckup}
                  />
                  <Button
                    label="Save"
                    variant="primary"
                    size="small"
                    onClick={handleAddCheckup}
                    loading={isAddingCheckup}
                  />
                </div>
              </div>
            )}

            {/* Checkups List */}
            {checkups.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {checkups.map((checkup, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <Calendar
                        size={20}
                        className="text-szPrimary700 mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-body-small-semibold text-szBlack700">
                            {new Date(checkup.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <DocumentText
                            size={16}
                            className="text-szGrey500 mt-0.5 flex-shrink-0"
                          />
                          <p className="text-body-small-reg text-szBlack700">
                            {checkup.remarks}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-body-small-reg text-szGrey500 border border-gray-200 rounded-lg bg-gray-50">
                No checkups recorded yet. Click "Add Checkup" to add the first
                one.
              </div>
            )}
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

export default CheckupsModal;
