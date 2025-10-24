import React, { useState } from "react";

//icons
import { Add, SearchNormal1, Edit, Trash } from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import AddPersonnelModal from "./AddPersonnelModal";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// API
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  type User,
} from "../api/userApi";

// Convert User to Personnel format for display
const convertUserToPersonnel = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  firstname: user.firstName,
  lastname: user.lastName,
  specialization:
    user.role === "doctor" ? `${user.specialization}` : "Administrator",
  prcLicenseNumber: user.prcLicenseNumber,
  gender: user.gender,
  contactNumber: user.phone,
  role: user.role,
  username: user.username,
  email: user.email,
  address: user.address,
  dateOfBirth: user.dateOfBirth,
});

const PersonnelTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);
  const [isEditPersonnelModalOpen, setIsEditPersonnelModalOpen] =
    useState(false);
  const [isViewPersonnelModalOpen, setIsViewPersonnelModalOpen] =
    useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<User | null>(null);
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

  // Convert users to personnel for display (only users with role "doctor" and "admin")
  const personnel =
    usersData?.data
      ?.filter((user) => user.role === "doctor" || user.role === "admin")
      ?.map(convertUserToPersonnel) || [];

  const handleSelectionChange = (selected: Option | Option[]) => {
    const filterValue = Array.isArray(selected)
      ? selected[0]?.value
      : selected?.value;
    setSelectedFilter(filterValue || "all");
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
  const columns: TableColumn<ReturnType<typeof convertUserToPersonnel>>[] = [
    {
      key: "fullName",
      header: "Full Name",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "specialization",
      header: "Specialization",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "prcLicenseNumber",
      header: "PRC License No.",
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
      key: "contactNumber",
      header: "Contact No.",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
  ];

  // Define actions
  const actions: TableAction<ReturnType<typeof convertUserToPersonnel>>[] = [
    {
      label: "Edit Personnel",
      icon: <Edit size={16} />,
      onClick: (record) => {
        // Find the original user data
        const originalUser = usersData?.data?.find(
          (user) => user.id === record.id
        );
        if (originalUser) {
          setSelectedPersonnel(originalUser);
          setIsEditPersonnelModalOpen(true);
        }
      },
    },
    {
      label: "Delete Personnel",
      icon: <Trash size={16} />,
      onClick: (record) => {
        // Find the original user data
        const originalUser = usersData?.data?.find(
          (user) => user.id === record.id
        );
        if (originalUser) {
          setSelectedPersonnel(originalUser);
          setIsDeleteConfirmationOpen(true);
        }
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleEditSave = async (updatedPersonnel: any) => {
    if (!selectedPersonnel) return;

    try {
      await updateUser({
        id: selectedPersonnel.id,
        data: {
          firstName: updatedPersonnel.firstname,
          lastName: updatedPersonnel.lastname,
          address: updatedPersonnel.address,
          email: updatedPersonnel.email,
          phone: updatedPersonnel.contactNumber,
        },
      }).unwrap();

      showSuccess("Personnel updated successfully");
      setIsEditPersonnelModalOpen(false);
      setSelectedPersonnel(null);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update personnel");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPersonnel) return;

    try {
      await deleteUser(selectedPersonnel.id).unwrap();
      showSuccess("Personnel deleted successfully");
      setIsDeleteConfirmationOpen(false);
      setSelectedPersonnel(null);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to delete personnel");
    }
  };

  const handleCloseModals = () => {
    setIsAddPersonnelModalOpen(false);
    setIsEditPersonnelModalOpen(false);
    setIsViewPersonnelModalOpen(false);
    setSelectedPersonnel(null);
  };

  const handleRowClick = (
    record: ReturnType<typeof convertUserToPersonnel>
  ) => {
    // Find the original user data
    const originalUser = usersData?.data?.find((user) => user.id === record.id);
    if (originalUser) {
      setSelectedPersonnel(originalUser);
      setIsViewPersonnelModalOpen(true);
    }
  };

  const filteredPersonnel = personnel.filter((record) => {
    // Search filter
    const matchesSearch = Object.values(record).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Role filter
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "doctor" && record.role === "doctor") ||
      (selectedFilter === "admin" && record.role === "admin");

    return matchesSearch && matchesFilter;
  });

  // Show error if API call fails
  React.useEffect(() => {
    if (error) {
      showError("Failed to load personnel data");
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and add button */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search personnel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className=""
        />
        <div className={`flex gap-4 items-center`}>
          <div className="min-w-[40%] sm:min-w-[160px]">
            <Dropdown
              options={[
                { label: "All", value: "all" },
                { label: "Doctor", value: "doctor" },
                { label: "Admin", value: "admin" },
              ]}
              label="Filter by:"
              placeholder="Filter by"
              onSelectionChange={handleSelectionChange}
              value={{
                label:
                  selectedFilter === "all"
                    ? "All"
                    : selectedFilter === "doctor"
                    ? "Doctor"
                    : "Admin",
                value: selectedFilter,
              }}
            />
          </div>

          <Button
            label="Add User"
            leftIcon={<Add />}
            className={`w-fit sm:w-[150px] truncate`}
            size="medium"
            onClick={() => setIsAddPersonnelModalOpen(true)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <Table
          data={filteredPersonnel}
          columns={columns}
          actions={actions}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredPersonnel.length / 10), // 10 items per page
            onChange: handlePageChange,
          }}
          emptyMessage="No personnel found"
          onRowClick={handleRowClick}
          className="shadow-sm h-full"
          loading={isLoading}
        />
      </div>

      {/* Add Personnel Modal */}
      <AddPersonnelModal
        isOpen={isAddPersonnelModalOpen}
        onClose={handleCloseModals}
        mode="add"
      />

      {/* Edit Personnel Modal */}
      <AddPersonnelModal
        isOpen={isEditPersonnelModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        personnel={
          selectedPersonnel
            ? {
                id: selectedPersonnel.id,
                fullName: selectedPersonnel.fullName,
                firstname: selectedPersonnel.firstName,
                lastname: selectedPersonnel.lastName,
                specialization: selectedPersonnel.specialization
                  ? `${selectedPersonnel.specialization}`
                  : "",
                prcLicenseNumber: selectedPersonnel.prcLicenseNumber
                  ? `${selectedPersonnel.prcLicenseNumber}`
                  : "",
                contactNumber: selectedPersonnel.phone,
                gender: selectedPersonnel.gender,
                role: selectedPersonnel.role as "admin" | "doctor",
                username: selectedPersonnel.username,
                email: selectedPersonnel.email,
                address: selectedPersonnel.address,
                dateOfBirth: selectedPersonnel.dateOfBirth,
              }
            : undefined
        }
        onSave={handleEditSave}
      />

      {/* View Personnel Modal */}
      <AddPersonnelModal
        isOpen={isViewPersonnelModalOpen}
        onClose={handleCloseModals}
        mode="view"
        personnel={
          selectedPersonnel
            ? {
                id: selectedPersonnel.id,
                fullName: selectedPersonnel.fullName,
                firstname: selectedPersonnel.firstName,
                lastname: selectedPersonnel.lastName,
                specialization: selectedPersonnel.specialization
                  ? `${selectedPersonnel.specialization}`
                  : "",
                prcLicenseNumber: selectedPersonnel.prcLicenseNumber
                  ? `${selectedPersonnel.prcLicenseNumber}`
                  : "",
                contactNumber: selectedPersonnel.phone,
                gender: selectedPersonnel.gender,
                role: selectedPersonnel.role as "admin" | "doctor",
                username: selectedPersonnel.username,
                email: selectedPersonnel.email,
                address: selectedPersonnel.address,
                dateOfBirth: selectedPersonnel.dateOfBirth,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedPersonnel(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Personnel"
        description={`Are you sure you want to delete the personnel "${selectedPersonnel?.fullName}"? `}
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
    </div>
  );
};

export default PersonnelTable;
