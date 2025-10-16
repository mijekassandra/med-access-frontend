import { useNavigate } from "react-router-dom";
import PatientAppointmentCard from "./PatientAppointmentCard";
import Button from "../../../global-components/Button";
import MobileAnnouncementCard from "./MobileAnnouncementCard";

const MobileDashboard = () => {
  const navigate = useNavigate();
  // Sample appointment data
  const sampleAppointments = [
    {
      id: 1,
      doctorName: "Dr. Amethyst Lim",
      specialty: "ENT Specialist",
      date: "January 1, 2025",
      time: "10:00 AM",
      doctorImage: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 2,
      doctorName: "Dr. Lucas Ho",
      specialty: "Cardiologist",
      date: "January 1, 2025",
      time: "10:00 AM",
      doctorImage: "https://i.pravatar.cc/150?img=12",
    },
  ];
  const sampleAnnouncements = [
    {
      id: "1",
      title: "MONKEYPOX DISEASE OUTBREAK ADVISORY",
      date: "January 1, 2025",
      content:
        "RHU Jasaan reports confirmed cases of Monkeypox within the municipality. Health authorities are currently monitoring the situation closely and implementing necessary actions to prevent further transmission. Monkeypox is a contagious viral disease that spreads through close contact with an infected person, their bodily fluids, respiratory droplets, or contaminated objects. Symptoms include fever, headache, muscle aches, back pain, swollen lymph nodes, chills, and exhaustion. A rash that can look like pimples or blisters may appear on the face, inside the mouth, and on other parts of the body. If you experience any of these symptoms, please seek medical attention immediately.",
    },
  ];

  const handleSeeAll = () => {
    navigate("/patient-all-appointments");
  };

  const handleCancel = (appointment: any) => {
    console.log("Cancel appointment:", appointment);
  };

  const handleReschedule = (appointment: any) => {
    console.log("Reschedule appointment:", appointment);
  };

  return (
    <div className="grid gap-6 p-6">
      {/* Welcome Card */}
      <div className="bg-szWhite100 rounded-xl">
        <h3 className="text-h3 text-szPrimary500 font-bold">
          Hi, John Doe! 👋
        </h3>
        <p className="text-szGray600 text-body-base-reg">
          How are you feeling today?
        </p>
      </div>

      {/* Today's Appointments Section ----------------------*/}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h5 className="text-h5 text-szPrimary500 mb-2">
            Today's Appointments
          </h5>
          <Button
            label="See All"
            variant="ghost"
            size="small"
            onClick={handleSeeAll}
          />
        </div>
        <div className="flex flex-col gap-3">
          {sampleAppointments.map((appointment) => (
            <PatientAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => handleCancel(appointment)}
              onReschedule={() => handleReschedule(appointment)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h5 className="text-h5 text-szPrimary500 mb-2">Lates Announcement</h5>
        </div>
        <div className="flex flex-col gap-3">
          <MobileAnnouncementCard announcement={sampleAnnouncements[0]} />
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
