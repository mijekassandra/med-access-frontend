// import { useNavigate } from "react-router-dom";

//icons

//components
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-szBackground flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="text-center m-8">
          <h3 className="text-h3 text-szWhite100 mb-2">Join MedAccess</h3>
          <p className="text-body-base-reg text-szSecondary500">
            Create your account to access quality healthcare services
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
