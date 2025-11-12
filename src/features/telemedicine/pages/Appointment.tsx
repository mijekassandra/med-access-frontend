import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { SearchNormal1, Add, Play } from "iconsax-react";

// components
import ContainerWrapper from "../../../components/ContainerWrapper";
import TelemedicineCard from "../components/TelemedicineCard";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import AppointmentDetail from "../components/AppointmentDetail";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Loading from "../../../components/Loading";
import CreateAppointmentModal from "../components/CreateAppointmentModal";

// RTK Query
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  type Appointment as ApiAppointment,
} from "../api/appointmentApi";

// Helper function to convert API appointment to card format
const mapApiAppointmentToCard = (apiAppt: ApiAppointment) => {
  const appointmentDate = new Date(apiAppt.date);
  const date = appointmentDate.toISOString().split("T")[0];
  const name = `${apiAppt.patient.lastName}, ${apiAppt.patient.firstName}`;

  // Map "denied" status to "cancelled" for the card component
  const status: "pending" | "accepted" | "serving" | "completed" | "cancelled" =
    apiAppt.status === "denied"
      ? "cancelled"
      : (apiAppt.status as "pending" | "serving" | "accepted" | "completed");

  return {
    id: apiAppt._id,
    firstName: apiAppt.patient.firstName,
    lastName: apiAppt.patient.lastName,
    name,
    status,
    date,
    appointmentType:
      apiAppt.type === "telemedicine" ? "Telemedicine" : "In-person",
    queueNumber: apiAppt.queueNumber || undefined,
  };
};

