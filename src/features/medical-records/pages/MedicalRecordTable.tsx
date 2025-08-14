import React, { useState } from "react";

//icons
import { Edit, Trash, Eye, SearchNormal1 } from "iconsax-react";

//components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";

// Sample data type
interface MedicalRecord {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  treatmentPlan: string;
  dateOfRecord: string;
}

// Sample data
const sampleData: MedicalRecord[] = [
  {
    patientId: "001",
    doctorId: "002",
    diagnosis: "Acute Tonsillitis",
    treatmentPlan: "Antibiotics, rest",
    dateOfRecord: "2024-06-10 09:40:00",
  },
  {
    patientId: "002",
    doctorId: "001",
    diagnosis: "Hypertension",
    treatmentPlan: "ACE inhibitors, lifestyle changes",
    dateOfRecord: "2024-06-09 14:30:00",
  },
  {
    patientId: "003",
    doctorId: "003",
    diagnosis: "Diabetes Type 2",
    treatmentPlan: "Metformin, diet control",
    dateOfRecord: "2024-06-08 11:15:00",
  },
  {
    patientId: "004",
    doctorId: "002",
    diagnosis: "Migraine",
    treatmentPlan: "Pain relievers, stress management ",
    dateOfRecord: "2024-06-07 16:45:00",
  },
  {
    patientId: "005",
    doctorId: "001",
    diagnosis: "Asthma",
    treatmentPlan: "Inhalers, avoid triggers",
    dateOfRecord: "2024-06-06 10:20:00",
  },
  {
    patientId: "005",
    doctorId: "001",
    diagnosis: "Asthma",
    treatmentPlan: "Inhalers, avoid triggers",
    dateOfRecord: "2024-06-06 10:20:00",
  },
  {
    patientId: "005",
    doctorId: "001",
    diagnosis: "Asthma",
    treatmentPlan: "Inhalers, avoid triggers",
    dateOfRecord: "2024-06-06 10:20:00",
  },
];

const MedicalRecordTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<MedicalRecord[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");

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
      key: "patientId",
      header: "Patient ID",
      width: "120px",
      sortable: true,
    },
    {
      key: "doctorId",
      header: "Doctor ID",
      width: "120px",
      sortable: true,
    },
    {
      key: "diagnosis",
      header: "Diagnosis",
      sortable: true,
    },
    {
      key: "treatmentPlan",
      header: "Treatment Plan",
      sortable: true,
    },
    {
      key: "dateOfRecord",
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
  ];

  // Define actions
  const actions: TableAction<MedicalRecord>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        console.log("View details for:", record);
        alert(`Viewing details for Patient ID: ${record.patientId}`);
      },
    },
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        console.log("Edit record:", record);
        alert(`Editing record for Patient ID: ${record.patientId}`);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete record:", record);
        if (
          confirm(
            `Are you sure you want to delete the record for Patient ID: ${record.patientId}?`
          )
        ) {
          setRecords(records.filter((r) => r.patientId !== record.patientId));
        }
      },
      disabled: (record) => record.patientId === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with search and filter */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search medical records..."
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
        </div>
      </div>

      {/* Table */}
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
        emptyMessage="No medical records found"
        onRowClick={(record) => {
          console.log("Row clicked:", record);
        }}
        className="shadow-sm"
      />
    </div>
  );
};

export default MedicalRecordTable;
