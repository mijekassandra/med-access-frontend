import React, { useEffect } from "react";
import { CloseCircle, InfoCircle, TickCircle } from "iconsax-react";

import Button from "./Button";

interface SnackbarAlertProps {
  isOpen: boolean;
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right" | "center";
  };
  showCloseButton?: boolean;
  action?: { label: string; onClick: () => void };
  autoHide?: boolean;
  animation?: "slide-up" | "slide-down" | "slide-left" | "fade" | "none";
  ariaRole?: "alert" | "status";
  showIcon?: boolean;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  title,
  message,
  type = "info",
  isOpen,
  onClose,
  duration = 5000,
  position = { vertical: "bottom", horizontal: "right" },
  showCloseButton = true,
  action,
  autoHide = true,
  animation = "slide-left",
  ariaRole = "alert",
  showIcon = true,
}) => {
  useEffect(() => {
    if (isOpen && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoHide, duration, onClose]);

  const snackbarStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: 1000,
    visibility: isOpen ? "visible" : "hidden", // Toggle visibility instead of display
    opacity: isOpen ? 1 : 0, // Smooth fade effect
    transition: "opacity 0.3s ease, transform 0.3s ease",
    transform:
      animation === "slide-up"
        ? isOpen
          ? "translateY(0)"
          : "translateY(20px)"
        : animation === "slide-down"
        ? isOpen
          ? "translateY(0)"
          : "translateY(-20px)"
        : animation === "slide-left"
        ? isOpen
          ? "translateX(0)"
          : "translateX(20px)"
        : "none",
    ...(position.vertical === "top" ? { top: "16px" } : { bottom: "16px" }),
    ...(position.horizontal === "left"
      ? { left: "16px" }
      : position.horizontal === "center"
      ? { left: "50%", transform: "translateX(-50%)" }
      : { right: "16px" }),
  };

  const typeStyle = {
    success: "bg-success50 text-success700",
    error: "bg-error50",
    warning: "bg-warning100",
    info: "bg-info100",
  };

  return (
    <div
      role={ariaRole}
      aria-live="polite"
      style={snackbarStyles}
      className={`snackbar min-w-[200px] max-w-[400px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px] `}
    >
      <div
        className={`rounded-lg flex justify-between p-4 gap-4 ${typeStyle[type]}`}
      >
        {/* ICON  ----------------------------------------- */}

        <div className="flex gap-4">
          {showIcon && (
            <section>
              {type === "success" ? (
                <TickCircle
                  variant="Linear"
                  className="icon text-success700 "
                />
              ) : (
                <InfoCircle
                  variant="Linear"
                  className={`icon ${type === "info" ? "text-info500" : ""} ${
                    type === "warning" ? "text-warning500" : ""
                  } ${type === "error" ? "text-error700" : ""} `}
                />
              )}
            </section>
          )}

          {/* TITLE AND MESSAGE  ----------------------------------------- */}
          <section>
            <h6 className="text-h6">{title}</h6>
            <p className="text-body-base-regular">{message}</p>
            {action && (
              <Button
                className="mt-2"
                label={action.label}
                onClick={action.onClick}
                variant="primary"
                size="small"
                fullWidth={false}
              />
            )}
          </section>
        </div>

        {/* CLOSE ICON  ----------------------------------------- */}
        {showCloseButton && (
          <section>
            <CloseCircle
              onClick={onClose}
              className="cursor-pointer text-szBlack900 hover:text-szGrey500"
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default SnackbarAlert;
