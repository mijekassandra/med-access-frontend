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
import AddClientModal from "./AddClientModal";
import Dropdown, { type Option } from "../../../global-components/Dropdown";

// Sample data type
interface Client {
  id: string;
  username: string;
  address: string;
  email: string;
  contactNumber: string;
  dateRegistered: string;
}

// Sample data
const sampleData: Client[] = [
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

const ClientsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  //sample only
  const user = {
    role: "admin",
  };

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  // Define columns
  const columns: TableColumn<Client>[] = [
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
  const actions: TableAction<Client>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (record) => {
        console.log("View details for:", record);
        alert(`Viewing details for ID: ${record.id}`);
      },
    },
    {
      label: "Edit Client",
      icon: <Edit size={16} />,
      onClick: (record) => {
        console.log("Edit client:", record);
        alert(`Editing client for ID: ${record.id}`);
      },
    },
    {
      label: "Delete Client",
      icon: <Trash size={16} />,
      onClick: (record) => {
        console.log("Delete client:", record);
        if (
          confirm(
            `Are you sure you want to delete the client with ID: ${record.id}?`
          )
        ) {
          setClients(clients.filter((c) => c.id !== record.id));
        }
      },
      disabled: (record) => record.id === "001", // Disable for first record as example
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const filteredClients = clients.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header with title, search and add button */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 md:gap-6">
        <Inputs
          type="text"
          placeholder="Search clients..."
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
                  { label: "New", value: "new" },
                  { label: "Returning", value: "returning" },
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
            onClick={() => setIsAddClientModalOpen(true)}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredClients}
        columns={columns}
        actions={actions}
        searchable={false} // We're handling search manually
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredClients.length / 10), // 10 items per page
          onChange: handlePageChange,
        }}
        emptyMessage="No clients found"
        onRowClick={(record) => {
          console.log("Row clicked:", record);
        }}
        className="shadow-sm"
      />

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
      />
    </div>
  );
};

export default ClientsTable;
