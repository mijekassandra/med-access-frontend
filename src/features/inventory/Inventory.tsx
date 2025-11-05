import React, { useState, useEffect, useMemo } from "react";

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
import AddMedicineModal from "./component/AddMedicineModal";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import SnackbarAlert from "../../global-components/SnackbarAlert";

// types
import type { MedicineInventory } from "./api/medicineInventoryApi";

// integration
import {
  useGetMedicinesQuery,
  useDeleteMedicineMutation,
} from "./api/medicineInventoryApi";

const Inventory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isEditMedicineModalOpen, setIsEditMedicineModalOpen] = useState(false);
  const [isViewMedicineModalOpen, setIsViewMedicineModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineInventory | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // Search debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  //sample only
  const user = {
    role: "admin",
  };

  //! rtk query -----------------------
  const {
    data: medicines,
    error: medicinesError,
    isLoading: isLoadingMedicines,
  } = useGetMedicinesQuery(debouncedSearchTerm || undefined);

  const [deleteMedicine, { isLoading: isDeleting }] =
    useDeleteMedicineMutation();

  useEffect(() => {
    console.log("selectedMedicine: ", selectedMedicine);
  }, [selectedMedicine]);

  //! Define columns -----------------------
  const columns: TableColumn<MedicineInventory>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "brand",
      header: "Brand",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "dosage",
      header: "Dosage",
      width: "120px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      width: "100px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
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
      key: "expiration_date",
      header: "Expiry Date",
      width: "140px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">
          {value
            ? new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
  ];

  //! Define actions -----------------------
  const actions: TableAction<MedicineInventory>[] = [
    {
      label: "Edit Medicine",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedMedicine(record);
        setIsEditMedicineModalOpen(true);
      },
    },
    {
      label: "Delete Medicine",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setSelectedMedicine(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: (record) => record._id === "1",
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

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  //? Edit save -----------------------
  const handleEditSave = (updatedMedicine: MedicineInventory) => {
    // Edit is handled in the modal component
    console.log("Medicine updated:", updatedMedicine);
  };

  //? Delete confirm -----------------------
  const handleDeleteConfirm = async () => {
    if (selectedMedicine) {
      try {
        await deleteMedicine(selectedMedicine._id).unwrap();
        setIsDeleteConfirmationOpen(false);
        setSelectedMedicine(null);
        setSnackbarMessage("Medicine deleted successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);
      } catch (error: any) {
        console.error("Failed to delete medicine:", error);
        const errorMessage =
          error?.data?.message ||
          "Failed to delete medicine. Please try again.";
        setSnackbarMessage(errorMessage);
        setSnackbarType("error");
        setShowSnackbar(true);
      }
    }
  };

  //! Handle API errors -----------------------
  useEffect(() => {
    if (medicinesError) {
      const errorMessage =
        (medicinesError as any)?.data?.message ||
        "Failed to load medicines. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [medicinesError]);

  //! Close modals -----------------------
  const handleCloseModals = () => {
    setIsAddMedicineModalOpen(false);
    setIsEditMedicineModalOpen(false);
    setIsViewMedicineModalOpen(false);
    setSelectedMedicine(null);
  };

  //! Close snackbar -----------------------
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  //! Filter medicines based on search term -----------------------
  // Note: Search is now handled by the backend via query parameter
  const filteredMedicines = useMemo(() => {
    return medicines?.data || [];
  }, [medicines]);

  //! Pagination logic -----------------------
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex);

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 gap-6">
        {/* Header with search and add button */}
        <div className="flex flex-col lg:flex-row items-end md:items-end justify-between gap-3 md:gap-6">
          <Inputs
            type="text"
            placeholder="Search medicines by name, dosage, batch no., etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />
          <div className="flex flex-col lg:flex-row items-end justify-between gap-3 md:gap-6">
            {/* {user.role === "admin" && (
              <div className="min-w-[40%] sm:min-w-[160px]">
                <Dropdown
                  options={[
                    { label: "All", value: "all" },
                    { label: "Medicine", value: "medicine" },
                    { label: "Equipment", value: "equipment" },
                  ]}
                  label="Filter by:"
                  placeholder="Filter by"
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            )} */}

            <Button
              label="Add Medicine"
              leftIcon={<Add />}
              className={`w-full sm:w-[200px] truncate ${
                user.role === "admin" ? "w-[60%]" : "w-[200px]"
              }`}
              size="medium"
              onClick={() => setIsAddMedicineModalOpen(true)}
            />
          </div>
        </div>

        {/* Table */}

        <Table
          data={paginatedMedicines}
          columns={columns}
          actions={actions}
          searchable={false} // Search is handled by backend
          pagination={{
            currentPage,
            totalPages: totalPages || 1, // Ensure at least 1 page
            onChange: handlePageChange,
          }}
          emptyMessage={
            debouncedSearchTerm
              ? `No medicines found matching "${debouncedSearchTerm}"`
              : "No medicines found"
          }
          onRowClick={(record) => {
            setSelectedMedicine(record);
            setIsViewMedicineModalOpen(true);
          }}
          className="shadow-sm"
          loading={isLoadingMedicines}
        />
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={handleCloseModals}
        mode="add"
      />

      {/* Edit Medicine Modal */}
      <AddMedicineModal
        isOpen={isEditMedicineModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        medicine={selectedMedicine || undefined}
        onSave={handleEditSave}
      />

      {/* View Medicine Modal */}
      <AddMedicineModal
        isOpen={isViewMedicineModalOpen}
        onClose={handleCloseModals}
        mode="view"
        medicine={selectedMedicine || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedMedicine(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Medicine"
        description={`Are you sure you want to delete the medicine "${selectedMedicine?.name}"? 
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

export default Inventory;
