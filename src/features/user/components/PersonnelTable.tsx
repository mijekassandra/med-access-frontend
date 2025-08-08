import React, { useState } from "react";

//icons
import { Add, SearchNormal1, Edit, Trash, Eye } from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import AddPersonnelModal from "./AddPersonnelModal";

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
    fullName: "Dr. Maria A. Santos",
    specialization: "Pediatrics",
    prcLicenseNumber: "1234567A",
    contactNumber: "09182345678",
  },
  {
    id: "002",
    fullName: "Dr. Juan Carlos Reyes",
    specialization: "Cardiology",
    prcLicenseNumber: "2345678B",
    contactNumber: "09273456789",
  },
  {
    id: "003",
    fullName: "Dr. Ana Sofia Martinez",
    specialization: "Dermatology",
    prcLicenseNumber: "3456789C",
    contactNumber: "09384567890",
  },
  {
    id: "004",
    fullName: "Dr. Roberto Dela Cruz",
    specialization: "Orthopedics",
    prcLicenseNumber: "4567890D",
    contactNumber: "09495678901",
  },
  {
    id: "005",
    fullName: "Dr. Carmen Elena Torres",
    specialization: "Neurology",
    prcLicenseNumber: "5678901E",
    contactNumber: "09506789012",
  },
  {
    id: "006",
    fullName: "Dr. Miguel Angel Garcia",
    specialization: "Psychiatry",
    prcLicenseNumber: "6789012F",
    contactNumber: "09617890123",
  },
];

const PersonnelTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [personnel, setPersonnel] = useState<Personnel[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);

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
      header: "PRC license number",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "contactNumber",
      header: "Contact Number",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
  ];

  // Define actions
  const actions: TableAction<Personnel>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        console.log("View details for:", record);
        alert(`Viewing details for ID: ${record.id}`);
      },
    },
    {
      label: "Edit Personnel",
      icon: <Edit size={16} />,
      onClick: (record) => {
        console.log("Edit personnel:", record);
        alert(`Editing personnel for ID: ${record.id}`);
      },
    },
    {
      label: "Delete Personnel",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete personnel:", record);
        if (
          confirm(
            `Are you sure you want to delete the personnel with ID: ${record.id}?`
          )
        ) {
          setPersonnel(personnel.filter((p) => p.id !== record.id));
        }
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const filteredPersonnel = personnel.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with title, search and add button */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 sm:gap-6">
        <Inputs
          type="text"
          placeholder="Search personnel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className=""
        />
        <Button
          label="Add User"
          leftIcon={<Add />}
          className="w-fit sm:w-[170px] truncate"
          size="medium"
          onClick={() => setIsAddPersonnelModalOpen(true)}
        />
      </div>

      {/* Table */}
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
          console.log("Row clicked:", record);
        }}
        className="shadow-sm"
      />

      <AddPersonnelModal
        isOpen={isAddPersonnelModalOpen}
        onClose={() => setIsAddPersonnelModalOpen(false)}
      />
    </div>
  );
};

export default PersonnelTable;
