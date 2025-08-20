import React, { useMemo, useState } from "react";

// icons
import { SearchNormal1, Edit, Trash } from "iconsax-react";

// components
import ContainerWrapper from "../../components/ContainerWrapper";
import Inputs from "../../global-components/Inputs";
import Dropdown, { type Option } from "../../global-components/Dropdown";
import Table, {
  type TableColumn,
  type TableAction,
} from "../../global-components/Table";

interface PatientRecord {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date string
  address: string;
  contactNo: string;
}

const samplePatients: PatientRecord[] = [
  {
    id: "001",
    name: "Dela Cruz, Juan",
    dateOfBirth: "1990-01-15",
    address: "123 Rizal St.",
    contactNo: "09171234567",
  },
  {
    id: "002",
    name: "Santos, Maria",
    dateOfBirth: "1988-03-22",
    address: "456 Mabini Ave.",
    contactNo: "09181234567",
  },
  {
    id: "003",
    name: "Garcia, Pedro",
    dateOfBirth: "1992-07-09",
    address: "789 Bonifacio Rd.",
    contactNo: "09191234567",
  },
  {
    id: "004",
    name: "Reyes, Ana",
    dateOfBirth: "1995-11-30",
    address: "101 Luna St.",
    contactNo: "09201234567",
  },
  {
    id: "005",
    name: "Dela Cruz, Juan",
    dateOfBirth: "1990-01-15",
    address: "123 Rizal St.",
    contactNo: "09171234567",
  },
  {
    id: "006",
    name: "Dela Cruz, Juan",
    dateOfBirth: "1990-01-15",
    address: "123 Rizal St.",
    contactNo: "09171234567",
  },
];

const PatientRecords: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState<PatientRecord[]>(samplePatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<Option | null>(null);

  const columns: TableColumn<PatientRecord>[] = [
    {
      key: "id",
      header: "ID",
      width: "90px",
      sortable: true,
    },
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
      key: "dateOfBirth",
      header: "Date of Birth",
      width: "160px",
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
      key: "address",
      header: "Address",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "contactNo",
      header: "Contact No.",
      width: "150px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
  ];

  const actions: TableAction<PatientRecord>[] = [
    {
      label: "Edit Record",
      icon: <Edit size={16} />,
      onClick: (record) => {
        console.log("Edit record:", record);
        alert(`Editing patient with ID: ${record.id}`);
      },
    },
    {
      label: "Delete Record",
      icon: <Trash size={16} />,
      onClick: (record) => {
        if (confirm(`Delete patient with ID: ${record.id}?`)) {
          setPatients((prev) => prev.filter((p) => p.id !== record.id));
        }
      },
      disabled: (record) => record.id === "001",
    },
  ];

  const handleSelectionChange = (selected: Option | Option[]) => {
    const picked = Array.isArray(selected) ? selected[0] : selected;
    setSelectedFilter(picked ?? null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPatients = useMemo(() => {
    const base = patients.filter((patient) =>
      Object.values(patient).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (!selectedFilter || selectedFilter.value === "all") return base;

    // Placeholder for future filtering logic
    return base;
  }, [patients, searchTerm, selectedFilter]);

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
          <Inputs
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />

          <div className="min-w-[55%] sm:min-w-[160px]">
            <Dropdown
              options={[
                { label: "All", value: "all" },
                { label: "New", value: "new" },
                { label: "Returning", value: "returning" },
              ]}
              label="Filter by:"
              placeholder={selectedFilter?.label ?? "All"}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        <Table
          data={filteredPatients}
          columns={columns}
          actions={actions}
          searchable={false}
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredPatients.length / 10) || 1,
            onChange: handlePageChange,
          }}
          emptyMessage="No patient records found"
          onRowClick={(record) => {
            console.log("Row clicked:", record);
          }}
          className="shadow-sm"
        />
      </div>
    </ContainerWrapper>
  );
};

export default PatientRecords;
