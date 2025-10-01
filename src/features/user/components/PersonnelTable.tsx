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

// Sample data type
interface Personnel {
  id: string;
  fullName: string;
  specialization: string;
  prcLicenseNumber: string;
  contactNumber: string;
}

// Sample data
const sampleData: Personnel[] = [
  {
    id: "001",
    fullName: "Dr. John Smith",
    specialization: "Cardiology",
    prcLicenseNumber: "PRC123456",
    contactNumber: "09182345678",
  },
  {
    id: "002",
    fullName: "Dr. Maria Garcia",
    specialization: "Pediatrics",
    prcLicenseNumber: "PRC234567",
    contactNumber: "09273456789",
  },
  {
    id: "003",
    fullName: "Dr. Robert Johnson",
    specialization: "Orthopedics",
    prcLicenseNumber: "PRC345678",
    contactNumber: "09384567890",
  },
  {
    id: "004",
    fullName: "Dr. Sarah Lee",
    specialization: "Dermatology",
    prcLicenseNumber: "PRC456789",
    contactNumber: "09495678901",
  },
  {
    id: "005",
    fullName: "Dr. David Brown",
    specialization: "Neurology",
    prcLicenseNumber: "PRC567890",
    contactNumber: "09506789012",
  },
];

const PersonnelTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [personnel, setPersonnel] = useState<Personnel[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);
  const [isEditPersonnelModalOpen, setIsEditPersonnelModalOpen] =
    useState(false);
  const [isViewPersonnelModalOpen, setIsViewPersonnelModalOpen] =
    useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(
    null
  );

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  // Define columns
  const columns: TableColumn<Personnel>[] = [
    {
      key: "id",
      header: "ID",
      width: "80px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
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
      key: "contactNumber",
      header: "Contact No.",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
  ];

  // Define actions
  const actions: TableAction<Personnel>[] = [
    {
      label: "Edit Personnel",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedPersonnel(record);
        setIsEditPersonnelModalOpen(true);
      },
    },
    {
      label: "Delete Personnel",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setSelectedPersonnel(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleEditSave = (updatedPersonnel: Personnel) => {
    setPersonnel(
      personnel.map((p) =>
        p.id === updatedPersonnel.id ? updatedPersonnel : p
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedPersonnel) {
      setPersonnel(personnel.filter((p) => p.id !== selectedPersonnel.id));
      setIsDeleteConfirmationOpen(false);
      setSelectedPersonnel(null);
    }
  };

  const handleCloseModals = () => {
    setIsAddPersonnelModalOpen(false);
    setIsEditPersonnelModalOpen(false);
    setIsViewPersonnelModalOpen(false);
    setSelectedPersonnel(null);
  };

  const filteredPersonnel = personnel.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and add button */}
      <div className="flex flex-col lg:flex-row items-end md:items-center justify-between gap-3 md:gap-6 flex-shrink-0">
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
                { label: "Doctors", value: "doctors" },
                { label: "Nurses", value: "nurses" },
                { label: "Specialists", value: "specialists" },
              ]}
              label="Filter by:"
              placeholder="Filter by"
              onSelectionChange={handleSelectionChange}
            />
          </div>

          <Button
            label="Add User"
            leftIcon={<Add />}
            className={`w-fit sm:w-[170px] truncate`}
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
          onRowClick={(record) => {
            setSelectedPersonnel(record);
            setIsViewPersonnelModalOpen(true);
          }}
          className="shadow-sm h-full"
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
        personnel={selectedPersonnel || undefined}
        onSave={handleEditSave}
      />

      {/* View Personnel Modal */}
      <AddPersonnelModal
        isOpen={isViewPersonnelModalOpen}
        onClose={handleCloseModals}
        mode="view"
        personnel={selectedPersonnel || undefined}
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
      />
    </div>
  );
};

export default PersonnelTable;
