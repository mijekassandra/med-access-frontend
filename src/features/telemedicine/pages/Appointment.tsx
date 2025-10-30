import { useState } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { SearchNormal1 } from "iconsax-react";

// components
import ContainerWrapper from "../../../components/ContainerWrapper";
import TelemedicineCard from "../components/TelemedicineCard";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import AppointmentDetail from "../components/AppointmentDetail";
import ConfirmationModal from "../../../components/ConfirmationModal";

// Mock data
const mockPendingRequests = [
  {
    id: "1",
    name: "Dela Cruz, Juan",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Sent a telemedicine request",
  },
  {
    id: "2",
    name: "Santos, Maria",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Requesting consultation",
  },
  {
    id: "3",
    name: "Garcia, Pedro",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Follow-up appointment needed",
  },
  {
    id: "4",
    name: "Lopez, Ana",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Initial consultation request",
  },
  {
    id: "5",
    name: "Martinez, Carlos",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Emergency consultation",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
  {
    id: "13",
    name: "Hernandez, Luis",
    avatar: "https://i.pravatar.cc/150?img=13",
    status: "pending" as const,
    description: "Follow-up consultation",
  },
  {
    id: "14",
    name: "Gonzalez, Carmen",
    avatar: "https://i.pravatar.cc/150?img=14",
    status: "pending" as const,
    description: "Medical advice needed",
  },
  {
    id: "15",
    name: "Perez, Jose",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: "pending" as const,
    description: "Health screening",
  },
  {
    id: "16",
    name: "Ramirez, Rosa",
    avatar: "https://i.pravatar.cc/150?img=16",
    status: "pending" as const,
    description: "Chronic condition management",
  },
];

const mockTodayAppointments = [
  {
    id: "7",
    name: "Coliao, Gladys",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "serving" as const,
    time: "2:30 PM",
  },
  {
    id: "8",
    name: "Fernandez, Roberto",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "3:00 PM",
  },
  {
    id: "9",
    name: "Torres, Elena",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "3:30 PM",
  },
  {
    id: "10",
    name: "Reyes, Miguel",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "completed" as const,
    time: "4:00 PM",
  },
  {
    id: "11",
    name: "Cruz, Isabel",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "4:30 PM",
  },
  {
    id: "12",
    name: "Mendoza, Antonio",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "cancelled" as const,
    time: "5:00 PM",
  },
];

const Telemedicine = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [todayAppointments, setTodayAppointments] = useState(
    mockTodayAppointments
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [isMarkDoneModalOpen, setIsMarkDoneModalOpen] = useState(false);
  const [appointmentToMarkDone, setAppointmentToMarkDone] = useState<
    string | null
  >(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const navigate = useNavigate();

  const handleAccept = (id: string) => {
    console.log("Accepting request:", id);
    // Remove the request from pending list
    setPendingRequests((prev) => prev.filter((request) => request.id !== id));

    // Show success notification
    setSnackbarMessage("Appointment request accepted successfully");
    setSnackbarType("success");
    setShowSnackbar(true);
  };

  const handleDeleteRequest = (id: string) => {
    setRequestToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== requestToDelete)
      );
      console.log("Deleted request:", requestToDelete);

      // Show success notification
      setSnackbarMessage("Appointment request rejected successfully");
      setSnackbarType("success");
      setShowSnackbar(true);
    }
    setIsDeleteModalOpen(false);
    setRequestToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRequestToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleMarkAsDone = (appointmentId: string) => {
    setAppointmentToMarkDone(appointmentId);
    setIsMarkDoneModalOpen(true);
  };

  const confirmMarkAsDone = () => {
    if (appointmentToMarkDone) {
      // Update the appointment status to completed
      setTodayAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentToMarkDone
            ? { ...appointment, status: "completed" as const }
            : appointment
        )
      );

      // Find the next patient in queue (accepted status) and move them to serving
      setTodayAppointments((prev) => {
        const nextPatient = prev
          .filter((apt) => apt.status === "accepted")
          .sort((a, b) => a.id.localeCompare(b.id))[0]; // Simple sorting by ID for demo

        if (nextPatient) {
          return prev.map((apt) =>
            apt.id === nextPatient.id
              ? { ...apt, status: "serving" as const }
              : apt
          );
        }

        return prev;
      });

      // Show success notification
      setSnackbarMessage(
        "Appointment marked as done. Next patient in queue is now being served."
      );
      setSnackbarType("success");
      setShowSnackbar(true);
    }
    setIsMarkDoneModalOpen(false);
    setAppointmentToMarkDone(null);
  };

  const cancelMarkAsDone = () => {
    setIsMarkDoneModalOpen(false);
    setAppointmentToMarkDone(null);
  };

  const handleViewAllAppointments = () => {
    navigate("/appointments/all-appointments");
  };

  const filteredPendingRequests = pendingRequests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTodayAppointments = todayAppointments
    .filter(
      (appointment) =>
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (appointment.status === "serving" || appointment.status === "accepted")
    )
    .sort((a, b) => {
      // Sort serving appointments first, then accepted
      if (a.status === "serving" && b.status === "accepted") return -1;
      if (a.status === "accepted" && b.status === "serving") return 1;
      return 0; // Keep original order for same status
    });

  return (
    <ContainerWrapper>
      <div className="w-full h-full flex flex-col gap-4">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-3 md:gap-6">
          <div className="w-full">
            <Inputs
              placeholder="Search appointments today by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={SearchNormal1}
            />
          </div>

          <Button
            label="View Appointments"
            size="medium"
            className="w-[250px]"
            onClick={handleViewAllAppointments}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - Pending Requests */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Appointment Requests
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {filteredPendingRequests.length}
              </span>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto">
              {filteredPendingRequests.map((request) => (
                <TelemedicineCard
                  key={request.id}
                  {...request}
                  onAccept={handleAccept}
                  onReject={handleDeleteRequest}
                />
              ))}
              {filteredPendingRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending requests found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Today's Appointments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">TODAY</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {filteredTodayAppointments.length}
              </span>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto">
              {filteredTodayAppointments.map((appointment) => (
                <TelemedicineCard
                  key={appointment.id}
                  {...appointment}
                  onView={handleViewAppointment}
                  onMarkAsDone={handleMarkAsDone}
                />
              ))}
              {filteredTodayAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onClick={confirmDelete}
          description={`Are you sure you want to reject the appointment request from ${
            requestToDelete
              ? pendingRequests.find((req) => req.id === requestToDelete)
                  ?.name || "this patient"
              : "this patient"
          }?`}
          buttonLabel="Reject Request"
          subDescription="The appointment request will be permanently removed from the pending list."
        />

        {/* Mark as Done Confirmation Modal */}
        <ConfirmationModal
          isOpen={isMarkDoneModalOpen}
          onClose={cancelMarkAsDone}
          onClick={confirmMarkAsDone}
          description={`Are you sure you want to mark the appointment as done for ${
            appointmentToMarkDone
              ? todayAppointments.find(
                  (apt) => apt.id === appointmentToMarkDone
                )?.name || "this patient"
              : "this patient"
          }?`}
          buttonLabel="Mark as Done"
        />

        {/* Snackbar Alert */}
        <SnackbarAlert
          isOpen={showSnackbar}
          title={snackbarMessage}
          type={snackbarType}
          onClose={handleCloseSnackbar}
          duration={3000}
        />

        {/* View Appointment Details Modal */}
        <AppointmentDetail
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          appointment={selectedAppointment}
          onMarkAsDone={handleMarkAsDone}
        />
      </div>
    </ContainerWrapper>
  );
};

export default Telemedicine;
