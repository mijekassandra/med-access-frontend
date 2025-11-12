import { useNavigate } from "react-router-dom";

//icons
import { TickCircle } from "iconsax-react";

//components
import Button from "../../../global-components/Button";

const EmailVerificationSuccess = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleResendEmail = () => {
    // TODO: Implement resend email functionality
    console.log("Resend email clicked");
  };

  return (
    <div className="min-h-screen bg-szPrimary50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="text-center mb-8">
          {/* Success Icon */}

          <div className="flex justify-center mb-6">
            <TickCircle
              className="w-32 h-32 text-szPrimary900"
              variant="Broken"
            />
          </div>
          <h2 className="text-h2 text-szPrimary900 mb-4">
            Account Created Successfully!
          </h2>

          <p className="text-body-big-reg text-szBlack700 mb-8">
            Please check your email for verification instructions to complete
            your registration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-center gap-4 w-full max-w-[400px]">
          <Button
            variant="secondaryDark"
            label="BACK TO LOGIN"
            size="medium"
            type="button"
            fullWidth
            onClick={handleBackToLogin}
          />

          <Button
            variant="ghost"
            label="RESEND VERIFICATION"
            size="medium"
            type="button"
            fullWidth
            onClick={handleResendEmail}
          />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-body-small-reg text-szLightGrey400">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
