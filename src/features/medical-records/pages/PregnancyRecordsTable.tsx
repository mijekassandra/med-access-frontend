import React, { useState } from "react";

//icons
import { Edit, Trash, Eye } from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../../global-components/Table";
import Chip from "../../../global-components/Chip";
import Inputs from "../../../global-components/Inputs";
import Dropdown, { type Option } from "../../../global-components/Dropdown";

// Sample data type
interface PregnancyRecord {
  id: string;
  startDate: string;
  weeksOfPregnancy: number;
  milestoneName: string;
  status: "ongoing" | "completed" | "pending";
}

// Sample data
const sampleData: PregnancyRecord[] = [
  {
    id: "001",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
  },
  {
    id: "002",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
  },
  {
    id: "003",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
  },
  {
    id: "004",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
  },
  {
    id: "005",
    startDate: "2024-03-15",
    weeksOfPregnancy: 16,
    milestoneName: "Ultrasound",
    status: "ongoing",
  },
  {
    id: "006",
    startDate: "2024-02-10",
    weeksOfPregnancy: 12,
    milestoneName: "First Trimester Screening",
    status: "completed",
  },
  {
    id: "007",
    startDate: "2024-01-20",
    weeksOfPregnancy: 8,
    milestoneName: "Initial Consultation",
    status: "completed",
  },
];

const PregnancyRecordsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<PregnancyRecord[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");

  //sample only
  const user = {
    role: "admin",
  };

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  // Define columns
  const columns: TableColumn<PregnancyRecord>[] = [
    {
      key: "id",
      header: "ID",
      width: "100px",
      sortable: true,
    },
    {
      key: "startDate",
      header: "Start Date",
      width: "140px",
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
    {
      key: "weeksOfPregnancy",
      header: "Weeks of Pregnancy",
      width: "120px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "milestoneName",
      header: "Milestone Name",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      width: "140px",
      sortable: true,
      render: (value) => (
        <Chip
          label={value}
          type="colored"
          color={
            value === "ongoing"
              ? "yellow"
              : value === "completed"
              ? "green"
              : "gray"
          }
        />
      ),
    },
  ];

  // Define actions
  const actions: TableAction<PregnancyRecord>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        console.log("View details for:", record);
        alert(`Viewing details for Pregnancy Record ID: ${record.id}`);
      },
    },
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        console.log("Edit record:", record);
        alert(`Editing record for Pregnancy Record ID: ${record.id}`);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete record:", record);
        if (
          confirm(
            `Are you sure you want to delete the pregnancy record with ID: ${record.id}?`
          )
        ) {
          setRecords(records.filter((r) => r.id !== record.id));
        }
      },
      disabled: (record) => record.status === "completed", // Disable for completed records
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
          placeholder="Search pregnancy records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                  { label: "Ongoing", value: "ongoing" },
                  { label: "Completed", value: "completed" },
                  { label: "Pending", value: "pending" },
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
        emptyMessage="No pregnancy records found"
        onRowClick={(record) => {
          console.log("Row clicked:", record);
        }}
        className="shadow-sm"
      />
    </div>
  );
};

export default PregnancyRecordsTable;
