import React, { useState, useEffect, useMemo, useCallback } from "react";

//icons
import { Add, SearchNormal1, Edit, Trash } from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../global-components/Table";
import ContainerWrapper from "../../components/ContainerWrapper";
import Inputs from "../../global-components/Inputs";
import Button from "../../global-components/Button";
import AddHealthReport from "./component/AddHealthReport";
import DeleteConfirmation from "../../components/DeleteConfirmation";
// import Dropdown, { type Option } from "../../global-components/Dropdown";
import SnackbarAlert from "../../global-components/SnackbarAlert";

// types
import type { HealthReportTable } from "../../types/database";

// integration
import {
  useGetHealthReportsQuery,
  useDeleteHealthReportMutation,
} from "./api/healthReportsApi";

const Reports: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false);
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedReport, setSelectedReport] =
    useState<HealthReportTable | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // Pagination constants
  const ITEMS_PER_PAGE = 10;

  // Search debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  //sample only
  const user = {
    role: "admin",
  };

  //! rtk query -----------------------
  const { data: reports = [] } = useGetHealthReportsQuery();

  const [deleteReport, { isLoading: isDeleting }] =
    useDeleteHealthReportMutation();

  useEffect(() => {
    console.log("selectedReport: ", selectedReport);
  }, [selectedReport]);

  //! Define columns -----------------------
  const columns: TableColumn<HealthReportTable>[] = [
    {
      key: "id",
      header: "Report ID",
      width: "130px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "title",
      header: "Title of Report",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "report_type",
      header: "Type of Report",
      width: "180px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "data_collected",
      header: "Data/Content",
      sortable: true,
      render: (value) => (
        <span
          className="text-body-small-reg text-szBlack700 text-ellipsis overflow-hidden whitespace-nowrap block max-w-[200px]"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: "report_date",
      header: "Date of Report",
      width: "150px",
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

  //! Define actions -----------------------
  const actions: TableAction<HealthReportTable>[] = [
    {
      label: "Edit Report",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedReport(record);
        setIsEditReportModalOpen(true);
      },
    },
    {
      label: "Delete Report",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setSelectedReport(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: (record) => record.id === 1,
    },
  ];

  //! Pagination -----------------------
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //! Search term -----------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  //? Edit save -----------------------
  const handleEditSave = (updatedReport: HealthReportTable) => {
    // TODO: Implement edit API call
    console.log("Edit report:", updatedReport);
  };

  //? Delete confirm -----------------------
  const handleDeleteConfirm = async () => {
    if (selectedReport) {
      try {
        await deleteReport({ id: selectedReport.id }).unwrap();
        setIsDeleteConfirmationOpen(false);
        setSelectedReport(null);
        setSnackbarMessage("Health report deleted successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);
      } catch (error) {
        console.error("Failed to delete report:", error);
        setSnackbarMessage("Failed to delete report. Please try again.");
        setSnackbarType("error");
        setShowSnackbar(true); // Keep the modal open so the user can try again
      }
    }
  };

  //! Close modals -----------------------
  const handleCloseModals = () => {
    setIsAddReportModalOpen(false);
    setIsEditReportModalOpen(false);
    setIsViewReportModalOpen(false);
    setSelectedReport(null);
  };

  //! Close snackbar -----------------------
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  //! Search reports -----------------------
  const searchReports = useCallback(
    (reports: HealthReportTable[], searchTerm: string): HealthReportTable[] => {
      if (!searchTerm.trim()) return reports;

      const searchLower = searchTerm.toLowerCase().trim();

      return reports.filter((report) => {
        // Search in specific fields with priority
        const searchableFields = [
          report.title,
          report.report_type,
          report.data_collected,
          report.id.toString(),
          new Date(report.report_date).toLocaleDateString(),
        ];

        return searchableFields.some((field) => {
          if (field == null) return false;
          return field.toString().toLowerCase().includes(searchLower);
        });
      });
    },
    []
  );

  //! Filter reports based on search term -----------------------
  const filteredReports = useMemo(() => {
    return searchReports(reports, debouncedSearchTerm);
  }, [reports, debouncedSearchTerm, searchReports]);

  //! Calculate pagination -----------------------
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 gap-6">
        {/* Header with search and add button */}
        <div className="flex flex-col lg:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
          <Inputs
            type="text"
            placeholder="Search reports by title, type, content, ID, etc..."
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
                    { label: "Morbidity", value: "morbidity" },
                    { label: "Immunization", value: "immunization" },
                    { label: "Maternal Health", value: "maternal" },
                    { label: "Pediatric", value: "pediatric" },
                    { label: "Emergency", value: "emergency" },
                  ]}
                  label="Filter by:"
                  placeholder="Filter by"
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            )} */}

            <Button
              label="Add Report "
              leftIcon={<Add />}
              className={`w-[60%] sm:w-[180px] truncate ${
                user.role === "admin" ? "w-[60%]" : "w-[180px]"
              }`}
              size="medium"
              onClick={() => setIsAddReportModalOpen(true)}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          data={paginatedReports}
          columns={columns}
          actions={actions}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages,
            onChange: handlePageChange,
          }}
          emptyMessage={
            debouncedSearchTerm
              ? `No reports found matching "${debouncedSearchTerm}"`
              : "No reports found"
          }
          onRowClick={(record) => {
            setSelectedReport(record);
            setIsViewReportModalOpen(true);
          }}
          className="shadow-sm"
        />
      </div>

      {/* Add Health Report Modal */}
      <AddHealthReport
        isOpen={isAddReportModalOpen}
        onClose={handleCloseModals}
        mode="add"
      />

      {/* Edit Health Report Modal */}
      <AddHealthReport
        isOpen={isEditReportModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        report={selectedReport || undefined}
        onSave={handleEditSave}
      />

      {/* View Health Report Modal */}
      <AddHealthReport
        isOpen={isViewReportModalOpen}
        onClose={handleCloseModals}
        mode="view"
        report={selectedReport || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedReport(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Health Report"
        description={`Are you sure you want to delete the report "${selectedReport?.title}"? 
        This action cannot be undone.`}
        isLoading={isDeleting}
      />

      {/* Snackbar Alert */}
      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </ContainerWrapper>
  );
};

export default Reports;
