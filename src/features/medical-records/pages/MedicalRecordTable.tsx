import React, { useState } from "react";

//icons
import { Edit, Trash, SearchNormal1, Add, ExportCurve } from "iconsax-react";

//components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import Button from "../../../global-components/Button";
import AddUserMedicalModal from "../components/AddUserMedicalModal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";

//export
import ExportModal from "../../../components/ExportModal";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// Sample data type
interface MedicalRecord {
  id: string;
  patientName: string;
  diagnosis: string;
  treatmentPlan: string;
  dateOfRecord: string;
}

// Sample data
const sampleData: MedicalRecord[] = [
  {
    id: "001",
    patientName: "John Doe",
    diagnosis: "Acute Tonsillitis",
    treatmentPlan: "Antibiotics, rest",
    dateOfRecord: "2024-06-10 09:40:00",
  },
  {
    id: "002",
    patientName: "Taylor Swift",
    diagnosis: "Hypertension",
    treatmentPlan: "ACE inhibitors, lifestyle changes",
    dateOfRecord: "2024-06-09 14:30:00",
  },
  {
    id: "003",
    patientName: "Mike Johnson",
    diagnosis: "Diabetes Type 2",
    treatmentPlan: "Metformin, diet control",
    dateOfRecord: "2024-06-08 11:15:00",
  },
  {
    id: "004",
    patientName: "Ariana Grande",
    diagnosis: "Migraine",
    treatmentPlan: "Pain relievers, stress management ",
    dateOfRecord: "2024-06-07 16:45:00",
  },
  {
    id: "005",
    patientName: "Billie Eilish",
    diagnosis: "Asthma",
    treatmentPlan: "Inhalers, avoid triggers",
    dateOfRecord: "2024-06-06 10:20:00",
  },
  {
    id: "006",
    patientName: "Lil Nas X",
    diagnosis: "Asthma",
    treatmentPlan: "Inhalers, avoid triggers",
    dateOfRecord: "2024-06-06 10:20:00",
  },
  {
    id: "007",
    patientName: "Post Malone",
    diagnosis: "Asthma",
    treatmentPlan: "Inhalers, avoid triggers",
    dateOfRecord: "2024-06-06 10:20:00",
  },
];

const MedicalRecordTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<MedicalRecord[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMedicalModalOpen, setIsAddMedicalModalOpen] = useState(false);
  const [isEditMedicalModalOpen, setIsEditMedicalModalOpen] = useState(false);
  const [isViewMedicalModalOpen, setIsViewMedicalModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
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
    { key: "diagnosis", header: "Diagnosis" },
    { key: "treatmentPlan", header: "Treatment Plan" },
    { key: "dateOfRecord", header: "Date of Record" },
  ];

  const { openExportModal, exportProps } = useExport({
    data: records,
    columns: exportColumns,
    title: "Export Medical Records",
    filename: "medical-records",
    dateConfig: {
      columnKey: "dateOfRecord",
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
  const columns: TableColumn<MedicalRecord>[] = [
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
      key: "diagnosis",
      header: "Diagnosis",
      sortable: true,
    },
    {
      key: "treatmentPlan",
      header: "Treatment Plan",
      sortable: true,
    },
    {
      key: "dateOfRecord",
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
  ];

  // Define actions
  const actions: TableAction<MedicalRecord>[] = [
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedRecord(record);
        setIsEditMedicalModalOpen(true);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete record:", record);
        if (
          confirm(
            `Are you sure you want to delete the record for Patient ID: ${record.id}?`
          )
        ) {
          setRecords(records.filter((r) => r.id !== record.id));
          showSuccess("Medical record deleted successfully");
        }
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleRowClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsViewMedicalModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddMedicalModalOpen(false);
    setIsEditMedicalModalOpen(false);
    setIsViewMedicalModalOpen(false);
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

      showSuccess("Medical record updated successfully");
      setIsEditMedicalModalOpen(false);
      setSelectedRecord(null);
    } catch (error: any) {
      showError("Failed to update medical record");
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
          placeholder="Search medical records..."
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
                  { label: "Active", value: "active" },
                  { label: "Completed", value: "completed" },
                ]}
                label="Filter by:"
                placeholder="Filter by"
                onSelectionChange={handleSelectionChange}
              />
            </div>
          )}

          <Button
            label="Add Patient"
            leftIcon={<Add />}
            className={`w-[60%] sm:w-[180px] truncate ${
              user.role === "admin" ? "w-[60%]" : "w-[180px]"
            }`}
            size="medium"
            onClick={() => setIsAddMedicalModalOpen(true)}
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
        emptyMessage="No medical records found"
        onRowClick={handleRowClick}
        className="shadow-sm"
      />

      {/* Add Medical Record Modal */}
      <AddUserMedicalModal
        isOpen={isAddMedicalModalOpen}
        onClose={handleCloseModals}
        mode="add"
        onSave={(newRecord) => {
          console.log("New medical record:", newRecord);
          // Here you would typically add the new record to your state or make an API call
          showSuccess("Medical record added successfully");
        }}
      />

      {/* Edit Medical Record Modal */}
      <AddUserMedicalModal
        isOpen={isEditMedicalModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        medicalRecord={
          selectedRecord
            ? {
                id: selectedRecord.id,
                fullName: selectedRecord.patientName,
                diagnosis: selectedRecord.diagnosis,
                dateOfRecord: selectedRecord.dateOfRecord,
                treatmentPlan: selectedRecord.treatmentPlan,
              }
            : undefined
        }
        onSave={handleEditSave}
      />

      {/* View Medical Record Modal */}
      <AddUserMedicalModal
        isOpen={isViewMedicalModalOpen}
        onClose={handleCloseModals}
        mode="view"
        medicalRecord={
          selectedRecord
            ? {
                id: selectedRecord.id,
                fullName: selectedRecord.patientName,
                diagnosis: selectedRecord.diagnosis,
                dateOfRecord: selectedRecord.dateOfRecord,
                treatmentPlan: selectedRecord.treatmentPlan,
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

export default MedicalRecordTable;
