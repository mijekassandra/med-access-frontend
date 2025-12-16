import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

//icons
import {
  Trash,
  SearchNormal1,
  Video,
  User,
  TickCircle,
  Refresh,
  ExportCurve,
  ArrowLeft2,
} from "iconsax-react";

//components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import ContainerWrapper from "../../../components/ContainerWrapper";
import Chip from "../../../global-components/Chip";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import Loading from "../../../components/Loading";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import Button from "../../../global-components/Button";

// Export
import ExportModal from "../../../components/ExportModal";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// RTK Query
import {
  useGetAppointmentsQuery,
  // useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
  type Appointment as ApiAppointment,
} from "../api/appointmentApi";
import UpdateAppointmentModal from "../components/UpdateAppointmentModal";
import AppointmentDetail from "../components/AppointmentDetail";

// Appointment data interface for component
interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  appointmentType: "telemedicine" | "in-person";
  status: "pending" | "accepted" | "serving" | "completed" | "denied";
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  notes?: string;
  queueNumber?: number | null;
}

// Helper function to assign proper queue numbers based on appointments grouped by date
const assignQueueNumbers = (appointments: ApiAppointment[]) => {
  const queueNumberMap: { [key: string]: number } = {};

  // Group appointments by date
  const appointmentsByDate: { [date: string]: ApiAppointment[] } = {};
  appointments.forEach((apt) => {
    const date = apt.date.split("T")[0]; // Extract date part only
    if (!appointmentsByDate[date]) {
      appointmentsByDate[date] = [];
    }
    appointmentsByDate[date].push(apt);
  });

  // For each date, assign sequential queue numbers to accepted/serving/completed appointments
  Object.keys(appointmentsByDate).forEach((date) => {
    const dateAppointments = appointmentsByDate[date]
      .filter(
        (apt) =>
          apt.status === "accepted" ||
          apt.status === "serving" ||
          apt.status === "completed"
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    dateAppointments.forEach((apt, index) => {
      queueNumberMap[apt._id] = index + 1;
    });
  });

  return queueNumberMap;
};

// Helper function to convert API appointment to component format
const mapApiAppointmentToComponent = (
  apiAppt: ApiAppointment,
  queueNumberMap: { [key: string]: number }
): Appointment | null => {
  // Skip appointments with deleted patients
  if (!apiAppt.patient) {
    return null;
  }

  const appointmentDate = new Date(apiAppt.date);
  const scheduledDate = appointmentDate.toISOString().split("T")[0];
  const scheduledTime = appointmentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Use calculated queue number instead of backend's potentially incorrect one
  const calculatedQueueNumber = queueNumberMap[apiAppt._id];
  const patient = apiAppt.patient;

  return {
    id: apiAppt._id,
    patientName: `${patient.lastName}, ${patient.firstName}`,
    patientId: patient._id,
    appointmentType:
      apiAppt.type === "telemedicine" ? "telemedicine" : "in-person",
    status: apiAppt.status,
    scheduledDate,
    scheduledTime,
    reason: apiAppt.reason,
    queueNumber: calculatedQueueNumber || apiAppt.queueNumber,
  };
};

const AllAppointment: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Option | Option[]>({
    label: "All",
    value: "all",
  });
  const [typeFilter, setTypeFilter] = useState<Option | Option[]>({
    label: "All",
    value: "all",
  });
  const [dateFilter, setDateFilter] = useState<Option | Option[]>({
    label: "All",
    value: "all",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  // Get date filter value for API
  const dateFilterValue = useMemo(() => {
    const dateValue = Array.isArray(dateFilter)
      ? dateFilter[0]?.value
      : dateFilter?.value;

    if (dateValue === "today") {
      return new Date().toISOString().split("T")[0];
    } else if (dateValue === "specific" && selectedDate) {
      return selectedDate.toISOString().split("T")[0];
    }
    return undefined;
  }, [dateFilter, selectedDate]);

  // RTK Query hooks
  const {
    data: appointmentsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAppointmentsQuery(
    dateFilterValue ? { date: dateFilterValue } : undefined
  );

  // const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] =
    useState<ApiAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Assign proper queue numbers based on appointments (only valid patients)
  const queueNumberMap = useMemo(() => {
    if (appointmentsResponse?.data) {
      const validAppointments = appointmentsResponse.data.filter(
        (apt) => apt.patient !== null && apt.patient !== undefined
      );
      return assignQueueNumbers(validAppointments);
    }
    return {};
  }, [appointmentsResponse]);

  // Convert API appointments to component format with correct queue numbers
  const appointments = useMemo(() => {
    if (appointmentsResponse?.data) {
      return appointmentsResponse.data
        .map((apt) => mapApiAppointmentToComponent(apt, queueNumberMap))
        .filter((apt): apt is Appointment => apt !== null); // Filter out appointments with deleted patients
    }
    return [];
  }, [appointmentsResponse, queueNumberMap]);

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

  // Export functionality
  const exportColumns: ExportColumn[] = [
    { key: "patientName", header: "Patient Name" },
    { key: "appointmentType", header: "Type" },
    { key: "status", header: "Status" },
    { key: "scheduledDate", header: "Date" },
    { key: "reason", header: "Reason" },
    { key: "queueNumber", header: "Queue #" },
  ];

  const { openExportModal, exportProps } = useExport({
    data: appointments,
    columns: exportColumns,
    title: "Export Appointments",
    filename: "appointments",
    dateConfig: {
      columnKey: "scheduledDate",
      label: "Scheduled Date",
      dateFormat: "iso",
    },
  });

  const handleStatusFilterChange = (selected: Option | Option[]) => {
    setStatusFilter(selected);
    console.log("Selected Status Filter:", selected);
  };

  const handleTypeFilterChange = (selected: Option | Option[]) => {
    setTypeFilter(selected);
    console.log("Selected Type Filter:", selected);
  };

  const handleDateFilterChange = (selected: Option | Option[]) => {
    setDateFilter(selected);
    console.log("Selected Date Filter:", selected);

    // Reset date pickers when changing filter type
    if (selected && !Array.isArray(selected)) {
      if (selected.value === "specific") {
        // Keep selectedDate as is
      } else if (selected.value === "range") {
        // Keep dateRange as is
      } else {
        // Reset both for "all" and "today"
        setSelectedDate(null);
        setDateRange({ startDate: null, endDate: null });
      }
    }
  };

  const handleSpecificDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setDateRange({ startDate: null, endDate: null }); // Clear range when selecting specific date
  };

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setDateRange({ startDate, endDate });
    setSelectedDate(null); // Clear specific date when selecting range
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter({ label: "All", value: "all" });
    setTypeFilter({ label: "All", value: "all" });
    setDateFilter({ label: "All", value: "all" });
    setSelectedDate(null);
    setDateRange({ startDate: null, endDate: null });
    refetch();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleDeleteAppointment = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete).unwrap();

        // Close modal immediately after successful deletion
        setIsDeleteModalOpen(false);
        setAppointmentToDelete(null);

        // Refetch appointments in the background (non-blocking)
        refetch();

        setSnackbarMessage("Appointment deleted successfully");
        setSnackbarType("success");
        setShowSnackbar(true);
      } catch (err: any) {
        const errorMessage =
          err?.data?.message ||
          "Failed to delete appointment. Please try again.";
        setSnackbarMessage(errorMessage);
        setSnackbarType("error");
        setShowSnackbar(true);
        // Close modal even on error
        setIsDeleteModalOpen(false);
        setAppointmentToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  // const handleMarkAsDone = async (appointmentId: string) => {
  //   try {
  //     await updateAppointmentStatus({
  //       id: appointmentId,
  //       status: "completed",
  //     }).unwrap();

  //     // Find the next patient in queue (accepted status with lowest queue number)
  //     const nextPatient = appointments
  //       .filter((apt) => apt.status === "accepted")
  //       .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0))[0];

  //     if (nextPatient) {
  //       // Update next patient to "serving" status
  //       try {
  //         await updateAppointmentStatus({
  //           id: nextPatient.id,
  //           status: "serving",
  //         }).unwrap();
  //       } catch (err) {
  //         // If updating next patient fails, still show success for completing the first one
  //         console.error("Failed to update next patient status:", err);
  //       }
  //     }

  //     // Refetch appointments to get updated data and wait for it to complete
  //     await refetch();

  //     // Show success notification
  //     setSnackbarMessage(
  //       "Patient marked as done. Next patient in queue is now being served."
  //     );
  //     setSnackbarType("success");
  //     setShowSnackbar(true);
  //   } catch (err: any) {
  //     const errorMessage =
  //       err?.data?.message ||
  //       "Failed to update appointment status. Please try again.";
  //     setSnackbarMessage(errorMessage);
  //     setSnackbarType("error");
  //     setShowSnackbar(true);
  //   }
  // };

  const handleEditAppointment = (record: Appointment) => {
    // Find the full API appointment data
    const fullAppointment = appointmentsResponse?.data?.find(
      (apt) => apt._id === record.id
    );
    if (fullAppointment) {
      setAppointmentToEdit(fullAppointment);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setAppointmentToEdit(null);
  };

  const handleAppointmentUpdated = async () => {
    // Refetch appointments to get updated data
    await refetch();
  };

  // Define columns
  const columns: TableColumn<Appointment>[] = [
    {
      key: "queueNumber",
      header: "Queue No.",
      width: "80px",
      sortable: true,
    },
    {
      key: "patientName",
      header: "Patient Name",
      width: "180px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },

    {
      key: "appointmentType",
      header: "Type",
      width: "120px",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          {value === "telemedicine" ? (
            <Video size={16} className="text-blue-600" />
          ) : (
            <User size={16} className="text-green-600" />
          )}
          <span className="text-body-small-reg text-szBlack700 capitalize">
            {value === "telemedicine" ? "Telemedicine" : "In-Person"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      sortable: true,
      render: (value) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "pending":
              return "yellow";
            case "accepted":
              return "green";
            case "serving":
              return "purple";
            case "completed":
              return "blue";
            case "denied":
              return "red";
            default:
              return "gray";
          }
        };

        const getStatusText = (status: string) => {
          switch (status) {
            case "pending":
              return "Pending";
            case "accepted":
              return "Accepted";
            case "serving":
              return "Serving";
            case "completed":
              return "Completed";
            case "denied":
              return "Denied";
            default:
              return "Unknown";
          }
        };

        return (
          <Chip
            label={getStatusText(value)}
            type="colored"
            color={getStatusColor(value) as any}
          />
        );
      },
    },
    {
      key: "scheduledDate",
      header: "Date",
      width: "100px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      sortable: true,
      render: (value) => (
        <div
          className="text-body-small-reg text-szBlack700 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[200px]"
          title={value}
        >
          {value}
        </div>
      ),
    },
  ];

  // Define actions
  const actions: TableAction<Appointment>[] = [
    {
      label: "Edit Appointment",
      icon: <TickCircle size={16} />,
      onClick: (record) => {
        handleEditAppointment(record);
      },
      visible: (record) => record.status === "pending",
      disabled: (record) => record.status !== "pending",
    },

    // {
    //   label: "Cancel Appointment",
    //   icon: <Trash size={16} />,
    //   onClick: async (record) => {
    //     console.log("Cancel appointment:", record);
    //     if (
    //       confirm(
    //         `Are you sure you want to cancel the appointment for ${record.patientName}?`
    //       )
    //     ) {
    //       try {
    //         await updateAppointmentStatus({
    //           id: record.id,
    //           status: "denied",
    //         }).unwrap();

    //         // Refetch appointments to get updated data
    //         refetch();

    //         setSnackbarMessage("Appointment cancelled successfully");
    //         setSnackbarType("success");
    //         setShowSnackbar(true);
    //       } catch (err: any) {
    //         const errorMessage =
    //           err?.data?.message ||
    //           "Failed to cancel appointment. Please try again.";
    //         setSnackbarMessage(errorMessage);
    //         setSnackbarType("error");
    //         setShowSnackbar(true);
    //       }
    //     }
    //   },
    //   disabled: (record) =>
    //     record.status === "completed" || record.status === "cancelled",
    // },
    {
      label: "Delete Appointment",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setAppointmentToDelete(record.id);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  // Filter appointments based on search term, status, type, and date
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Safe search - only search in specific string fields, handle null/undefined values
      const matchesSearch = searchTerm.trim() === "" || (() => {
        const searchLower = searchTerm.toLowerCase();
        const searchableFields = [
          appointment.patientName,
          appointment.reason,
          appointment.scheduledDate,
          appointment.scheduledTime,
          appointment.status,
          appointment.appointmentType,
          appointment.id,
          appointment.queueNumber?.toString() || "",
        ];
        
        return searchableFields.some((field) => {
          if (field == null || field === undefined) return false;
          return String(field).toLowerCase().includes(searchLower);
        });
      })();

      const statusValue = Array.isArray(statusFilter)
        ? statusFilter[0]?.value
        : statusFilter?.value;
      const typeValue = Array.isArray(typeFilter)
        ? typeFilter[0]?.value
        : typeFilter?.value;
      const dateValue = Array.isArray(dateFilter)
        ? dateFilter[0]?.value
        : dateFilter?.value;

      const matchesStatus =
        statusValue === "all" || appointment.status === statusValue;
      const matchesType =
        typeValue === "all" || appointment.appointmentType === typeValue;

      // Date filtering logic
      let matchesDate = true;

      if (dateValue === "today") {
        const today = new Date().toISOString().split("T")[0];
        matchesDate = appointment.scheduledDate === today;
      } else if (dateValue === "specific" && selectedDate) {
        // Use local date formatting to avoid timezone issues
        const selectedDateStr =
          selectedDate.getFullYear() +
          "-" +
          String(selectedDate.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(selectedDate.getDate()).padStart(2, "0");
        matchesDate = appointment.scheduledDate === selectedDateStr;
      } else if (
        dateValue === "range" &&
        (dateRange.startDate || dateRange.endDate)
      ) {
        const appointmentDate = new Date(
          appointment.scheduledDate + "T00:00:00"
        );

        if (dateRange.startDate && dateRange.endDate) {
          const startDate = new Date(
            dateRange.startDate.getFullYear(),
            dateRange.startDate.getMonth(),
            dateRange.startDate.getDate()
          );
          const endDate = new Date(
            dateRange.endDate.getFullYear(),
            dateRange.endDate.getMonth(),
            dateRange.endDate.getDate()
          );
          const appointmentDateOnly = new Date(
            appointmentDate.getFullYear(),
            appointmentDate.getMonth(),
            appointmentDate.getDate()
          );

          matchesDate =
            appointmentDateOnly >= startDate && appointmentDateOnly <= endDate;
        } else if (dateRange.startDate) {
          const startDate = new Date(
            dateRange.startDate.getFullYear(),
            dateRange.startDate.getMonth(),
            dateRange.startDate.getDate()
          );
          const appointmentDateOnly = new Date(
            appointmentDate.getFullYear(),
            appointmentDate.getMonth(),
            appointmentDate.getDate()
          );
          matchesDate = appointmentDateOnly >= startDate;
        } else if (dateRange.endDate) {
          const endDate = new Date(
            dateRange.endDate.getFullYear(),
            dateRange.endDate.getMonth(),
            dateRange.endDate.getDate()
          );
          const appointmentDateOnly = new Date(
            appointmentDate.getFullYear(),
            appointmentDate.getMonth(),
            appointmentDate.getDate()
          );
          matchesDate = appointmentDateOnly <= endDate;
        }
      } else if (dateValue === "all") {
        matchesDate = true;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [
    appointments,
    searchTerm,
    statusFilter,
    typeFilter,
    dateFilter,
    selectedDate,
    dateRange,
  ]);

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    dateFilter,
    selectedDate,
    dateRange,
  ]);

  if (isLoading) {
    return (
      <ContainerWrapper>
        <Loading />
      </ContainerWrapper>
    );
  }

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 gap-2">
        {/* Back Button */}
        <div className="flex items-center mb-2">
          <Button
            label="Back to Appointments"
            leftIcon={<ArrowLeft2 size={16} />}
            onClick={() => navigate("/appointments")}
            size="small"
            variant="primary"
          />
        </div>

        {/* Header with search and filters */}
        <div className="flex flex-col justify-between gap-4 w-full mb-2">
          <Inputs
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />
          <div className="flex gap-4 items-center justify-end">
            <div title="Reset filter">
              <ButtonsIcon
                icon={<Refresh />}
                onClick={handleClearFilters}
                size="medium"
              />
            </div>
            <div title="Generate report">
              <ButtonsIcon
                icon={<ExportCurve />}
                onClick={openExportModal}
                variant="secondary"
                size="medium"
              />
            </div>
            <div className="min-w-[120px]">
              <Dropdown
                options={[
                  { label: "All", value: "all" },
                  { label: "Today", value: "today" },
                  { label: "Specific Date", value: "specific" },
                  { label: "Date Range", value: "range" },
                ]}
                size="small"
                label="Date:"
                placeholder="Filter by date"
                onSelectionChange={handleDateFilterChange}
                value={dateFilter}
              />
            </div>

            {/* Date Input - Show based on selected filter type */}
            {dateFilter &&
              !Array.isArray(dateFilter) &&
              dateFilter.value === "specific" && (
                <div className="min-w-[200px]">
                  <Inputs
                    label="SELECT DATE"
                    placeholder="Select Date"
                    type="date"
                    value={
                      selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      handleSpecificDateChange(date);
                    }}
                  />
                </div>
              )}

            {dateFilter &&
              !Array.isArray(dateFilter) &&
              dateFilter.value === "range" && (
                <div className="flex gap-2 min-w-[400px]">
                  <div className="min-w-[180px]">
                    <Inputs
                      label="FROM DATE"
                      placeholder="From Date"
                      type="date"
                      value={
                        dateRange.startDate
                          ? dateRange.startDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        handleDateRangeChange(date, dateRange.endDate);
                      }}
                    />
                  </div>
                  <div className="min-w-[180px]">
                    <Inputs
                      label="TO DATE"
                      placeholder="To Date"
                      type="date"
                      value={
                        dateRange.endDate
                          ? dateRange.endDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        handleDateRangeChange(dateRange.startDate, date);
                      }}
                    />
                  </div>
                </div>
              )}

            <div className="min-w-[120px]">
              <Dropdown
                options={[
                  { label: "All", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Accepted", value: "accepted" },
                  { label: "Serving", value: "serving" },
                  { label: "Completed", value: "completed" },
                  { label: "Denied", value: "denied" },
                ]}
                size="small"
                label="Status:"
                placeholder="Filter by status"
                onSelectionChange={handleStatusFilterChange}
                value={statusFilter}
              />
            </div>

            <div className="min-w-[120px]">
              <Dropdown
                options={[
                  { label: "All", value: "all" },
                  { label: "Telemedicine", value: "telemedicine" },
                  { label: "In-Person", value: "in-person" },
                ]}
                size="small"
                label="Type:"
                placeholder="Filter by type"
                onSelectionChange={handleTypeFilterChange}
                value={typeFilter}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          data={paginatedAppointments}
          columns={columns}
          actions={actions}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages: totalPages || 1, // Ensure at least 1 page
            onChange: handlePageChange,
          }}
          emptyMessage="No appointments found"
          onRowClick={(record) => {
            setSelectedAppointment(record);
            setIsDetailModalOpen(true);
          }}
          className="shadow-sm"
        />

        {/* Snackbar Alert */}
        <SnackbarAlert
          isOpen={showSnackbar}
          title={snackbarMessage}
          type={snackbarType}
          onClose={handleCloseSnackbar}
          duration={3000}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onClick={handleDeleteAppointment}
          description={`Are you sure you want to delete the appointment for ${
            appointmentToDelete
              ? appointments.find((apt) => apt.id === appointmentToDelete)
                  ?.patientName || "this patient"
              : "this patient"
          }?`}
          buttonLabel={isDeleting ? "Deleting..." : "Delete"}
          isLoading={isDeleting}
          subDescription="This action cannot be undone."
        />

        {/* Export Modal */}
        <ExportModal {...exportProps} />

        {/* Update Appointment Modal */}
        <UpdateAppointmentModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          appointment={appointmentToEdit}
          onSave={handleAppointmentUpdated}
        />

        {/* Appointment Detail Modal */}
        <AppointmentDetail
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={
            selectedAppointment
              ? {
                  ...selectedAppointment,
                  name: selectedAppointment.patientName,
                }
              : null
          }
        />
      </div>
    </ContainerWrapper>
  );
};

export default AllAppointment;
