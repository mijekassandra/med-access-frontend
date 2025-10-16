import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, CloseCircle } from "iconsax-react";
import Input from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import Modal from "../../../global-components/Modal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface MobileBookInPersonProps {
  onNavigateBack?: () => void;
}

const MobileBookInPerson: React.FC<MobileBookInPersonProps> = ({
  onNavigateBack,
}) => {
  const location = useLocation();
  const rescheduleData = location.state?.rescheduleData;

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    doctor: "",
    description: "",
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Option | null>(null);

  // Sample doctor options
  const doctorOptions: Option[] = [
    { label: "Dr. Sarah Johnson", value: "dr-sarah-johnson" },
    { label: "Dr. Michael Chen", value: "dr-michael-chen" },
    { label: "Dr. Emily Rodriguez", value: "dr-emily-rodriguez" },
    { label: "Dr. David Thompson", value: "dr-david-thompson" },
    { label: "Dr. Lisa Wang", value: "dr-lisa-wang" },
  ];

  const [errors, setErrors] = useState({
    date: false,
    time: false,
    doctor: false,
    description: false,
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Handle reschedule data
  useEffect(() => {
    if (rescheduleData) {
      // Find the doctor option that matches the reschedule data
      const doctorOption = doctorOptions.find(
        (option) => option.label === rescheduleData.doctor
      );
      if (doctorOption) {
        setSelectedDoctor(doctorOption);
        setFormData((prev) => ({ ...prev, doctor: doctorOption.label }));
      }

      // Set the date and time from reschedule data
      if (rescheduleData.date) {
        // Convert the date format if needed
        const dateObj = new Date(rescheduleData.date);
        setFormData((prev) => ({
          ...prev,
          date: dateObj.toISOString().split("T")[0],
        }));
      }

      if (rescheduleData.time) {
        // Convert 12-hour format to 24-hour format for time input
        const time24 = convertTo24Hour(rescheduleData.time);
        setFormData((prev) => ({ ...prev, time: time24 }));
      }
    }
  }, [rescheduleData]);

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12: string) => {
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}`;
  };

  const handleDoctorSelection = (selected: Option | Option[]) => {
    const doctor = Array.isArray(selected) ? selected[0] : selected;
    setSelectedDoctor(doctor);
    setFormData((prev) => ({ ...prev, doctor: doctor.label }));
    if (errors.doctor) {
      setErrors((prev) => ({ ...prev, doctor: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {
      date: !formData.date,
      time: !formData.time,
      doctor: !selectedDoctor,
      description: !formData.description,
    };

    setErrors(newErrors);

    // If no errors, show confirmation modal
    if (!Object.values(newErrors).some(Boolean)) {
      setShowConfirmationModal(true);
    }
  };

  const handleConfirmBooking = () => {
    // Close confirmation modal
    setShowConfirmationModal(false);

    // Show success snackbar
    setShowSnackbar(true);

    // Reset form after successful booking
    setTimeout(() => {
      setSelectedDoctor(null);
      setFormData({ date: "", time: "", doctor: "", description: "" });
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleBackClick = () => {
    // Navigate back to appointment page
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  // Check if all required fields are selected
  const isFormValid =
    selectedDoctor && formData.date && formData.time && formData.description;

  return (
    <div className="min-h-screen bg-szWhite100">
      {/* Header */}
      <div className="bg-szWhite100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-szPrimary300 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-szPrimary700" />
          </button>
          <h1 className="text-h4 text-szPrimary700 font-bold">
            Book Appointment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-2 ">
        {/* Form Card */}
        <div className="bg-szWhite100 rounded-xl shadow-lg p-6 border">
          <h4 className="text-h4 text-szPrimary700 font-bold mb-6">
            {rescheduleData
              ? "Reschedule In-Person Appointment"
              : "In-Person Appointment"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Field */}
            <div>
              <Input
                label="SELECT DATE"
                type="date"
                placeholder="MM-DD-YYYY"
                value={formData.date}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, date: e.target.value }));
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: false }));
                  }
                }}
                error={errors.date}
              />
            </div>

            {/* Time Field */}
            <div>
              <Input
                label="SELECT TIME"
                type="time"
                placeholder="Select time"
                value={formData.time}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, time: e.target.value }));
                  if (errors.time) {
                    setErrors((prev) => ({ ...prev, time: false }));
                  }
                }}
                error={errors.time}
              />
            </div>

            {/* Doctor Selection */}
            <div className="z-20">
              <Dropdown
                label="SELECT DOCTOR"
                placeholder="Select a doctor"
                options={doctorOptions}
                value={selectedDoctor || undefined}
                onSelectionChange={handleDoctorSelection}
                error={errors.doctor}
                size="small"
                usePortal
                disabled={!!rescheduleData}
              />
            </div>

            {/* Description Field */}
            <div className="z-0">
              <Input
                label="DESCRIPTION"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: false }));
                  }
                }}
                isTextarea={true}
                className="min-h-[180px] z-0"
                error={errors.description}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                label={rescheduleData ? "Reschedule" : "Submit"}
                variant="primary"
                size="medium"
                fullWidth={true}
                disabled={!isFormValid}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        customHeader={
          <div className="flex items-center justify-between w-full">
            <h6 className="text-h6 text-szPrimary700">
              {rescheduleData
                ? "Confirm Reschedule"
                : "Confirm In-Person Appointment"}
            </h6>
            <CloseCircle
              onClick={() => setShowConfirmationModal(false)}
              size={28}
              className="text-szPrimary700 cursor-pointer"
            />
          </div>
        }
        showButton={false}
        footerButtons={[
          {
            label: "Back",
            variant: "ghost",
            size: "medium",
            onClick: () => setShowConfirmationModal(false),
          },
          {
            label: "Submit",
            variant: "primary",
            size: "medium",
            onClick: handleConfirmBooking,
          },
        ]}
        footerOptions="stacked-left"
        content={
          <>
            <p className="text-szDarkGrey600 text-body-base-strong mb-4">
              {rescheduleData
                ? "Please confirm your rescheduled in-person appointment details:"
                : "Please confirm your in-person appointment details:"}
            </p>

            <div className="bg-szLightGrey50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <p className="text-szGrey500 text-body-small-reg">Doctor:</p>
                <p className="text-szBlack700 text-body-small-strong">
                  {selectedDoctor?.label}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-szGrey500 text-body-small-reg">Date:</p>
                <p className="text-szBlack700 text-body-small-strong">
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-szGrey500 text-body-small-reg">Time:</p>
                <p className="text-szBlack700 text-body-small-strong">
                  {formData.time
                    ? (() => {
                        // Convert 24-hour format to 12-hour format with AM/PM
                        const [hours, minutes] = formData.time.split(":");
                        const hour24 = parseInt(hours);
                        const hour12 =
                          hour24 === 0
                            ? 12
                            : hour24 > 12
                            ? hour24 - 12
                            : hour24;
                        const ampm = hour24 >= 12 ? "PM" : "AM";
                        return `${hour12}:${minutes} ${ampm}`;
                      })()
                    : ""}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-szGrey500 text-body-small-reg">
                  Description:
                </p>
                <p className="text-szBlack700 text-body-small-strong">
                  {formData.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3"></div>
          </>
        }
      />

      {/* Success Snackbar */}
      <SnackbarAlert
        isOpen={showSnackbar}
        message={
          rescheduleData
            ? "Congratulations! You just rescheduled your in-person appointment."
            : "Congratulations! You just booked an in-person appointment."
        }
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </div>
  );
};

export default MobileBookInPerson;
