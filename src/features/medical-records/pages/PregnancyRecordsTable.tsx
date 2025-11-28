import React, { useState, useEffect } from "react";

//icons
import {
  Edit,
  Trash,
  Eye,
  SearchNormal1,
  Add,
  ExportCurve,
  Calendar,
} from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import Button from "../../../global-components/Button";
import AddPregnancyRecordModal from "../components/AddPregnancyRecordModal";
import CheckupsModal from "../components/CheckupsModal";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import ExportModal from "../../../components/ExportModal";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// API
import {
  useGetPregnancyRecordsQuery,
  useDeletePregnancyRecordMutation,
  type PregnancyRecord,
} from "../api/pregnancyRecordApi";

// Display type for table
interface PregnancyRecordDisplay {
  id: string;
  patientName: string;
  startDate: string;
  weeksOfPregnancy: number;
  status: string;
  dateRecorded: string;
  hasCheckups: boolean;
}

const PregnancyRecordsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [trimesterFilter, setTrimesterFilter] = useState<string>("all");
  const [isAddPregnancyModalOpen, setIsAddPregnancyModalOpen] = useState(false);
  const [isEditPregnancyModalOpen, setIsEditPregnancyModalOpen] =
    useState(false);
  const [isViewPregnancyModalOpen, setIsViewPregnancyModalOpen] =
    useState(false);
  const [isCheckupsModalOpen, setIsCheckupsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PregnancyRecord | null>(
    null
  );
  const [selectedRecordForDelete, setSelectedRecordForDelete] =
    useState<PregnancyRecordDisplay | null>(null);
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
    data: pregnancyRecordsResponse,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetPregnancyRecordsQuery();

  const [deletePregnancyRecord, { isLoading: isDeleting }] =
    useDeletePregnancyRecordMutation();

  // Convert backend data to display format
  const records: PregnancyRecordDisplay[] =
    pregnancyRecordsResponse?.data?.map((record) => ({
      id: record._id,
      patientName: `${record.patient.firstName} ${record.patient.lastName}`,
      startDate: record.firstDayOfLastPeriod,
      weeksOfPregnancy: record.numberOfWeeks,
      status: record.status || "",
      dateRecorded: record.createdAt,
      hasCheckups: record.checkups && record.checkups.length > 0,
    })) || [];

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      const errorMessage =
        (fetchError as any)?.data?.message ||
        (fetchError as any)?.error ||
        "Failed to load pregnancy records. Please try again.";
      showError(errorMessage);
    }
  }, [fetchError]);

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

  const handleTrimesterFilterChange = (selected: Option | Option[]) => {
    const filterValue = Array.isArray(selected)
      ? selected[0]?.value
      : selected.value;
    setTrimesterFilter(filterValue || "all");
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Helper function to get trimester based on weeks
  const getTrimester = (weeks: number): string => {
    if (weeks >= 0 && weeks <= 12) return "first";
    if (weeks >= 13 && weeks <= 27) return "second";
    if (weeks >= 28 && weeks <= 45) return "third";
    return "all";
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

  // Get user role (you may need to adjust this based on your auth setup)
  const user = {
    role: "admin", // This should come from your auth context/state
  };

  // Define columns
  const columns: TableColumn<PregnancyRecordDisplay>[] = [
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
        <span className="text-body-small-reg text-szBlack700">
          {value || "N/A"}
        </span>
      ),
    },
  ];

  // Handle delete - opens confirmation modal
  const handleDelete = (record: PregnancyRecordDisplay) => {
    setSelectedRecordForDelete(record);
    setIsDeleteConfirmationOpen(true);
  };

  // Handle delete confirmation - performs actual delete
  const handleDeleteConfirm = async () => {
    if (!selectedRecordForDelete) return;

    try {
      await deletePregnancyRecord(selectedRecordForDelete.id).unwrap();
      showSuccess("Pregnancy record deleted successfully");
      setIsDeleteConfirmationOpen(false);
      setSelectedRecordForDelete(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to delete pregnancy record. Please try again.";
      showError(errorMessage);
    }
  };

  // Find backend record by display record
  const findBackendRecord = (
    displayRecord: PregnancyRecordDisplay
  ): PregnancyRecord | null => {
    return (
      pregnancyRecordsResponse?.data?.find((r) => r._id === displayRecord.id) ||
      null
    );
  };

  // Define actions
  const actions: TableAction<PregnancyRecordDisplay>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        const backendRecord = findBackendRecord(record);
        if (backendRecord) {
          setSelectedRecord(backendRecord);
          setIsViewPregnancyModalOpen(true);
        }
      },
    },
    {
      label: "View All Checkups",
      icon: <Calendar size={16} />,
      onClick: (record) => {
        const backendRecord = findBackendRecord(record);
        if (backendRecord) {
          setSelectedRecord(backendRecord);
          setIsCheckupsModalOpen(true);
        }
      },
    },
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        const backendRecord = findBackendRecord(record);
        if (backendRecord) {
          setSelectedRecord(backendRecord);
          setIsEditPregnancyModalOpen(true);
        }
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: handleDelete,
      disabled: () => isDeleting,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (record: PregnancyRecordDisplay) => {
    const backendRecord = findBackendRecord(record);
    if (backendRecord) {
      setSelectedRecord(backendRecord);
      setIsViewPregnancyModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsAddPregnancyModalOpen(false);
    setIsEditPregnancyModalOpen(false);
    setIsViewPregnancyModalOpen(false);
    setIsCheckupsModalOpen(false);
    setIsDeleteConfirmationOpen(false);
    setSelectedRecord(null);
    setSelectedRecordForDelete(null);
  };

  const handleCreateSuccess = () => {
    showSuccess("Pregnancy record created successfully");
    setIsAddPregnancyModalOpen(false);
  };

  const handleEditSuccess = () => {
    showSuccess("Pregnancy record updated successfully");
    setIsEditPregnancyModalOpen(false);
    setSelectedRecord(null);
  };

  // Filter records based on search term and trimester
  const filteredRecords = records.filter((record) => {
    // Apply trimester filter
    if (trimesterFilter !== "all") {
      const recordTrimester = getTrimester(record.weeksOfPregnancy);
      if (recordTrimester !== trimesterFilter) {
        return false;
      }
    }

    // Apply search filter
    if (searchTerm) {
      return Object.values(record).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

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
            <div className="min-w-[40%] sm:min-w-[200px]">
              <Dropdown
                options={[
                  { label: "All Records", value: "all" },
                  { label: "First Trimester (0-12 weeks)", value: "first" },
                  { label: "Second Trimester (13-27 weeks)", value: "second" },
                  { label: "Third Trimester (28-45 weeks)", value: "third" },
                ]}
                label="Filter by Trimester:"
                placeholder="Select trimester"
                onSelectionChange={handleTrimesterFilterChange}
                value={
                  [
                    { label: "All Records", value: "all" },
                    { label: "First Trimester (0-12 weeks)", value: "first" },
                    {
                      label: "Second Trimester (13-27 weeks)",
                      value: "second",
                    },
                    { label: "Third Trimester (28-45 weeks)", value: "third" },
                  ].find((opt) => opt.value === trimesterFilter) || {
                    label: "All Records",
                    value: "all",
                  }
                }
                size="small"
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
          <div title="Generate report">
            <ButtonsIcon
              icon={<ExportCurve size={24} />}
              variant="secondary"
              size="large"
              onClick={openExportModal}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <span className="text-body-base-reg text-szBlack700">Loading...</span>
        </div>
      ) : (
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
      )}

      {/* Add Pregnancy Record Modal */}
      <AddPregnancyRecordModal
        isOpen={isAddPregnancyModalOpen}
        onClose={handleCloseModals}
        mode="add"
        onSuccess={handleCreateSuccess}
        onError={showError}
      />

      {/* Edit Pregnancy Record Modal */}
      <AddPregnancyRecordModal
        isOpen={isEditPregnancyModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        pregnancyRecord={selectedRecord || undefined}
        onSuccess={handleEditSuccess}
        onError={showError}
      />

      {/* View Pregnancy Record Modal */}
      <AddPregnancyRecordModal
        isOpen={isViewPregnancyModalOpen}
        onClose={handleCloseModals}
        mode="view"
        pregnancyRecord={selectedRecord || undefined}
      />

      {/* Checkups Modal */}
      <CheckupsModal
        isOpen={isCheckupsModalOpen}
        onClose={handleCloseModals}
        pregnancyRecord={selectedRecord}
        onCheckupAdded={async () => {
          // Refetch to get updated record with new checkup
          const result = await refetch();
          // Update selected record with fresh data
          if (selectedRecord && result.data?.data) {
            const updatedRecord = result.data.data.find(
              (r) => r._id === selectedRecord._id
            );
            if (updatedRecord) {
              setSelectedRecord(updatedRecord);
            }
          }
        }}
        onError={showError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedRecordForDelete(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Pregnancy Record"
        description={`Are you sure you want to delete the pregnancy record for "${selectedRecordForDelete?.patientName}"?`}
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

export default PregnancyRecordsTable;
