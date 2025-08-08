import React, { useState } from "react";

//icons
import { Add, SearchNormal1 } from "iconsax-react";

// components
import Table, { type TableColumn } from "../../global-components/Table";
import ContainerWrapper from "../../components/ContainerWrapper";
import Inputs from "../../global-components/Inputs";
import Button from "../../global-components/Button";
import AddMedicineModal from "./component/AddMedicineModal";
import Dropdown, { type Option } from "../../global-components/Dropdown";

// Sample data type
interface Medicine {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  description: string;
  expiryDate: string;
  batchNo: string;
}

// Sample data
const sampleData: Medicine[] = [
  {
    id: "001",
    name: "Mefenamic",
    dosage: "500mg",
    stock: 100,
    description: "Pain Reliever",
    expiryDate: "2025-06-30",
    batchNo: "B2024A",
  },
  {
    id: "002",
    name: "Paracetamol",
    dosage: "250mg",
    stock: 150,
    description: "Fever Reducer",
    expiryDate: "2025-08-15",
    batchNo: "B2024B",
  },
  {
    id: "003",
    name: "Amoxicillin",
    dosage: "500mg",
    stock: 75,
    description: "Antibiotic",
    expiryDate: "2025-04-20",
    batchNo: "B2024C",
  },
  {
    id: "004",
    name: "Ibuprofen",
    dosage: "400mg",
    stock: 200,
    description: "Anti-inflammatory",
    expiryDate: "2025-07-10",
    batchNo: "B2024D",
  },
  {
    id: "005",
    name: "Omeprazole",
    dosage: "20mg",
    stock: 50,
    description: "Acid Reducer",
    expiryDate: "2025-05-25",
    batchNo: "B2024E",
  },
];

const Inventory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [medicines, setMedicines] = useState<Medicine[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);

  //sample only
  const user = {
    role: "admin",
  };

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  // Define columns
  const columns: TableColumn<Medicine>[] = [
    {
      key: "id",
      header: "Med ID",
      width: "100px",
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
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
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
      key: "batchNo",
      header: "Batch no.",
      width: "120px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  //   const handleAddMedicine = () => {
  //     console.log("Add medicine clicked");
  //     alert("Add Medicine functionality would be implemented here");
  //   };

  const filteredMedicines = medicines.filter((medicine) =>
    Object.values(medicine).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 gap-6">
        {/* Header with search and add button */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
          <Inputs
            type="text"
            placeholder="Search medicines..."
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
                    { label: "Medicine", value: "medicine" },
                    { label: "Equipment", value: "equipment" },
                  ]}
                  label="Filter by:"
                  placeholder="Filter by"
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            )}

            <Button
              label="Add Medicine"
              leftIcon={<Add />}
              // className="w-[60%] sm:w-[180px] truncate"
              className={`w-[60%] sm:w-[180px] truncate ${
                user.role === "admin" ? "w-[60%]" : "w-[180px]"
              }`}
              size="medium"
              onClick={() => setIsAddMedicineModalOpen(true)}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          data={filteredMedicines}
          columns={columns}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredMedicines.length / 10), // 10 items per page
            onChange: handlePageChange,
          }}
          emptyMessage="No medicines found"
          onRowClick={(record) => {
            console.log("Row clicked:", record);
          }}
          className="shadow-sm"
        />
      </div>
      <AddMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={() => setIsAddMedicineModalOpen(false)}
      />
    </ContainerWrapper>
  );
};

export default Inventory;
