import React, { useState } from "react";

//icons
import {
  Edit,
  Trash,
  Eye,
  SearchNormal1,
  Video,
  User,
  TickCircle,
  Refresh,
  ExportCurve,
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

// Export
import ExportModal from "../../../components/ExportModal";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// Appointment data interface
interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  appointmentType: "telemedicine" | "in-person";
  status: "pending" | "accepted" | "serving" | "completed" | "cancelled";
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  notes?: string;
  queueNumber?: number;
}

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

// Sample data
const sampleAppointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "Dela Cruz, Juan",
    patientId: "P001",
    doctorName: "Dr. Smith, John",
    doctorId: "D001",
    appointmentType: "telemedicine",
    status: "completed",
    scheduledDate: today, // Today's date
    scheduledTime: "09:00",
    reason: "Follow-up consultation",
    notes: "Patient requested video call",
    queueNumber: 1,
  },
  {
    id: "APT002",
    patientName: "Santos, Maria",
    patientId: "P002",
    doctorName: "Dr. Johnson, Sarah",
    doctorId: "D002",
    appointmentType: "in-person",
    status: "completed",
    scheduledDate: today, // Today's date
    scheduledTime: "10:30",
    reason: "Initial consultation",
    notes: "Physical examination required",
    queueNumber: 2,
  },
  {
    id: "APT003",
    patientName: "Garcia, Pedro",
    patientId: "P003",
    doctorName: "Dr. Brown, Michael",
    doctorId: "D003",
    appointmentType: "telemedicine",
    status: "completed",
    scheduledDate: "2024-06-14",
    scheduledTime: "14:00",
    reason: "Prescription refill",
    notes: "Medication adjustment needed",
    queueNumber: 3,
  },
  {
    id: "APT004",
    patientName: "Lopez, Ana",
    patientId: "P004",
    doctorName: "Dr. Wilson, Emily",
    doctorId: "D004",
    appointmentType: "in-person",
    status: "serving",
    scheduledDate: "2024-06-13",
    scheduledTime: "11:15",
    reason: "Routine check-up",
    notes: "Patient cancelled due to emergency",
    queueNumber: 4,
  },
  {
    id: "APT005",
    patientName: "Martinez, Carlos",
    patientId: "P005",
    doctorName: "Dr. Davis, Robert",
    doctorId: "D005",
    appointmentType: "telemedicine",
    status: "accepted",
    scheduledDate: "2024-06-16",
    scheduledTime: "15:30",
    reason: "Mental health consultation",
    notes: "Weekly therapy session",
    queueNumber: 5,
  },
  {
    id: "APT006",
    patientName: "Rodriguez, Sofia",
    patientId: "P006",
    doctorName: "Dr. Miller, Lisa",
    doctorId: "D006",
    appointmentType: "in-person",
    status: "accepted",
    scheduledDate: "2024-06-17",
    scheduledTime: "08:45",
    reason: "Vaccination",
    notes: "Annual flu shot",
    queueNumber: 6,
  },
  {
    id: "APT007",
    patientName: "Fernandez, Roberto",
    patientId: "P007",
    doctorName: "Dr. Smith, John",
    doctorId: "D001",
    appointmentType: "telemedicine",
    status: "accepted",
    scheduledDate: "2024-06-12",
    scheduledTime: "16:00",
    reason: "Post-surgery follow-up",
    notes: "Recovery progress check",
    queueNumber: 7,
  },
  {
    id: "APT008",
    patientName: "Torres, Elena",
    patientId: "P008",
    doctorName: "Dr. Johnson, Sarah",
    doctorId: "D002",
    appointmentType: "in-person",
    status: "accepted",
    scheduledDate: "2024-06-18",
    scheduledTime: "13:20",
    reason: "Lab results review",
    notes: "Blood work follow-up",
    queueNumber: 8,
  },
];

const AllAppointment: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] =
    useState<Appointment[]>(sampleAppointments);
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

  // Export functionality
  const exportColumns: ExportColumn[] = [
    { key: "patientName", header: "Patient Name" },
    { key: "doctorName", header: "Doctor Name" },
    { key: "appointmentType", header: "Type" },
    { key: "status", header: "Status" },
    { key: "scheduledDate", header: "Date" },
    { key: "scheduledTime", header: "Time" },
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
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleMarkAsDone = (appointmentId: string) => {
    setAppointments((prev) => {
      const updatedAppointments = prev.map((apt) => {
        if (apt.id === appointmentId) {
          return { ...apt, status: "completed" as const };
        }
        return apt;
      });

      // Find the next patient in queue (accepted status with lowest queue number)
      const nextPatient = updatedAppointments
        .filter((apt) => apt.status === "accepted")
        .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0))[0];

      if (nextPatient) {
        // Update next patient to "serving" status
        return updatedAppointments.map((apt) =>
          apt.id === nextPatient.id
            ? { ...apt, status: "serving" as const }
            : apt
        );
      }

      return updatedAppointments;
    });

    // Show success notification
    setSnackbarMessage(
      "Patient marked as done. Next patient in queue is now being served."
    );
    setSnackbarType("success");
    setShowSnackbar(true);
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
            case "cancelled":
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
            case "cancelled":
              return "Cancelled";
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
      width: "120px",
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
    },
  ];

  // Define actions
  const actions: TableAction<Appointment>[] = [
    {
      label: "Mark as Done",
      icon: <TickCircle size={16} />,
      onClick: (record) => {
        console.log("Mark as done:", record);
        if (
          confirm(
            `Are you sure you want to mark ${record.patientName} as done? This will trigger the next patient in queue.`
          )
        ) {
          handleMarkAsDone(record.id);
        }
      },
      disabled: (record) =>
        record.status === "completed" ||
        record.status === "cancelled" ||
        record.status === "pending",
    },

    {
      label: "Cancel Appointment",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Cancel appointment:", record);
        if (
          confirm(
            `Are you sure you want to cancel the appointment for ${record.patientName}?`
          )
        ) {
          setAppointments(
            appointments.map((apt) =>
              apt.id === record.id
                ? { ...apt, status: "cancelled" as const }
                : apt
            )
          );
        }
      },
      disabled: (record) =>
        record.status === "completed" || record.status === "cancelled",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  // Filter appointments based on search term, status, type, and date
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = Object.values(appointment).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      const appointmentDate = new Date(appointment.scheduledDate + "T00:00:00");

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

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 gap-6">
        {/* Header with search and filters */}
        <div className="flex flex-col justify-between gap-3 w-full">
          <Inputs
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />
          <div className="flex gap-4 items-center justify-end">
            <ButtonsIcon
              icon={<Refresh />}
              onClick={handleClearFilters}
              size="medium"
            />
            <ButtonsIcon
              icon={<ExportCurve />}
              onClick={openExportModal}
              variant="secondary"
              size="medium"
            />
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
                  { label: "Cancelled", value: "cancelled" },
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
          data={filteredAppointments}
          columns={columns}
          actions={actions}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredAppointments.length / 10), // 10 items per page
            onChange: handlePageChange,
          }}
          emptyMessage="No appointments found"
          onRowClick={(record) => {
            console.log("Row clicked:", record);
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

        {/* Export Modal */}
        <ExportModal {...exportProps} />
      </div>
    </ContainerWrapper>
  );
};

export default AllAppointment;
