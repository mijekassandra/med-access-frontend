import React, { useState } from "react";

//icons
import { Add, SearchNormal1 } from "iconsax-react";

// components
import Table, { type TableColumn } from "../../global-components/Table";
import ContainerWrapper from "../../components/ContainerWrapper";
import Inputs from "../../global-components/Inputs";
import Button from "../../global-components/Button";
import AddHealthReport from "./component/AddHealthReport";

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
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
        <div className="flex items-center justify-between gap-8">
          <Inputs
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />
          <Button
            label="Add Health Report"
            leftIcon={<Add />}
            className="w-[300px]"
            size="medium"
            onClick={() => setIsAddReportModalOpen(true)}
          />
        </div>

        {/* Table */}
        <Table
          data={filteredReports}
          columns={columns}
          searchable={false} // We're handling search manually
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredReports.length / 10), // 10 items per page
            onChange: handlePageChange,
          }}
          emptyMessage="No reports found"
          onRowClick={(record) => {
            console.log("Row clicked:", record);
          }}
          className="shadow-sm"
        />
      </div>
      <AddHealthReport
        isOpen={isAddReportModalOpen}
        onClose={() => setIsAddReportModalOpen(false)}
      />
    </ContainerWrapper>
  );
};

export default Reports;
