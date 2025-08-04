import React from "react";

//icons
import { Calendar, Profile2User } from "iconsax-react";

//components
import DashboardCard from "../../../global-components/DashboardCard";
import Input from "../../../global-components/Inputs";
import Table from "../../../global-components/Table";

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
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
      </div>
    </div>
  );
};

export default Dashboard;
