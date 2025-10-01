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
import AddUserMedicalModal from "../../medical-records/components/AddUserMedicalModal";
import DeleteConfirmation from "../../../components/DeleteConfirmation";

// Sample data type
interface MedicalRecord {
  id: string;
  fullName: string;
  diagnosis: string;
  dateOfRecord: string;
  treatmentPlan: string;
}

// Sample data
const sampleData: MedicalRecord[] = [
  {
    id: "001",
    fullName: "John Doe",
    diagnosis: "Hypertension",
    dateOfRecord: "2024-06-01T10:30",
    treatmentPlan: "Prescribed medication and lifestyle changes",
  },
  {
    id: "002",
    fullName: "Jane Smith",
    diagnosis: "Diabetes Type 2",
    dateOfRecord: "2024-06-02T14:15",
    treatmentPlan: "Insulin therapy and diet management",
  },
  {
    id: "003",
    fullName: "Mike Johnson",
    diagnosis: "Asthma",
    dateOfRecord: "2024-06-03T09:45",
    treatmentPlan: "Inhaler prescription and breathing exercises",
  },
  {
    id: "004",
    fullName: "Sarah Wilson",
    diagnosis: "Migraine",
    dateOfRecord: "2024-06-04T16:20",
    treatmentPlan: "Pain management and trigger avoidance",
  },
  {
    id: "005",
    fullName: "David Brown",
    diagnosis: "Arthritis",
    dateOfRecord: "2024-06-05T11:10",
    treatmentPlan: "Physical therapy and anti-inflammatory medication",
  },
];

const UserMedicalRecordTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [medicalRecords, setMedicalRecords] =
    useState<MedicalRecord[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] =
    useState<MedicalRecord | null>(null);

  // Define columns
  const columns: TableColumn<MedicalRecord>[] = [
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
      key: "diagnosis",
      header: "Diagnosis",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "dateOfRecord",
      header: "Date of Record",
      width: "160px",
      sortable: true,
      render: (value) => (
        <div className="text-body-small-reg text-szBlack700">
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-xs text-szBlack500">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "treatmentPlan",
      header: "Treatment Plan",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
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
        setSelectedMedicalRecord(record);
        setIsEditUserModalOpen(true);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setSelectedMedicalRecord(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleEditSave = (updatedRecord: MedicalRecord) => {
    setMedicalRecords(
      medicalRecords.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedMedicalRecord) {
      setMedicalRecords(
        medicalRecords.filter((r) => r.id !== selectedMedicalRecord.id)
      );
      setIsDeleteConfirmationOpen(false);
      setSelectedMedicalRecord(null);
    }
  };

  const handleCloseModals = () => {
    setIsAddUserModalOpen(false);
    setIsEditUserModalOpen(false);
    setIsViewUserModalOpen(false);
    setSelectedMedicalRecord(null);
  };

  const filteredRecords = medicalRecords.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and add button */}
      <div className="flex flex-col lg:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search medical records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className=""
        />
        <Button
          label="Add Patient"
          leftIcon={<Add />}
          className="w-full sm:w-[220px]"
          size="medium"
          onClick={() => setIsAddUserModalOpen(true)}
        />
      </div>

      {/* Table */}
      <Table
        data={filteredRecords}
        columns={columns}
        actions={actions}
        searchable={false} // We're handling search manually
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredRecords.length / 10), // 10 items per page
          onChange: handlePageChange,
        }}
        emptyMessage="No medical records found"
        onRowClick={(record) => {
          setSelectedMedicalRecord(record);
          setIsViewUserModalOpen(true);
        }}
        className="shadow-sm"
      />

      {/* Add User Medical Modal */}
      <AddUserMedicalModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseModals}
        mode="add"
      />

      {/* Edit User Medical Modal */}
      <AddUserMedicalModal
        isOpen={isEditUserModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        medicalRecord={selectedMedicalRecord || undefined}
        onSave={handleEditSave}
      />

      {/* View User Medical Modal */}
      <AddUserMedicalModal
        isOpen={isViewUserModalOpen}
        onClose={handleCloseModals}
        mode="view"
        medicalRecord={selectedMedicalRecord || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedMedicalRecord(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Medical Record"
        description={`Are you sure you want to delete the medical record for "${selectedMedicalRecord?.fullName}"? `}
      />
    </div>
  );
};

export default UserMedicalRecordTable;
