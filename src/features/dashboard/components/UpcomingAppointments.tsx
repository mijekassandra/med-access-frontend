import { useMemo } from "react";
import { Calendar } from "iconsax-react";
import Avatar from "../../../global-components/Avatar";
import Loading from "../../../components/Loading";

//utils
import { formatDateForDisplay } from "../../../utils/dateUtils";

// RTK Query
import { useGetAppointmentsQuery } from "../../telemedicine/api/appointmentApi";

interface Appointment {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  status: "accepted" | "pending" | "cancelled";
  date: string;
  time: string;
}

const UpcomingAppointments = () => {
  // Get today's date in YYYY-MM-DD format for API
  const today = new Date().toISOString().split("T")[0];

  // Fetch appointments for today
  const { data: appointmentsResponse, isLoading } = useGetAppointmentsQuery({
    date: today,
  });

  // Filter and map appointments
  const appointments: Appointment[] = useMemo(() => {
    if (!appointmentsResponse?.data) return [];

    // Filter for accepted status, today's date, and valid patient (not deleted)
    const todayAppointments = appointmentsResponse.data
      .filter((apt) => {
        // Skip appointments where patient was deleted
        if (!apt.patient) return false;

        const appointmentDate = new Date(apt.date).toISOString().split("T")[0];
        return apt.status === "accepted" && appointmentDate === today;
      })
      .slice(0, 5) // Limit to first 5
      .map((apt) => {
        const appointmentDate = new Date(apt.date);
        const dateString = appointmentDate.toISOString().split("T")[0];
        const timeString = appointmentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // Patient is guaranteed to exist due to filter above
        const patient = apt.patient!;

        return {
          id: apt._id,
          name: `${patient.lastName}, ${patient.firstName}`,
          firstName: patient.firstName,
          lastName: patient.lastName,
          status: apt.status as "accepted" | "pending" | "cancelled",
          date: dateString,
          time: timeString,
        };
      });

    return todayAppointments;
  }, [appointmentsResponse, today]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
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
      <div className="min-h-[200px] max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 flex-1 flex items-center justify-center">
            <Loading message="Loading upcoming appointments..." />
          </div>
        ) : (
          <>
            {appointments.map((appointment, index) => (
              <div key={appointment.id}>
                <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors">
                  {/* Avatar */}
                  <div className="flex justify-start items-center gap-2 ">
                    <div className="flex-shrink-0 mr-1">
                      <Avatar
                        firstName={appointment.firstName}
                        lastName={appointment.lastName}
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
            {appointments.length === 0 && !isLoading && (
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  No upcoming appointments
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
