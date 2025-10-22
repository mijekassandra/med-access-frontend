import { useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//components
import Inputs from "../../../global-components/Inputs";
import Checkboxes from "../../../global-components/Checkboxes";
import Button from "../../../global-components/Button";

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  // Static role detection based on email
  const detectUserRole = (
    email: string
  ): "admin" | "doctor" | "patient" | null => {
    const emailLower = email.toLowerCase();

    if (emailLower === "admin@gmail.com") {
      return "admin";
    } else if (emailLower === "doctor@gmail.com") {
      return "doctor";
    } else if (emailLower === "patient@gmail.com") {
      return "patient";
    }

    return null;
  };

  const handleLogin = () => {
    // Clear previous errors
    setError("");

    // Check if email and password are provided
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Detect user role based on email
    const userRole = detectUserRole(email);

    if (!userRole) {
      setError(
        "Invalid credentials. Use admin@gmail.com, doctor@gmail.com, or patient@gmail.com"
      );
      return;
    }

    // For demo purposes, accept any password for valid emails
    console.log(`Login successful as ${userRole}`);

    // Store user role in sessionStorage for demo purposes
    sessionStorage.setItem("userRole", userRole);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("showWelcomeSnackbar", "true");

    // Navigate based on user role
    if (userRole === "patient") {
      navigate("/patient-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-10 w-[330px] sm:w-[360px]">
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Email:</p>
          <Inputs
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <p className="text-body-base-reg text-szWhite100">Password:</p>
          <Inputs
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            icon={showPassword ? Eye : EyeSlash}
            onChange={(e) => setPassword(e.target.value)}
            iconClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <p
          className="text-body-small-reg text-szWhite100 text-right cursor-pointer hover:underline transition-colors"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>
        {/* <Checkboxes
          label="Remember me"
          onChange={() => setIsChecked(!isChecked)}
          checked={isChecked}
          textColor="szWhite100"
        /> */}
      </section>

      <div className="space-y-4">
        <Button
          variant="secondaryDark"
          label="LOGIN"
          size="medium"
          type="button"
          fullWidth
          onClick={handleLogin}
        />
        <p className="text-body-small-reg text-szWhite100 text-center">
          Don't have an account?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors"
            onClick={() => navigate("/create-account")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
