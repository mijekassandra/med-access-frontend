import { useNavigate } from "react-router-dom";
//assets
import inPersonImage from "../../../assets/appointment.png";
import telemedicineImage from "../../../assets/check-up.png";

//components
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";
import Divider from "../../../global-components/Divider";
import Button from "../../../global-components/Button";

interface MobileAppointmentProps {
  onNavigateToBooking?: () => void;
  onNavigateToTelemedicine?: () => void;
}

const MobileAppointment: React.FC<MobileAppointmentProps> = ({
  onNavigateToBooking,
  onNavigateToTelemedicine,
}) => {
  const navigate = useNavigate();
  const handleInPersonBooking = () => {
    // Navigate to the in-person booking page using the parent component's navigation
    if (onNavigateToBooking) {
      onNavigateToBooking();
    }
  };

  const handleTelemedicineBooking = () => {
    // Navigate to the telemedicine booking page using the parent component's navigation
    if (onNavigateToTelemedicine) {
      onNavigateToTelemedicine();
    }
  };

  const handleViewAllAppointments = () => {
    navigate("/patient-all-appointments");
  };

  return (
    <div className="min-h-screen bg-szWhite100 mb-6">
      <div className="px-4 py-4">
        <MobilePageTitle
          title="Appointments"
          description="Choose the type of appointment that best fits your needs"
        />

        {/* View All Appointments Button */}
        <div className="mt-4">
          <Button
            variant="primary"
            size="medium"
            label="View All Appointments"
            onClick={handleViewAllAppointments}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Telemedicine ---------------------------- */}
        <div className="flex flex-col shadow-lg bg-szWhite100 rounded-lg p-4 ">
          <div className="flex flex-row gap-2">
            <img
              src={telemedicineImage}
              alt="Appointment"
              className="w-24 h-24 bg-szPrimary100 rounded-lg p-1"
            />
            <div className="flex flex-col gap-1">
              <h5 className="text-h5 text-szPrimary900">Telemedicine</h5>
              <p className="text-szDarkGrey600 text-body-small-reg">
                Talk to a doctor online through your phone. Get medical advice
                without visiting the clinic.{" "}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <Divider className="my-2 w-full" />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="small"
                label="Book Now"
                className="w-fit"
                onClick={handleTelemedicineBooking}
              />
            </div>
          </div>
        </div>

        {/* In-Person ---------------------------- */}
        <div className="flex flex-col shadow-lg bg-szWhite100 rounded-lg p-4 ">
          <div className="flex flex-row gap-2">
            <img
              src={inPersonImage}
              alt="In-Person Appointment"
              className="w-24 h-24 bg-szSecondary100 rounded-lg p-1"
            />
            <div className="flex flex-col gap-1">
              <h5 className="text-h5 text-szSecondary500">In-Person</h5>
              <p className="text-szDarkGrey600 text-body-small-reg">
                Meet the doctor face-to-face at our clinic for a check-up and
                treatment.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <Divider className="my-2 w-full" />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="small"
                label="Book Now"
                className="w-fit"
                onClick={handleInPersonBooking}
              />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-szWhite100 rounded-lg p-4 border-l-4 border-szPrimary700 shadow-md mt-2 ">
          <h6 className="text-h6 text-szDarkGrey600 font-bold mb-2">
            Need Help Choosing?
          </h6>
          <div className="space-y-2">
            <p className="text-szDarkGrey600 text-body-small-reg">
              <span className="font-medium">Telemedicine</span> is perfect for
              follow-ups, consultations, and minor health concerns.
            </p>
            <p className="text-szDarkGrey600 text-body-small-reg">
              <span className="font-medium">In-person visits</span> are
              recommended for physical examinations and complex procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppointment;
