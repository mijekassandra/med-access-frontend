import React, { useState } from "react";
import { useSelector } from "react-redux";

//icons
import { Add, SearchNormal1, Edit, Trash, ExportCurve } from "iconsax-react";

// components
import type { RootState } from "../../../store";
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import AddPatientModal from "./AddPatientModal";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import ButtonsIcon from "../../../global-components/ButtonsIcon";

// Expprt
import ExportModal from "../../../components/ExportModal";
import { type ExportColumn } from "../../../types/export";
import { useExport } from "../../../hooks/useExport";

// API
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  type User,
} from "../api/userApi";

// Convert User to Patient format for display
const convertUserToPatient = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  firstname: user.firstName,
  lastname: user.lastName,
  gender: user.gender,
  dateOfBirth: user.dateOfBirth,
  username: user.username,
  address: user.address,
  email: user.email || "",
  contactNumber: user.phone,
  dateRegistered: new Date(user.createdAt).toLocaleString(),
});

const PatientsTable = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isViewPatientModalOpen, setIsViewPatientModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // API hooks
  const { data: usersData, isLoading, error } = useGetAllUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Convert users to patients for display (only users with role "user")
  const patients =
    usersData?.data
      ?.filter((user) => user.role === "user")
      ?.map(convertUserToPatient) || [];

  // Export functionality
  const exportColumns: ExportColumn[] = [
    { key: "fullName", header: "Full Name" },
    { key: "username", header: "Username" },
    { key: "address", header: "Address" },
    { key: "email", header: "Email" },
    { key: "contactNumber", header: "Contact No." },
    { key: "dateRegistered", header: "Date Registered" },
  ];

  const { openExportModal, exportProps } = useExport({
    data: patients,
    columns: exportColumns,
    title: "Export Patients",
    filename: "patients",
    dateConfig: {
      columnKey: "dateRegistered",
      label: "Date Registered",
      dateFormat: "iso",
    },
  });

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
  const columns: TableColumn<ReturnType<typeof convertUserToPatient>>[] = [
    {
      key: "fullName",
      header: "Full Name",
      sortable: true,
      width: "160px",
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "username",
      header: "Username",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "address",
      header: "Address",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 truncate block max-w-[120px] ">
          {value}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "contactNumber",
      header: "Contact No.",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "dateRegistered",
      header: "Date Registered",
      width: "160px",
      sortable: true,
      render: (value) => (
        <div className="text-body-small-reg text-szBlack700">
          <div>{value.split(" ")[0]}</div>
          <div className="text-xs text-szBlack500">{value.split(" ")[1]}</div>
        </div>
      ),
    },
  ];

  // Define actions
  const actions: TableAction<ReturnType<typeof convertUserToPatient>>[] = [
    {
      label: "Edit Patient",
      icon: <Edit size={16} />,
      onClick: (record) => {
        // Find the original user data
        const originalUser = usersData?.data?.find(
          (user) => user.id === record.id
        );
        if (originalUser) {
          setSelectedPatient(originalUser);
          setIsEditPatientModalOpen(true);
        }
      },
    },
    {
      label: "Delete Patient",
      icon: <Trash size={16} />,
      onClick: (record) => {
        // Find the original user data
        const originalUser = usersData?.data?.find(
          (user) => user.id === record.id
        );
        if (originalUser) {
          setSelectedPatient(originalUser);
          setIsDeleteConfirmationOpen(true);
        }
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleEditSave = async (updatedPatient: any) => {
    if (!selectedPatient) return;

    try {
      await updateUser({
        id: selectedPatient.id,
        data: {
          firstName: updatedPatient.firstname,
          lastName: updatedPatient.lastname,
          address: updatedPatient.address,
          email: updatedPatient.email,
          phone: updatedPatient.contactNumber,
        },
      }).unwrap();

      showSuccess("Patient updated successfully");
      setIsEditPatientModalOpen(false);
      setSelectedPatient(null);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update patient");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return;

    try {
      await deleteUser(selectedPatient.id).unwrap();
      showSuccess("Patient deleted successfully");
      setIsDeleteConfirmationOpen(false);
      setSelectedPatient(null);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to delete patient");
    }
  };

  const handleCloseModals = () => {
    setIsAddPatientModalOpen(false);
    setIsEditPatientModalOpen(false);
    setIsViewPatientModalOpen(false);
    setSelectedPatient(null);
  };

  const handleRowClick = (record: ReturnType<typeof convertUserToPatient>) => {
    // Find the original user data
    const originalUser = usersData?.data?.find((user) => user.id === record.id);
    if (originalUser) {
      setSelectedPatient(originalUser);
      setIsViewPatientModalOpen(true);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    // Search filter
    const matchesSearch = Object.values(patient).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesSearch;
  });

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Show error if API call fails
  React.useEffect(() => {
    if (error) {
      showError("Failed to load patients data");
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and add button */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className=""
        />
        <div className={`flex gap-4 items-center `}>
          {/* <div className="min-w-[40%] sm:min-w-[160px]">
            <Dropdown
              options={[
                { label: "All", value: "all" },
                { label: "New", value: "new" },
                { label: "Returning", value: "returning" },
              ]}
              label="Filter by:"
              placeholder="Filter by"
              onSelectionChange={handleSelectionChange}
              value={{
                label:
                  selectedFilter === "all"
                    ? "All"
                    : selectedFilter === "new"
                    ? "New"
                    : "Returning",
                value: selectedFilter,
              }}
            />
          </div> */}

          {user?.role === "admin" && (
            <Button
              label="Add User"
              leftIcon={<Add />}
              className={`w-fit sm:w-[150px] truncate`}
              size="medium"
              onClick={() => setIsAddPatientModalOpen(true)}
            />
          )}
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
      <Table
        data={paginatedPatients}
        columns={columns}
        actions={user?.role === "admin" ? actions : undefined}
        searchable={false}
        pagination={{
          currentPage,
          totalPages: totalPages || 1, // Ensure at least 1 page
          onChange: handlePageChange,
        }}
        emptyMessage="No patients found"
        onRowClick={handleRowClick}
        className="shadow-sm"
        loading={isLoading}
      />

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={handleCloseModals}
        mode="add"
      />

      {/* Edit Patient Modal */}
      <AddPatientModal
        isOpen={isEditPatientModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        patient={
          selectedPatient
            ? {
                id: selectedPatient.id,
                username: selectedPatient.username,
                firstname: selectedPatient.firstName,
                lastname: selectedPatient.lastName,
                address: selectedPatient.address,
                email: selectedPatient.email || "",
                contactNumber: selectedPatient.phone,
                gender: selectedPatient.gender,
                dateOfBirth: selectedPatient.dateOfBirth,
                dateRegistered: new Date(
                  selectedPatient.createdAt
                ).toLocaleString(),
              }
            : undefined
        }
        onSave={handleEditSave}
      />

      {/* View Patient Modal */}
      <AddPatientModal
        isOpen={isViewPatientModalOpen}
        onClose={handleCloseModals}
        mode="view"
        patient={
          selectedPatient
            ? {
                id: selectedPatient.id,
                username: selectedPatient.username,
                firstname: selectedPatient.firstName,
                lastname: selectedPatient.lastName,
                address: selectedPatient.address,
                email: selectedPatient.email || "",
                contactNumber: selectedPatient.phone,
                gender: selectedPatient.gender,
                dateOfBirth: selectedPatient.dateOfBirth,
                dateRegistered: new Date(
                  selectedPatient.createdAt
                ).toLocaleString(),
              }
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedPatient(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Patient"
        description={`Are you sure you want to delete the patient "${selectedPatient?.username}"? `}
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

export default PatientsTable;
