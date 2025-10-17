import { useState } from "react";
import { useNavigate } from "react-router-dom";

//react
import { ArrowLeft, SearchNormal1 } from "iconsax-react";

//components
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";
import PatientAppointmentCard from "../components/PatientAppointmentCard";
import Button from "../../../global-components/Button";
import Inputs from "../../../global-components/Inputs";
import ConfirmationModal from "../../../components/ConfirmationModal";
import NoSearchFound from "../../../global-components/NoSearchFound";

interface AppointmentData {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  doctorImage?: string;
  type: "telemedicine" | "in_person";
  status: "pending" | "confirmed" | "completed" | "canceled";
}

const MobileAllAppointments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All Types");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState("All Status");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<AppointmentData | null>(null);

  // Sample appointment data - in real app, this would come from API
  const allAppointments: AppointmentData[] = [
    {
      id: 1,
      doctorName: "Dr. Amethyst Lim",
      specialty: "ENT Specialist",
      date: "January 1, 2025",
      time: "10:00 AM",
      doctorImage: "https://i.pravatar.cc/150?img=5",
      type: "telemedicine",
      status: "confirmed",
    },
    {
      id: 2,
      doctorName: "Dr. Lucas Ho",
      specialty: "Cardiologist",
      date: "January 1, 2025",
      time: "10:00 AM",
      doctorImage: "https://i.pravatar.cc/150?img=12",
      type: "in_person",
      status: "pending",
    },
    {
      id: 3,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Dermatologist",
      date: "January 2, 2025",
      time: "2:00 PM",
      doctorImage: "https://i.pravatar.cc/150?img=8",
      type: "telemedicine",
      status: "completed",
    },
    {
      id: 4,
      doctorName: "Dr. Michael Chen",
      specialty: "General Practitioner",
      date: "January 3, 2025",
      time: "9:00 AM",
      doctorImage: "https://i.pravatar.cc/150?img=15",
      type: "in_person",
      status: "confirmed",
    },
    {
      id: 5,
      doctorName: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      date: "January 4, 2025",
      time: "11:30 AM",
      doctorImage: "https://i.pravatar.cc/150?img=3",
      type: "telemedicine",
      status: "canceled",
    },
  ];

  // Filter appointments based on search term and selected filters
  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const typeMatch =
      selectedTypeFilter === "All Types" ||
      (selectedTypeFilter === "Telemedicine" &&
        appointment.type === "telemedicine") ||
      (selectedTypeFilter === "In-Person" && appointment.type === "in_person");

    const statusMatch =
      selectedStatusFilter === "All Status" ||
      (selectedStatusFilter === "Pending" &&
        appointment.status === "pending") ||
      (selectedStatusFilter === "Confirmed" &&
        appointment.status === "confirmed") ||
      (selectedStatusFilter === "Completed" &&
        appointment.status === "completed") ||
      (selectedStatusFilter === "Canceled" &&
        appointment.status === "canceled");

    return matchesSearch && typeMatch && statusMatch;
  });

  const handleBack = () => {
    navigate("/patient-dashboard");
  };

  const handleCancel = (appointment: AppointmentData) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (appointmentToCancel) {
      console.log("Cancel appointment:", appointmentToCancel);
      // In real app, this would call an API to cancel the appointment
      // For now, we'll just close the modal
      setShowCancelModal(false);
      setAppointmentToCancel(null);
    }
  };

  const handleReschedule = (appointment: AppointmentData) => {
    // Navigate to the appropriate booking page based on appointment type
    if (appointment.type === "telemedicine") {
      navigate("/patient-telemedicine", {
        state: {
          rescheduleData: {
            doctor: appointment.doctorName,
            date: appointment.date,
            time: appointment.time,
          },
        },
      });
    } else {
      navigate("/patient-book-in-person", {
        state: {
          rescheduleData: {
            doctor: appointment.doctorName,
            date: appointment.date,
            time: appointment.time,
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-szWhite100 mb-6">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-2 mb-4">
          <button
            onClick={handleBack}
            className="hover:bg-szGray100 rounded-lg transition-colors"
          >
            <ArrowLeft size={26} className="text-szPrimary700" />
          </button>
          <MobilePageTitle title="All Appointments" />
        </div>

        {/* Search Bar */}
        <Inputs
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className="mt-2 mb-4"
        />

        {/* Type Filter */}
        <>
          <h6 className="text-szDarkGrey600 text-h6 font-montserrat font-semibold mb-2">
            Appointment Type
          </h6>
          <div className="flex gap-2 overflow-x-auto mb-2">
            {["All Types", "Telemedicine", "In-Person"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTypeFilter(type)}
                className={`px-4 py-1 rounded-full text-caption-reg font-montserrat whitespace-nowrap transition-colors ${
                  selectedTypeFilter === type
                    ? "bg-szPrimary900 text-white"
                    : "bg-white text-szDarkGrey600 border border-szGrey300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </>

        {/* Status Filter */}
        <>
          <h6 className="text-szDarkGrey600 text-h6 font-montserrat font-semibold mb-2">
            Status
          </h6>
          <div className="flex gap-2 overflow-x-auto">
            {[
              "All Status",
              "Pending",
              "Confirmed",
              "Completed",
              "Canceled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-4 py-1 rounded-full text-caption-reg font-montserrat whitespace-nowrap transition-colors ${
                  selectedStatusFilter === status
                    ? "bg-szPrimary900 text-white"
                    : "bg-white text-szDarkGrey600 border border-szGrey300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </>
      </div>

      {/* Appointments List */}
      <div className="px-4 py-2">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col">
            <NoSearchFound
              hasSearchTerm={
                !!searchTerm ||
                selectedTypeFilter !== "All Types" ||
                selectedStatusFilter !== "All Status"
              }
              searchTitle="No health education found"
              noItemsTitle="No health education available"
              searchDescription="Try adjusting your search terms or category filter."
              noItemsDescription="Check back later for new health education content."
              icon={SearchNormal1}
            />
            <Button
              label="Book New Appointment"
              variant="primary"
              size="medium"
              className="mt-4"
              onClick={() => navigate("/patient-appointment")}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-szDarkGrey600 text-body-base-reg">
                {filteredAppointments.length} appointment
                {filteredAppointments.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredAppointments.map((appointment) => (
              <PatientAppointmentCard
                key={appointment.id}
                appointment={{
                  doctorName: appointment.doctorName,
                  specialty: appointment.specialty,
                  date: appointment.date,
                  time: appointment.time,
                  doctorImage: appointment.doctorImage,
                }}
                type={appointment.type}
                status={appointment.status}
                onCancel={
                  appointment.status === "completed"
                    ? undefined
                    : () => handleCancel(appointment)
                }
                onReschedule={
                  appointment.status === "completed"
                    ? undefined
                    : () => handleReschedule(appointment)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setAppointmentToCancel(null);
        }}
        contentHeight="h-fit"
        onClick={handleConfirmCancel}
        description={`Are you sure you want to cancel your appointment with ${appointmentToCancel?.doctorName}?`}
        buttonLabel="Yes, Cancel"
        content={
          <div className="text-center">
            <p className="text-szDarkGrey600 text-body-small-reg">
              This action cannot be undone. You will need to book a new
              appointment if you change your mind.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default MobileAllAppointments;
