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
import AddUserMedicalModal from "./AddUserMedicalModal";
import Divider from "../../../global-components/Divider";
import Dropdown, { type Option } from "../../../global-components/Dropdown";

// Sample data type
interface MedicalRecord {
  id: string;
  fullName: string;
  diagnosis: string;
  treatmentPlan: string;
  dateOfRecord: string;
}

// Sample data
const sampleData: MedicalRecord[] = [
  {
    id: "001",
    fullName: "Anna B. Garcia",
    diagnosis: "Acute Tonsillitis",
    treatmentPlan: "Antibiotics, rest",
    dateOfRecord: "2024-06-10 09:40:00",
  },
  {
    id: "002",
    fullName: "Maria Santos",
    diagnosis: "Hypertension",
    treatmentPlan: "Blood pressure medication",
    dateOfRecord: "2024-06-09 14:30:00",
  },
  {
    id: "003",
    fullName: "Juan Dela Cruz",
    diagnosis: "Diabetes Type 2",
    treatmentPlan: "Insulin therapy, diet control",
    dateOfRecord: "2024-06-08 11:15:00",
  },
  {
    id: "004",
    fullName: "Carmen Reyes",
    diagnosis: "Bronchitis",
    treatmentPlan: "Cough syrup, steam inhalation",
    dateOfRecord: "2024-06-07 16:45:00",
  },
  {
    id: "005",
    fullName: "Pedro Martinez",
    diagnosis: "Migraine",
    treatmentPlan: "Pain relievers, rest in dark room",
    dateOfRecord: "2024-06-06 10:20:00",
  },
  {
    id: "006",
    fullName: "Isabella Torres",
    diagnosis: "Urinary Tract Infection",
    treatmentPlan: "Antibiotics, increased water intake",
    dateOfRecord: "2024-06-05 13:55:00",
  },
];

const UserMedicalRecordTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [medicalRecords, setMedicalRecords] =
    useState<MedicalRecord[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  //sample only
  const user = {
    role: "admin",
  };

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

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
      key: "treatmentPlan",
      header: "Treatment Plan",
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
          <div>{value.split(" ")[0]}</div>
          <div className="text-xs text-szBlack500">{value.split(" ")[1]}</div>
        </div>
      ),
    },
  ];

  // Define actions
  const actions: TableAction<MedicalRecord>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        console.log("View details for:", record);
        alert(`Viewing details for ID: ${record.id}`);
      },
    },
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        console.log("Edit record:", record);
        alert(`Editing record for ID: ${record.id}`);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete record:", record);
        if (
          confirm(
            `Are you sure you want to delete the record for ID: ${record.id}?`
          )
        ) {
          setMedicalRecords(medicalRecords.filter((r) => r.id !== record.id));
        }
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const filteredRecords = medicalRecords.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with title, search and add button */}
      <div className="space-y-4">
        <div className="flex items-center gap-8">
          <h4 className="text-h4 font-semibold text-szBlack700">
            View Medical Records
          </h4>
          <Divider className="flex-1 h-full " />
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
          <Inputs
            type="text"
            placeholder="Search medical records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
            className=""
          />
          <div
            className={`flex gap-4 items-center ${
              user.role === "admin" ? "justify-between" : "justify-end"
            }`}
          >
            {user.role === "admin" && (
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
            )}

            <Button
              label="Add User"
              leftIcon={<Add />}
              className={`w-fit sm:w-[170px] truncate ${
                user.role === "admin" ? "w-[60%]" : "w-[180px]"
              }`}
              size="medium"
              onClick={() => setIsAddUserModalOpen(true)}
            />
          </div>
        </div>
        {/* <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-6">
          <Inputs
            type="text"
            placeholder="Search medical records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
            className=""
          />
          <Button
            label="Add User"
            leftIcon={<Add />}
            className="w-full sm:w-[200px]"
            size="medium"
            onClick={() => setIsAddUserModalOpen(true)}
          />
        </div> */}
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
          console.log("Row clicked:", record);
        }}
        className="shadow-sm"
      />

      <AddUserMedicalModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
};

export default UserMedicalRecordTable;
