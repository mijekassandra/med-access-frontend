import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ContainerWrapper from "../../components/ContainerWrapper";
import Tabs from "../../global-components/Tabs";
import PersonnelTable from "./components/PersonnelTable";
import PatientsTable from "./components/PatientsTable";

const User: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab options
  const tabOptions = [
    { label: "Patients", value: "patients" },
    { label: "Personnel", value: "personnel" },
  ];

  // Determine active tab based on current route
  const getActiveTabIndex = () => {
    if (location.pathname.includes("patients")) {
      return 1;
    }
    return 0; // Default to personnel
  };

  const [activeTabIndex, setActiveTabIndex] = useState(getActiveTabIndex());

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    if (index === 0) {
      navigate("/users/");
    } else {
      navigate("/users/personnels");
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
            <Route path="/" element={<PatientsTable />} />
            <Route path="/personnels" element={<PersonnelTable />} />
          </Routes>
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default User;
