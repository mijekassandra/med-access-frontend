// import React from "react";

// assets
import logo from "../../../assets/med_access_logo.png";

//components
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen bg-szBackground">
      <img src={logo} alt="logo" className="w-[250px] sm:w-[280px]" />
      <LoginForm />
    </div>
  );
};

export default Login;
