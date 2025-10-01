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
import AddPatientModal from "./AddPatientTable";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import Dropdown, { type Option } from "../../../global-components/Dropdown";

// Sample data type
interface Patient {
  id: string;
  username: string;
  address: string;
  email: string;
  contactNumber: string;
  dateRegistered: string;
}

// Sample data
const sampleData: Patient[] = [
  {
    id: "001",
    username: "johndoe",
    address: "123 Rizal St.",
    email: "johndoe@email.com",
    contactNumber: "09182345678",
    dateRegistered: "2024-06-01 10:05:23",
  },
  {
    id: "002",
    username: "janedoe",
    address: "456 Bonifacio Ave.",
    email: "janedoe@email.com",
    contactNumber: "09273456789",
    dateRegistered: "2024-06-02 14:30:15",
  },
  {
    id: "003",
    username: "mikebrown",
    address: "789 Mabini St.",
    email: "mikebrown@email.com",
    contactNumber: "09384567890",
    dateRegistered: "2024-06-03 09:15:42",
  },
  {
    id: "004",
    username: "sarahlee",
    address: "321 Quezon Blvd.",
    email: "sarahlee@email.com",
    contactNumber: "09495678901",
    dateRegistered: "2024-06-04 16:45:33",
  },
  {
    id: "005",
    username: "davidgarcia",
    address: "654 Luna St.",
    email: "davidgarcia@email.com",
    contactNumber: "09506789012",
    dateRegistered: "2024-06-05 11:20:18",
  },
];

const PatientsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState<Patient[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isViewPatientModalOpen, setIsViewPatientModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  // Define columns
  const columns: TableColumn<Patient>[] = [
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
        <span className="text-body-small-reg text-szBlack700">{value}</span>
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
  const actions: TableAction<Patient>[] = [
    {
      label: "Edit Patient",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedPatient(record);
        setIsEditPatientModalOpen(true);
      },
    },
    {
      label: "Delete Patient",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setSelectedPatient(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleEditSave = (updatedPatient: Patient) => {
    setPatients(
      patients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedPatient) {
      setPatients(patients.filter((p) => p.id !== selectedPatient.id));
      setIsDeleteConfirmationOpen(false);
      setSelectedPatient(null);
    }
  };

  const handleCloseModals = () => {
    setIsAddPatientModalOpen(false);
    setIsEditPatientModalOpen(false);
    setIsViewPatientModalOpen(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and add button */}
      <div className="flex flex-col lg:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className=""
        />
        <div className={`flex gap-4 items-center `}>
          <div className="min-w-[40%] sm:min-w-[160px]">
            <Dropdown
              options={[
                { label: "All", value: "all" },
                { label: "New", value: "new" },
                { label: "Returning", value: "returning" },
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
            onClick={() => setIsAddPatientModalOpen(true)}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredPatients}
        columns={columns}
        actions={actions}
        searchable={false} // We're handling search manually
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredPatients.length / 10), // 10 items per page
          onChange: handlePageChange,
        }}
        emptyMessage="No patients found"
        onRowClick={(record) => {
          setSelectedPatient(record);
          setIsViewPatientModalOpen(true);
        }}
        className="shadow-sm"
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
        patient={selectedPatient || undefined}
        onSave={handleEditSave}
      />

      {/* View Patient Modal */}
      <AddPatientModal
        isOpen={isViewPatientModalOpen}
        onClose={handleCloseModals}
        mode="view"
        patient={selectedPatient || undefined}
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
      />
    </div>
  );
};

export default PatientsTable;
