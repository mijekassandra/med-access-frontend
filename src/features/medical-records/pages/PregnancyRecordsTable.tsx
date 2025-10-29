import React, { useState } from "react";

//icons
import {
  Edit,
  Trash,
  Eye,
  SearchNormal1,
  Add,
  ExportCurve,
} from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Chip from "../../../global-components/Chip";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import Button from "../../../global-components/Button";
import AddPregnancyRecordModal from "../components/AddPregnancyRecordModal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import ExportModal from "../../../components/ExportModal";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// Sample data type
interface PregnancyRecord {
  id: string;
  patientName: string;
  startDate: string;
  weeksOfPregnancy: number;
  milestoneName: string;
  status: "ongoing" | "completed" | "pending";
  dateRecorded: string;
}

// Sample data
const sampleData: PregnancyRecord[] = [
  {
    id: "001",
    patientName: "John Doe",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
    dateRecorded: "2024-03-15",
  },
  {
    id: "002",
    patientName: "Taylor Swift",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
    dateRecorded: "2024-03-15",
  },
  {
    id: "003",
    patientName: "Mike Johnson",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
    dateRecorded: "2024-03-15",
  },
  {
    id: "004",
    patientName: "Ariana Grande",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
    dateRecorded: "2024-03-15",
  },
  {
    id: "005",
    patientName: "Billie Eilish",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
    dateRecorded: "2024-03-15",
  },
  {
    id: "006",
    patientName: "Madison Beer",
    startDate: "2024-02-10",
    weeksOfPregnancy: 12,
    milestoneName: "First Trimester Screening",
    status: "completed",
    dateRecorded: "2024-03-15",
  },
  {
    id: "007",
    patientName: "Miley Cyrus",
    startDate: "2024-01-20",
    weeksOfPregnancy: 8,
    milestoneName: "Initial Consultation",
    status: "completed",
    dateRecorded: "2024-03-15",
  },
];

const PregnancyRecordsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<PregnancyRecord[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPregnancyModalOpen, setIsAddPregnancyModalOpen] = useState(false);
  const [isEditPregnancyModalOpen, setIsEditPregnancyModalOpen] =
    useState(false);
  const [isViewPregnancyModalOpen, setIsViewPregnancyModalOpen] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PregnancyRecord | null>(
    null
  );
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  //sample only
  const user = {
    role: "admin",
  };

  // Export functionality
  const exportColumns: ExportColumn[] = [
    { key: "patientName", header: "Patient Name" },
    { key: "startDate", header: "Start Date" },
    { key: "weeksOfPregnancy", header: "Weeks of Pregnancy" },
    { key: "milestoneName", header: "Milestone Name" },
    { key: "dateRecorded", header: "Date of Record" },
    { key: "status", header: "Status" },
  ];

  const { openExportModal, exportProps } = useExport({
    data: records,
    columns: exportColumns,
    title: "Export Pregnancy Records",
    filename: "pregnancy-records",
    dateConfig: {
      columnKey: "dateRecorded",
      label: "Date of Record",
      dateFormat: "iso",
    },
  });

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  // Show error snackbar
  const showError = (message: string) => {
    setSnackbar({
      isOpen: true,
      message,
      type: "error",
    });
  };

  // Show success snackbar
  const showSuccess = (message: string) => {
    setSnackbar({
      isOpen: true,
      message,
      type: "success",
    });
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  // Define columns
  const columns: TableColumn<PregnancyRecord>[] = [
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
      key: "startDate",
      header: "Start Date",
      width: "140px",
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
      key: "weeksOfPregnancy",
      header: "Weeks of Pregnancy",
      width: "120px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "milestoneName",
      header: "Milestone Name",
      sortable: true,
    },
    {
      key: "dateRecorded",
      header: "Date of Record",
      width: "200px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "140px",
      sortable: true,
      render: (value) => (
        <Chip
          label={value}
          type="colored"
          color={
            value === "ongoing"
              ? "yellow"
              : value === "completed"
              ? "green"
              : "gray"
          }
        />
      ),
    },
  ];

  // Define actions
  const actions: TableAction<PregnancyRecord>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        setSelectedRecord(record);
        setIsViewPregnancyModalOpen(true);
      },
    },
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedRecord(record);
        setIsEditPregnancyModalOpen(true);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete record:", record);
        if (
          confirm(
            `Are you sure you want to delete the pregnancy record with ID: ${record.id}?`
          )
        ) {
          setRecords(records.filter((r) => r.id !== record.id));
          showSuccess("Pregnancy record deleted successfully");
        }
      },
      disabled: (record) => record.status === "completed", // Disable for completed records
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleRowClick = (record: PregnancyRecord) => {
    setSelectedRecord(record);
    setIsViewPregnancyModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddPregnancyModalOpen(false);
    setIsEditPregnancyModalOpen(false);
    setIsViewPregnancyModalOpen(false);
    setSelectedRecord(null);
  };

  const handleEditSave = async (updatedRecord: any) => {
    if (!selectedRecord) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the record in the local state
      setRecords(
        records.map((record) =>
          record.id === selectedRecord.id
            ? { ...record, ...updatedRecord }
            : record
        )
      );

      showSuccess("Pregnancy record updated successfully");
      setIsEditPregnancyModalOpen(false);
      setSelectedRecord(null);
    } catch (error: any) {
      showError("Failed to update pregnancy record");
    }
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and filter */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search pregnancy records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
        />
        <div
          className={`flex gap-4 items-center ${
            user.role === "admin" ? "justify-between" : "justify-end"
          }`}
        >
          {user.role === "admin" && (
            <div className="min-w-[40%] sm:min-w-[160px]">
              <Dropdown
                options={[
                  { label: "All", value: "all" },
                  { label: "Ongoing", value: "ongoing" },
                  { label: "Completed", value: "completed" },
                  { label: "Pending", value: "pending" },
                ]}
                label="Filter by:"
                placeholder="Filter by"
                onSelectionChange={handleSelectionChange}
              />
            </div>
          )}

          <Button
            label="Add Pregnancy Record"
            leftIcon={<Add />}
            className={`w-[60%] sm:w-[220px] truncate ${
              user.role === "admin" ? "w-[60%]" : "w-[200px]"
            }`}
            size="medium"
            onClick={() => setIsAddPregnancyModalOpen(true)}
          />
          <ButtonsIcon
            icon={<ExportCurve size={24} />}
            variant="secondary"
            size="large"
            onClick={openExportModal}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredRecords}
        columns={columns}
        actions={actions}
        searchable={false} // We're handling search manually
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredRecords.length / 5), // 5 items per page
          onChange: handlePageChange,
        }}
        emptyMessage="No pregnancy records found"
        onRowClick={handleRowClick}
        className="shadow-sm"
      />

      {/* Add Pregnancy Record Modal */}
      <AddPregnancyRecordModal
        isOpen={isAddPregnancyModalOpen}
        onClose={handleCloseModals}
        mode="add"
        onSave={(newRecord) => {
          console.log("New pregnancy record:", newRecord);
          // Here you would typically add the new record to your state or make an API call
          showSuccess("Pregnancy record added successfully");
        }}
      />

      {/* Edit Pregnancy Record Modal */}
      <AddPregnancyRecordModal
        isOpen={isEditPregnancyModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        pregnancyRecord={
          selectedRecord
            ? {
                id: selectedRecord.id,
                fullName: selectedRecord.patientName,
                startDate: selectedRecord.startDate,
                weeksOfPregnancy: selectedRecord.weeksOfPregnancy,
                milestoneName: selectedRecord.milestoneName,
                status:
                  selectedRecord.status === "ongoing"
                    ? "Ongoing"
                    : selectedRecord.status === "completed"
                    ? "Completed"
                    : "Pending",
              }
            : undefined
        }
        onSave={handleEditSave}
      />

      {/* View Pregnancy Record Modal */}
      <AddPregnancyRecordModal
        isOpen={isViewPregnancyModalOpen}
        onClose={handleCloseModals}
        mode="view"
        pregnancyRecord={
          selectedRecord
            ? {
                id: selectedRecord.id,
                fullName: selectedRecord.patientName,
                startDate: selectedRecord.startDate,
                weeksOfPregnancy: selectedRecord.weeksOfPregnancy,
                milestoneName: selectedRecord.milestoneName,
                status:
                  selectedRecord.status === "ongoing"
                    ? "Ongoing"
                    : selectedRecord.status === "completed"
                    ? "Completed"
                    : "Pending",
              }
            : undefined
        }
      />

      {/* Snackbar for notifications */}
      <SnackbarAlert
        isOpen={snackbar.isOpen}
        title={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
        duration={3000}
      />

      {/* Export Modal */}
      <ExportModal {...exportProps} />
    </div>
  );
};

export default PregnancyRecordsTable;
