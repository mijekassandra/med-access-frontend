import React, { useState, useEffect } from "react";

import Modal from "../../../global-components/Modal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

import { useUploadPrescriptionMutation } from "../api/appointmentApi";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.gif";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface UploadPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string | null;
  onSuccess?: () => void;
}

const UploadPrescriptionModal: React.FC<UploadPrescriptionModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">("success");

  const [uploadPrescription, { isLoading }] = useUploadPrescriptionMutation();

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setFileError("");
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFileError("");
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setFileError("File must be 5 MB or less.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!appointmentId) return;
    setFileError("");
    if (!file) {
      setFileError("Please select a file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setFileError("File must be 5 MB or less.");
      return;
    }
    try {
      await uploadPrescription({ id: appointmentId, file }).unwrap();
      setSnackbarMessage("Prescription uploaded.");
      setSnackbarType("success");
      setShowSnackbar(true);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to upload prescription.";
      setSnackbarMessage(message);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title="Upload prescription"
        modalWidth="max-w-[544px]"
        contentHeight="h-auto"
        headerOptions="left"
        showFooter={true}
        footerOptions="stacked-left"
        footerButtons={[
          {
            label: "Cancel",
            variant: "ghost",
            onClick: onClose,
            size: "medium",
            disabled: isLoading,
          },
          {
            label: "Upload",
            variant: "primary",
            onClick: handleSubmit,
            size: "medium",
            loading: isLoading,
            disabled: isLoading || !file,
          },
        ]}
        content={
          <div className="space-y-4 py-2">
            <p className="text-body-small-reg text-szBlack700">
              PDF or image, max 5 MB.
            </p>
            <input
              type="file"
              accept={ACCEPT}
              onChange={handleFileChange}
              className="block w-full text-sm text-szBlack700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary50 file:text-primary700 hover:file:bg-primary100"
            />
            {file && (
              <p className="text-body-small-reg text-szBlack600">
                Selected: {file.name}
              </p>
            )}
            {fileError && (
              <p className="text-caption-reg text-error700">{fileError}</p>
            )}
          </div>
        }
      />
      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={() => setShowSnackbar(false)}
        duration={3000}
      />
    </>
  );
};

export default UploadPrescriptionModal;
