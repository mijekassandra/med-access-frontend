import React from "react";

//icons
import {
  Box,
  Calendar,
  DocumentText1,
  NotificationBing,
  Profile2User,
  UserSquare,
  Health,
} from "iconsax-react";

//components
import DashboardCard from "../../../global-components/DashboardCard";
import ContainerWrapper from "../../../components/ContainerWrapper";
import UserMedicalRecordTable from "../components/UserMedicalRecordTable";
import PersonnelDashboardTable from "../components/PersonnelDashboardTable";

const Dashboard: React.FC = () => {
  // const { user } = useAuth(); // Get current user and role

  const user = {
    role: "doctor",
  };

  const renderTable = () => {
    switch (user?.role) {
      case "doctor":
        return <UserMedicalRecordTable />;
      case "admin":
        return <PersonnelDashboardTable />;
      default:
        return <div>Access denied</div>;
    }
  };

  return (
    <ContainerWrapper className="space-y-8">
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Quick Stats Cards */}
        {user?.role === "doctor" ? (
          <>
            <DashboardCard
              title="Medical Records"
              value={1234}
              icon={<Profile2User />}
              variant="blue"
            />
            <DashboardCard
              title="Inventory"
              value={1234}
              icon={<Box />}
              variant="orange"
            />
            <DashboardCard
              title="Appointment Requests"
              value={1234}
              icon={<Calendar />}
              variant="purple"
            />
            <DashboardCard
              title="Health Education"
              value={1234}
              icon={<Health />}
              variant="green"
            />

            <DashboardCard
              title="Reports"
              value={1234}
              icon={<DocumentText1 />}
              variant="grey"
              className="md:col-span-2 lg:col-span-1"
            />
          </>
        ) : (
          <>
            <DashboardCard
              title="Users"
              value={1234}
              icon={<Profile2User />}
              variant="blue"
            />
            <DashboardCard
              title="Inventory"
              value={1234}
              icon={<Box />}
              variant="orange"
            />
            <DashboardCard
              title="Patient Records"
              value={1234}
              icon={<UserSquare />}
              variant="purple"
            />
            <DashboardCard
              title="Announcements"
              value={1234}
              icon={<NotificationBing />}
              variant="green"
            />

            <DashboardCard
              title="Reports"
              value={1234}
              icon={<DocumentText1 />}
              variant="grey"
              className="md:col-span-2 lg:col-span-1"
            />
          </>
        )}
      </div>

      {renderTable()}
    </ContainerWrapper>
  );
};

export default Dashboard;
