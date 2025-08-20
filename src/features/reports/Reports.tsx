import React, { useState } from "react";

//icons
import { Add, SearchNormal1, Edit, Trash } from "iconsax-react";

// components
import Table, {
  type TableColumn,
  type TableAction,
} from "../../global-components/Table";
import ContainerWrapper from "../../components/ContainerWrapper";
import Inputs from "../../global-components/Inputs";
import Button from "../../global-components/Button";
import AddHealthReport from "./component/AddHealthReport";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Dropdown, { type Option } from "../../global-components/Dropdown";

// Sample data type
interface HealthReport {
  id: string;
  title: string;
  type: string;
  content: string;
  date: string;
}

// Sample data
const sampleData: HealthReport[] = [
  {
    id: "001",
    title: "Luzbanson dengue cases",
    type: "Morbidity",
    content: "30 Flu Cases",
    date: "2024-06-10",
  },
  {
    id: "002",
    title: "Community vaccination report",
    type: "Immunization",
    content: "150 Vaccinated",
    date: "2024-06-12",
  },
  {
    id: "003",
    title: "Maternal health statistics",
    type: "Maternal Health",
    content: "25 Prenatal Visits",
    date: "2024-06-15",
  },
  {
    id: "004",
    title: "Pediatric consultation data",
    type: "Pediatric",
    content: "45 Child Checkups",
    date: "2024-06-18",
  },
  {
    id: "005",
    title: "Emergency room statistics",
    type: "Emergency",
    content: "12 Emergency Cases",
    date: "2024-06-20",
  },
];

const Reports: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<HealthReport[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false);
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(
    null
  );

  //sample only
  const user = {
    role: "doctor",
  };

  // Define columns
  const columns: TableColumn<HealthReport>[] = [
    {
      key: "id",
      header: "Report ID",
      width: "130px",
      sortable: true,
    },
    {
      key: "title",
      header: "Title of Report",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700 font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type of Report",
      width: "180px",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "content",
      header: "Data/Content",
      sortable: true,
      render: (value) => (
        <span className="text-body-small-reg text-szBlack700">{value}</span>
      ),
    },
    {
      key: "date",
      header: "Date of Report",
      width: "150px",
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
  ];

  // Define actions
  const actions: TableAction<HealthReport>[] = [
    {
      label: "Edit Report",
      icon: <Edit size={16} />,
      onClick: (record) => {
        setSelectedReport(record);
        setIsEditReportModalOpen(true);
      },
    },
    {
      label: "Delete Report",
      icon: <Trash size={16} />,
      onClick: (record) => {
        setSelectedReport(record);
        setIsDeleteConfirmationOpen(true);
      },
      disabled: (record) => record.id === "001",
    },
  ];

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Filter:", selected);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleEditSave = (updatedReport: HealthReport) => {
    setReports(
      reports.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedReport) {
      setReports(reports.filter((r) => r.id !== selectedReport.id));
      setIsDeleteConfirmationOpen(false);
      setSelectedReport(null);
    }
  };

  const handleCloseModals = () => {
    setIsAddReportModalOpen(false);
    setIsEditReportModalOpen(false);
    setIsViewReportModalOpen(false);
    setSelectedReport(null);
  };

  const filteredReports = reports.filter((report) =>
    Object.values(report).some((value) =>
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
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
            className=""
          />

          {user.role === "admin" ? (
            <div
              className={`flex gap-4 items-center justify-end w-full sm:w-fit`}
            >
              <Button
                label="Print Report"
                className={`w-[45%] sm:w-[180px] truncate ${
                  user.role === "admin" ? "w-[60%]" : "w-[180px]"
                }`}
                size="medium"
              />
              <div className="min-w-[55%] sm:min-w-[160px]">
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
            </div>
          ) : (
            <Button
              label="Add Health Report"
              leftIcon={<Add />}
              className="w-fit sm:w-[280px] truncate"
              size="medium"
              onClick={() => setIsAddReportModalOpen(true)}
            />
          )}
        </div>

        {/* Table */}
        <Table
          data={filteredReports}
          columns={columns}
          actions={actions}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredReports.length / 10), // 10 items per page
            onChange: handlePageChange,
          }}
          emptyMessage="No reports found"
          onRowClick={(record) => {
            setSelectedReport(record);
            setIsViewReportModalOpen(true);
          }}
          className="shadow-sm"
        />
      </div>

      {/* Add Health Report Modal */}
      <AddHealthReport
        isOpen={isAddReportModalOpen}
        onClose={handleCloseModals}
        mode="add"
      />

      {/* Edit Health Report Modal */}
      <AddHealthReport
        isOpen={isEditReportModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        report={selectedReport || undefined}
        onSave={handleEditSave}
      />

      {/* View Health Report Modal */}
      <AddHealthReport
        isOpen={isViewReportModalOpen}
        onClose={handleCloseModals}
        mode="view"
        report={selectedReport || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedReport(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Health Report"
        description={`Are you sure you want to delete the report "${selectedReport?.title}"? `}
      />
    </ContainerWrapper>
  );
};

export default Reports;
