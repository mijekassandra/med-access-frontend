// assets
import logo from "../../../assets/med_access_logo.png";

//components
import ResetPassword from "../components/ResetPassword";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen bg-szBackground">
      <img
        src={logo}
        alt="logo"
        className="w-[200px] sm:w-[220px] md:w-w[280px]"
      />
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;
