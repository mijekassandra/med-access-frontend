//components
import ForgotPassword from "../components/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen bg-szBackground">
      {/* <img src={logo} alt="logo" className="w-[200px]" /> */}
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
