import React, { useState, useEffect } from "react";

//icons
import { Edit, Trash, SearchNormal1, Add, ExportCurve } from "iconsax-react";

//components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import AddUserMedicalModal from "../components/AddUserMedicalModal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import DeleteConfirmation from "../../../components/DeleteConfirmation";

//export
import ExportModal from "../../../components/ExportModal";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// API
import {
  useGetMedicalRecordsQuery,
  useDeleteMedicalRecordMutation,
} from "../api/medicalRecordsApi";

// Table display type for compatibility with existing table component
interface MedicalRecordDisplay {
  id: string;
  patientName: string;
  patientId: string; // Patient user ID for API operations
  diagnosis: string;
  treatmentPlan: string;
  dateOfRecord: string;
  _id: string; // Keep original ID for API operations
}

const MedicalRecordTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMedicalModalOpen, setIsAddMedicalModalOpen] = useState(false);
  const [isEditMedicalModalOpen, setIsEditMedicalModalOpen] = useState(false);
  const [isViewMedicalModalOpen, setIsViewMedicalModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<MedicalRecordDisplay | null>(null);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // RTK Query hooks
  const {
    data: medicalRecordsData,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetMedicalRecordsQuery();

  const [deleteMedicalRecord, { isLoading: isDeleting }] =
    useDeleteMedicalRecordMutation();

  // Transform API data to display format
  const records: MedicalRecordDisplay[] =
    medicalRecordsData?.data
      ?.filter((record) => record.isPublished)
      ?.map((record) => ({
        id: record._id,
        _id: record._id,
        patientName: `${record.patient.firstName} ${record.patient.lastName}`,
        patientId: record.patient._id, // Store patient ID for edit mode
        diagnosis: record.diagnosis,
        treatmentPlan: record.treatmentPlan,
        dateOfRecord: record.dateOfRecord,
      })) || [];

  //sample only
  const user = {
    role: "admin",
  };

  // Error handling for API calls
  useEffect(() => {
    if (fetchError) {
      showError(
        "data" in fetchError
          ? (fetchError.data as any)?.message ||
              "Failed to fetch medical records"
          : "Failed to fetch medical records"
      );
    }
  }, [fetchError]);

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

  // const handleSelectionChange = (selected: Option | Option[]) => {
  //   console.log("Selected Filter:", selected);
  // };

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
  const columns: TableColumn<MedicalRecordDisplay>[] = [
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
      render: (value) => (
        <span
          className="text-body-small-reg text-szBlack700 truncate block max-w-[300px]"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: "dateOfRecord",
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
  ];

  // Define actions
  const actions: TableAction<MedicalRecordDisplay>[] = [
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
        setSelectedRecord(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: () => isDeleting,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleRowClick = (record: MedicalRecordDisplay) => {
    setSelectedRecord(record);
    setIsViewMedicalModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddMedicalModalOpen(false);
    setIsEditMedicalModalOpen(false);
    setIsViewMedicalModalOpen(false);
    setIsDeleteConfirmationOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;

    try {
      await deleteMedicalRecord(selectedRecord._id).unwrap();
      showSuccess("Medical record deleted successfully");
      setIsDeleteConfirmationOpen(false);
      setSelectedRecord(null);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to delete medical record");
    }
  };

  const handleEditSave = async () => {
    // This will be handled by the modal component
    // Refetch data after save
    refetch();
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
          {/* {user.role === "admin" && (
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
          )} */}

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
        data={paginatedRecords}
        columns={columns}
        actions={actions}
        searchable={false} // We're handling search manually
        pagination={{
          currentPage,
          totalPages: totalPages || 1, // Ensure at least 1 page
          onChange: handlePageChange,
        }}
        emptyMessage="No medical records found"
        onRowClick={handleRowClick}
        className="shadow-sm"
        loading={isLoading}
      />

      {/* Add Medical Record Modal */}
      <AddUserMedicalModal
        isOpen={isAddMedicalModalOpen}
        onClose={handleCloseModals}
        mode="add"
        onSave={handleEditSave}
        onError={(error) => showError(error)}
        onSuccess={(message) => showSuccess(message)}
      />

      {/* Edit Medical Record Modal */}
      <AddUserMedicalModal
        isOpen={isEditMedicalModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        medicalRecord={
          selectedRecord
            ? {
                id: selectedRecord._id,
                fullName: selectedRecord.patientName,
                patientId: selectedRecord.patientId, // Pass patient ID for proper dropdown selection
                diagnosis: selectedRecord.diagnosis,
                dateOfRecord: selectedRecord.dateOfRecord,
                treatmentPlan: selectedRecord.treatmentPlan,
              }
            : undefined
        }
        onSave={handleEditSave}
        onError={(error) => showError(error)}
        onSuccess={(message) => showSuccess(message)}
      />

      {/* View Medical Record Modal */}
      <AddUserMedicalModal
        isOpen={isViewMedicalModalOpen}
        onClose={handleCloseModals}
        mode="view"
        medicalRecord={
          selectedRecord
            ? {
                id: selectedRecord._id,
                fullName: selectedRecord.patientName,
                diagnosis: selectedRecord.diagnosis,
                dateOfRecord: selectedRecord.dateOfRecord,
                treatmentPlan: selectedRecord.treatmentPlan,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedRecord(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Medical Record"
        description={`Are you sure you want to delete the medical record for "${selectedRecord?.patientName}"?`}
        isLoading={isDeleting}
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
