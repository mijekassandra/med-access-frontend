import React from "react";

//icons
import { Box, Calendar, Profile2User } from "iconsax-react";

//components
import DashboardCard from "../../../global-components/DashboardCard";
import ContainerWrapper from "../../../components/ContainerWrapper";

const Dashboard: React.FC = () => {
  return (
    <ContainerWrapper>
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <DashboardCard
          title="Appointment Requests"
          value={1234}
          icon={<Calendar />}
          variant="blue"
        />

        <DashboardCard
          title="Total Patients"
          value={1234}
          icon={<Profile2User />}
          variant="green"
        />
        <DashboardCard
          title="Total Available Medicines"
          value={1234}
          icon={<Box />}
          variant="orange"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 w-full">
              View Medical Records
            </h2>
            {/* <Input placeholder="Search" /> */}
          </div>
          <div className="p-6"></div>
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default Dashboard;
