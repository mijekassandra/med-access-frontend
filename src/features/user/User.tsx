import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ContainerWrapper from "../../components/ContainerWrapper";
import Tabs from "../../global-components/Tabs";
import PersonnelTable from "./components/PersonnelTable";
import ClientsTable from "./components/ClientsTable";

const User: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab options
  const tabOptions = [
    { label: "Clients", value: "clients" },
    { label: "Personnel", value: "personnel" },
  ];

  // Determine active tab based on current route
  const getActiveTabIndex = () => {
    if (location.pathname.includes("clients")) {
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
      <div className="w-full space-y-8">
        {/* Tabs */}
        <div className="w-full">
          <Tabs
            options={tabOptions}
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Tab Content */}
        <Routes>
          <Route path="/" element={<ClientsTable />} />
          <Route path="/personnels" element={<PersonnelTable />} />
        </Routes>
      </div>
    </ContainerWrapper>
  );
};

export default User;
