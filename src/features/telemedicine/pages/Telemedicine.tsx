import { useState } from "react";

// icons
import { SearchNormal1 } from "iconsax-react";

// components
import ContainerWrapper from "../../../components/ContainerWrapper";
import TelemedicineCard from "../components/TelemedicineCard";
import Inputs from "../../../global-components/Inputs";

// Mock data
const mockPendingRequests = [
  {
    id: "1",
    name: "Dela Cruz, Juan",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Sent a telemedicine request",
  },
  {
    id: "2",
    name: "Santos, Maria",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Requesting consultation",
  },
  {
    id: "3",
    name: "Garcia, Pedro",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Follow-up appointment needed",
  },
  {
    id: "4",
    name: "Lopez, Ana",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Initial consultation request",
  },
  {
    id: "5",
    name: "Martinez, Carlos",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Emergency consultation",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
  {
    id: "6",
    name: "Rodriguez, Sofia",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "pending" as const,
    description: "Routine check-up request",
  },
];

const mockTodayAppointments = [
  {
    id: "7",
    name: "Coliao, Gladys",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "2:30 PM",
  },
  {
    id: "8",
    name: "Fernandez, Roberto",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "3:00 PM",
  },
  {
    id: "9",
    name: "Torres, Elena",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "3:30 PM",
  },
  {
    id: "10",
    name: "Reyes, Miguel",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "4:00 PM",
  },
  {
    id: "11",
    name: "Cruz, Isabel",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "4:30 PM",
  },
  {
    id: "12",
    name: "Mendoza, Antonio",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "accepted" as const,
    time: "5:00 PM",
  },
];

const Telemedicine = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleAccept = (id: string) => {
    console.log("Accepting request:", id);
    // Add your accept logic here
  };

  const handleReject = (id: string) => {
    console.log("Rejecting request:", id);
    // Add your reject logic here
  };

  const handleView = (id: string) => {
    console.log("Viewing appointment:", id);
    // Add your view logic here
  };

  const filteredPendingRequests = mockPendingRequests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTodayAppointments = mockTodayAppointments.filter(
    (appointment) =>
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ContainerWrapper>
      <div className="w-full h-full flex flex-col">
        {/* Search Bar */}
        <div className="w-full mb-6">
          <Inputs
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchNormal1}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - Pending Requests */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Appointment Requests
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {filteredPendingRequests.length}
              </span>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto">
              {filteredPendingRequests.map((request) => (
                <TelemedicineCard
                  key={request.id}
                  {...request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
              {filteredPendingRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending requests found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Today's Appointments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">TODAY</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {filteredTodayAppointments.length}
              </span>
            </div>

            <div className="space-y-3 h-96 overflow-y-auto">
              {filteredTodayAppointments.map((appointment) => (
                <TelemedicineCard
                  key={appointment.id}
                  {...appointment}
                  onView={handleView}
                />
              ))}
              {filteredTodayAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default Telemedicine;
