import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ContainerWrapper from "../../components/ContainerWrapper";
import Tabs from "../../global-components/Tabs";
import PregnancyRecords from "./pages/PregnancyRecordsTable";
import MedicalRecordTable from "./pages/MedicalRecordTable";

const MedicalRecordsIndex: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab options
  const tabOptions = [
    { label: "Medical Records", value: "medical-records" },
    { label: "Pregnancy Records", value: "pregnancy-records" },
  ];

  // Determine active tab based on current route
  const getActiveTabIndex = () => {
    if (location.pathname.includes("pregnancy-records")) {
      return 1;
    }
    return 0; // Default to medical records
  };

  const [activeTabIndex, setActiveTabIndex] = useState(getActiveTabIndex());

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    if (index === 0) {
      navigate("/medical-records");
    } else {
      navigate("/medical-records/pregnancy-records");
    }
  };

  return (
    <ContainerWrapper>
      <div className="w-full flex-1 flex flex-col space-y-8">
        {/* Tabs */}
        <div className="w-full flex-shrink-0">
          <Tabs
            options={tabOptions}
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MedicalRecordTable />} />
            <Route path="/pregnancy-records" element={<PregnancyRecords />} />
          </Routes>
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default MedicalRecordsIndex;
