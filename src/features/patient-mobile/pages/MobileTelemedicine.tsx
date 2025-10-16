import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, ArrowLeft2, ArrowRight2, CloseCircle } from "iconsax-react";
import Button from "../../../global-components/Button";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import Modal from "../../../global-components/Modal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

interface MobileTelemedicineProps {
  onNavigateBack?: () => void;
}

const MobileTelemedicine: React.FC<MobileTelemedicineProps> = ({
  onNavigateBack,
}) => {
  const location = useLocation();
  const rescheduleData = location.state?.rescheduleData;

  const [selectedDoctor, setSelectedDoctor] = useState<Option | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, -1 = previous week

  const [errors, setErrors] = useState({
    doctor: false,
    date: false,
    time: false,
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
      }

      // Set the date and time from reschedule data
      if (rescheduleData.date) {
        // Convert the date format if needed
        const dateObj = new Date(rescheduleData.date);
        setSelectedDate(dateObj.toISOString().split("T")[0]);
      }

      if (rescheduleData.time) {
        setSelectedTime(rescheduleData.time);
      }
    }
  }, [rescheduleData]);

  // Sample doctor options
  const doctorOptions: Option[] = [
    { label: "Dr. Sarah Johnson", value: "dr-sarah-johnson" },
    { label: "Dr. Michael Chen", value: "dr-michael-chen" },
    { label: "Dr. Emily Rodriguez", value: "dr-emily-rodriguez" },
    { label: "Dr. David Thompson", value: "dr-david-thompson" },
    { label: "Dr. Lisa Wang", value: "dr-lisa-wang" },
  ];

  // Available time slots
  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "11:45 AM",
    "12:05 PM",
    "1:00 PM",
    "1:45 PM",
    "2:30 PM",
    "3:15 PM",
    "4:00 PM",
  ];

  // Generate dates for current week
  const generateDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate the start of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    // Add or subtract weeks based on currentWeek state
    const targetWeek = new Date(startOfWeek);
    targetWeek.setDate(startOfWeek.getDate() + currentWeek * 7);

    const dates = [];
    const currentDate = new Date(targetWeek);

    // Generate 7 days starting from Sunday of target week
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    });
  };

  const formatMonthYear = (dates: Date[]) => {
    // Get the month/year from the middle date of the week
    const middleDate = dates[3]; // Wednesday (middle of the week)
    return middleDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleDoctorSelection = (selected: Option | Option[]) => {
    const doctor = Array.isArray(selected) ? selected[0] : selected;
    setSelectedDoctor(doctor);
    if (errors.doctor) {
      setErrors((prev) => ({ ...prev, doctor: false }));
    }
  };

  const handleDateSelection = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: false }));
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if form is valid before proceeding
    if (!isFormValid) {
      return;
    }

    // Basic validation
    const newErrors = {
      doctor: !selectedDoctor,
      date: !selectedDate,
      time: !selectedTime,
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
      setSelectedDate("");
      setSelectedTime("");
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleBackClick = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => {
      if (direction === "prev") {
        return prev - 1;
      } else {
        return prev + 1;
      }
    });
  };

  const dates = generateDates();

  // Check if all required fields are selected
  const isFormValid = selectedDoctor && selectedDate && selectedTime;

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
          <h1 className="text-h4 text-szPrimary700 font-bold">Telemedicine</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-2">
        {/* Form Card */}
        <div className="bg-szWhite100 rounded-xl shadow-lg p-6 border">
          <h4 className="text-h4 text-szPrimary700 font-bold mb-6">
            {rescheduleData
              ? "Reschedule Telemedicine Appointment"
              : "Telemedicine Appointment"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div className="z-20">
              <Dropdown
                label="AVAILABLE DOCTOR"
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

            {/* Date Selection */}
            <div>
              <h6 className="text-h6 text-szSecondary700 font-semibold mb-4">
                Select Date
              </h6>

              {/* Month Navigation -------------------------------*/}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateWeek("prev")}
                  className="p-2 hover:bg-szPrimary100 rounded-lg transition-colors"
                >
                  <ArrowLeft2 size={20} className="text-szPrimary700" />
                </button>
                <h5 className="text-h5 text-szBlack700 font-semibold">
                  {formatMonthYear(dates)}
                </h5>
                <button
                  type="button"
                  onClick={() => navigateWeek("next")}
                  className="p-2 hover:bg-szPrimary100 rounded-lg transition-colors"
                >
                  <ArrowRight2 size={20} className="text-szPrimary700" />
                </button>
              </div>

              {/* Date Buttons --------------------------------- */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dates.map((date, index) => {
                  const dateString = date.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateString;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelection(date)}
                      className={`p-1 rounded-lg text-center transition-colors  ${
                        isSelected
                          ? "bg-szPrimary200 text-szPrimary700 border border-szPrimary200"
                          : "bg-gray-100 text-szBlack700 hover:bg-szPrimary200 border border-szGrey300"
                      }`}
                    >
                      <p
                        className={`text-caption-reg text-szGrey600 ${
                          isSelected ? "text-szPrimary700" : ""
                        }`}
                      >
                        {formatDate(date).split(" ")[1]}
                      </p>
                      <p
                        className={`text-body-base-strong font-semibold ${
                          isSelected ? "text-szPrimary700" : ""
                        }`}
                      >
                        {formatDate(date).split(" ")[0]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h6 className="text-h6 text-szSecondary700 font-semibold mb-4">
                Available Time Only
              </h6>

              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelection(time)}
                      className={`p-2 rounded-lg text-center transition-colors text-body-base-strong ${
                        isSelected
                          ? "bg-szPrimary200 text-szPrimary700 border border-szPrimary200"
                          : "bg-gray-100 text-szBlack700 hover:bg-szPrimary200 border border-szGrey300"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                label={
                  rescheduleData
                    ? "Reschedule Appointment"
                    : "Submit Appointment"
                }
                variant="secondary"
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
                : "Confirm Telemedicine Appointment"}
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
                ? "Please confirm your rescheduled telemedicine appointment details:"
                : "Please confirm your telemedicine appointment details:"}
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
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-US", {
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
                <span className="text-szBlack700 text-body-small-strong">
                  {selectedTime}
                </span>
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
            ? "Congratulations! You just rescheduled your telemedicine appointment."
            : "Congratulations! You just booked a telemedicine appointment."
        }
        type="success"
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </div>
  );
};

export default MobileTelemedicine;