const Telemedicine = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [acceptingAppointmentId, setAcceptingAppointmentId] = useState<
    string | null
  >(null);
  const [isStartingServing, setIsStartingServing] = useState(false);
  const [markingAsDoneId, setMarkingAsDoneId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get today's date for filtering
  const today = new Date().toISOString().split("T")[0];

  // RTK Query hooks - fetch all appointments (no date filter) so pending requests for any date appear
  const {
    data: appointmentsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAppointmentsQuery();

  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

  // Store full API appointments for detail view
  const fullAppointments = useMemo(() => {
    return appointmentsResponse?.data || [];
  }, [appointmentsResponse]);

  // Convert API appointments to card format
  const allAppointments = useMemo(() => {
    if (appointmentsResponse?.data) {
      return appointmentsResponse.data.map(mapApiAppointmentToCard);
    }
    return [];
  }, [appointmentsResponse]);

  // Filter pending requests
  const pendingRequests = useMemo(() => {
    return allAppointments.filter((apt) => apt.status === "pending");
  }, [allAppointments]);

  // Filter today's appointments (serving, accepted, completed) - only show appointments for today
  const todayAppointments = useMemo(() => {
    return allAppointments.filter(
      (apt) =>
        apt.date === today &&
        (apt.status === "serving" ||
          apt.status === "accepted" ||
          apt.status === "completed")
    );
  }, [allAppointments, today]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      const errorMessage =
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? (error.data as { message: string }).message
          : "Failed to load appointments. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [error]);

  const handleAccept = async (id: string) => {
    setAcceptingAppointmentId(id);
    try {
      await updateAppointmentStatus({
        id,
        status: "accepted",
      }).unwrap();

      // Refetch appointments to get updated data and wait for it to complete
      await refetch();

      // Show success notification
      setSnackbarMessage("Appointment request accepted successfully");
      setSnackbarType("success");
      setShowSnackbar(true);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Failed to accept appointment. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setAcceptingAppointmentId(null);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setRequestToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      try {
        await updateAppointmentStatus({
          id: requestToDelete,
          status: "denied",
        }).unwrap();

        // Refetch appointments to get updated data and wait for it to complete
        await refetch();

        // Show success notification
        setSnackbarMessage("Appointment request rejected successfully");
        setSnackbarType("success");
        setShowSnackbar(true);
      } catch (err: any) {
        const errorMessage =
          err?.data?.message ||
          "Failed to reject appointment. Please try again.";
        setSnackbarMessage(errorMessage);
        setSnackbarType("error");
        setShowSnackbar(true);
      }
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
    // Find the full appointment data from API response
    const fullAppointment = fullAppointments.find(
      (apt) => apt._id === appointment.id
    );

    if (fullAppointment) {
      // Map the full appointment data for the detail view
      const appointmentDate = new Date(fullAppointment.date);
      const mappedAppointment = {
        id: fullAppointment._id,
        patientId: fullAppointment.patient._id,
        name: `${fullAppointment.patient.lastName}, ${fullAppointment.patient.firstName}`,
        firstName: fullAppointment.patient.firstName,
        lastName: fullAppointment.patient.lastName,
        status:
          fullAppointment.status === "denied"
            ? "cancelled"
            : fullAppointment.status,
        queueNumber: fullAppointment.queueNumber,
        appointmentType:
          fullAppointment.type === "telemedicine"
            ? "Telemedicine"
            : "In-person",
        date: appointmentDate.toISOString().split("T")[0],
        reason: fullAppointment.reason,
        createdAt: fullAppointment.createdAt,
        updatedAt: fullAppointment.updatedAt,
      };
      setSelectedAppointment(mappedAppointment);
    } else {
      // Fallback to card data if full appointment not found
      setSelectedAppointment(appointment);
    }
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

  const confirmMarkAsDone = async () => {
    if (appointmentToMarkDone) {
      setMarkingAsDoneId(appointmentToMarkDone);
      try {
        // Find the current appointment being marked as done
        const currentAppointment = todayAppointments.find(
          (apt) => apt.id === appointmentToMarkDone
        );

        if (!currentAppointment) {
          setSnackbarMessage("Appointment not found");
          setSnackbarType("error");
          setShowSnackbar(true);
          setIsMarkDoneModalOpen(false);
          setAppointmentToMarkDone(null);
          setMarkingAsDoneId(null);
          return;
        }

        const currentQueueNumber = currentAppointment.queueNumber || 0;

        // Update the appointment status to completed
        await updateAppointmentStatus({
          id: appointmentToMarkDone,
          status: "completed",
        }).unwrap();

        // Find the next patient in queue (queueNumber = currentQueueNumber + 1)
        const nextPatient = todayAppointments.find(
          (apt) =>
            apt.status === "accepted" &&
            apt.queueNumber === currentQueueNumber + 1
        );

        if (nextPatient) {
          // Update next patient to "serving" status
          try {
            await updateAppointmentStatus({
              id: nextPatient.id,
              status: "serving",
            }).unwrap();

            // Refetch appointments to get updated data and wait for it to complete
            await refetch();

            // Show success notification
            setSnackbarMessage(
              `Appointment marked as done. ${nextPatient.name} (Queue #${nextPatient.queueNumber}) is now being served.`
            );
            setSnackbarType("success");
            setShowSnackbar(true);
          } catch (err) {
            // If updating next patient fails, still show success for completing the first one
            console.error("Failed to update next patient status:", err);
            await refetch();
            setSnackbarMessage(
              "Appointment marked as done. Failed to start serving next patient."
            );
            setSnackbarType("warning");
            setShowSnackbar(true);
          }
        } else {
          // No next patient in queue (last in queue) - just mark as done
          // Refetch appointments to get updated data and wait for it to complete
          await refetch();

          // Show success notification
          setSnackbarMessage("Appointment marked as done.");
          setSnackbarType("success");
          setShowSnackbar(true);
        }
      } catch (err: any) {
        const errorMessage =
          err?.data?.message ||
          "Failed to update appointment status. Please try again.";
        setSnackbarMessage(errorMessage);
        setSnackbarType("error");
        setShowSnackbar(true);
      } finally {
        setMarkingAsDoneId(null);
      }
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

  const handleCreateAppointment = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleAppointmentCreated = () => {
    // Refetch appointments after creating
    refetch();
  };

  const handleStartServing = async () => {
    // Find the appointment with queueNumber 1
    const nextAppointment = todayAppointments
      .filter((apt) => apt.status === "accepted")
      .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0))[0];

    if (!nextAppointment || nextAppointment.queueNumber !== 1) {
      setSnackbarMessage("No appointment with queue number 1 found");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    setIsStartingServing(true);
    try {
      await updateAppointmentStatus({
        id: nextAppointment.id,
        status: "serving",
      }).unwrap();

      // Refetch appointments to get updated data and wait for it to complete
      await refetch();

      // Show success notification
      setSnackbarMessage(
        `Started serving ${nextAppointment.name} (Queue #${nextAppointment.queueNumber})`
      );
      setSnackbarType("success");
      setShowSnackbar(true);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Failed to start serving. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsStartingServing(false);
    }
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
      // Then sort by queue number
      return (a.queueNumber || 0) - (b.queueNumber || 0);
    });

  if (isLoading) {
    return (
      <ContainerWrapper>
        <Loading />
      </ContainerWrapper>
    );
  }

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

          <div className="flex gap-3 items-center">
            <ButtonsIcon
              icon={<Add />}
              size="medium"
              variant="secondary"
              onClick={handleCreateAppointment}
            />
            <Button
              label="View Appointments"
              size="medium"
              className="w-[200px]"
              onClick={handleViewAllAppointments}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  isAccepting={acceptingAppointmentId === request.id}
                  disableAllActions={acceptingAppointmentId !== null}
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
              <div className="flex items-center gap-3">
                <Button
                  label="Start Serving"
                  size="small"
                  variant="primary"
                  onClick={handleStartServing}
                  disabled={
                    isStartingServing ||
                    !todayAppointments.some(
                      (apt) =>
                        apt.status === "accepted" && apt.queueNumber === 1
                    )
                  }
                  loading={isStartingServing}
                  loadingText="Starting..."
                  rightIcon={<Play />}
                />
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredTodayAppointments.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto">
              {filteredTodayAppointments.map((appointment) => (
                <TelemedicineCard
                  key={appointment.id}
                  {...appointment}
                  onView={handleViewAppointment}
                  onMarkAsDone={handleMarkAsDone}
                  isMarkingAsDone={markingAsDoneId === appointment.id}
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
          isLoading={markingAsDoneId !== null}
          isLoadingText="Marking..."
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
        />

        {/* Create Appointment Modal */}
        <CreateAppointmentModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSave={handleAppointmentCreated}
        />
      </div>
    </ContainerWrapper>
  );
};

export default Telemedicine;
