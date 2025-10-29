import { Calendar } from "iconsax-react";
import Avatar from "../../../global-components/Avatar";

//utils
import { formatDateForDisplay } from "../../../utils/dateUtils";

interface Appointment {
  id: string;
  name: string;
  avatar?: string;
  status: "confirmed" | "pending" | "cancelled";
  date: string;
  time: string;
}

const UpcomingAppointments = () => {
  // Sample data - replace with actual data from props or API
  const appointments: Appointment[] = [
    {
      id: "1",
      name: "Dela Cruz, Juan M.",
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "confirmed",
      date: "2025-01-01",
      time: "9:30 AM",
    },
    {
      id: "2",
      name: "Santos, Maria L.",
      avatar: "https://i.pravatar.cc/150?img=2",
      status: "confirmed",
      date: "2025-01-01",
      time: "10:00 AM",
    },
    {
      id: "3",
      name: "Garcia, Pedro R.",
      avatar: "https://i.pravatar.cc/150?img=3",
      status: "confirmed",
      date: "2025-01-01",
      time: "10:30 AM",
    },
    {
      id: "4",
      name: "Lopez, Ana S.",
      avatar: "https://i.pravatar.cc/150?img=4",
      status: "confirmed",
      date: "2025-01-01",
      time: "11:00 AM",
    },
    {
      id: "5",
      name: "Martinez, Carlos D.",
      avatar: "https://i.pravatar.cc/150?img=5",
      status: "confirmed",
      date: "2025-01-01",
      time: "11:30 AM",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-szPrimary200 to-szPrimary100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-szPrimary700 rounded-md">
            <Calendar size={16} className="text-white" />
          </div>
          <h6 className="text-h6 font-bold text-szPrimary700">
            Upcoming Appointments
          </h6>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-80 overflow-y-auto">
        {appointments.map((appointment, index) => (
          <div key={appointment.id}>
            <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors">
              {/* Avatar */}
              <div className="flex justify-start items-center gap-2 ">
                <div className="flex-shrink-0 mr-1">
                  <Avatar
                    src={appointment.avatar}
                    alt={appointment.name}
                    size="small"
                  />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.name}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex justify-end items-center gap-2">
                <div className="flex-shrink-0 mx-2 w-[10px]">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                    title={appointment.status}
                  />
                </div>

                {/* Date and Time */}
                <div className="flex-shrink-0 w-[90px]">
                  <p className="text-sm text-gray-500">
                    {formatDateForDisplay(appointment.date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Separator */}
            {index < appointments.length - 1 && (
              <div className="border-b border-gray-100 mx-4" />
            )}
          </div>
        ))}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
