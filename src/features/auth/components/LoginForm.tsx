import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//components
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";

// Auth hooks and actions
import { useLoginMutation } from "../api/authApi";
import { setCredentials, setError, clearError } from "../slice/authSlice";
import type { AppDispatch } from "../../../store";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Form validation function
  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    // Username validation
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setLocalError("");
    setValidationErrors({});
    dispatch(clearError());

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();

      if (result.success) {
        // Store credentials in Redux store
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
          })
        );

        // Set welcome snackbar flag
        sessionStorage.setItem("showWelcomeSnackbar", "true");

        // Navigate based on user role
        if (result.data.user.role === "user") {
          navigate("/patient-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Login failed. Please try again.";
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
    }
  };

  return (
    <div className="flex flex-col gap-10 w-[330px] sm:w-[360px]">
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Username:</p>
          <Inputs
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              // Clear validation error when user starts typing
              if (validationErrors.username) {
                setValidationErrors((prev) => ({
                  ...prev,
                  username: undefined,
                }));
              }
            }}
          />
          {validationErrors.username && (
            <p className="text-body-small-reg text-red-500 mt-1">
              {validationErrors.username}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-body-base-reg text-szWhite100">Password:</p>
          <Inputs
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            icon={showPassword ? Eye : EyeSlash}
            onChange={(e) => {
              setPassword(e.target.value);
              // Clear validation error when user starts typing
              if (validationErrors.password) {
                setValidationErrors((prev) => ({
                  ...prev,
                  password: undefined,
                }));
              }
            }}
            iconClick={() => setShowPassword(!showPassword)}
          />
          <div
            className={`flex flex-row gap-1 ${
              localError || validationErrors.password
                ? "justify-between"
                : "justify-end"
            }`}
          >
            {validationErrors.password && (
              <p
                className={`flex flex-1 text-body-small-reg text-error700 mt-1 `}
              >
                {validationErrors.password}
              </p>
            )}
            {localError && (
              <p className={`text-body-small-reg text-error700 mt-1`}>
                {localError}
              </p>
            )}
            {/* <p
              className="text-body-small-reg text-szWhite100 text-right mt-1 cursor-pointer hover:underline transition-colors"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </p> */}
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <Button
          variant="secondaryDark"
          label={isLoading ? "LOGGING IN..." : "LOGIN"}
          size="medium"
          type="button"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
        />
        {/* <p className="text-body-small-reg text-szWhite100 text-center">
          Don't have an account?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors"
            onClick={() => navigate("/create-account")}
          >
            Register
          </span>
        </p> */}
      </div>
    </div>
  );
};

export default LoginForm;
