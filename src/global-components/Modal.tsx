import React, { useState, useEffect } from "react";
import Button, { type ButtonProps } from "./Button";
import { Add, CloseCircle } from "iconsax-react";

interface ModalProps {
  isOpen: boolean;
  icon?: React.ReactNode;
  onClose: () => void;
  showCloseIcon?: boolean;
  closeOnOverlayClick?: boolean;

  /** Header */
  showHeader?: boolean;
  headerOptions?: "left" | "stacked-left" | "center";
  title?: string | React.ReactNode;
  subHeading?: string | React.ReactNode;
  content: string | React.ReactNode;
  headerImage?: string;
  customHeader?: React.ReactNode;
  showButton?: boolean;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  buttonOnClick?: () => void;
  showHeaderDivider?: boolean;

  /** Footer */
  showFooter?: boolean;
  footerOptions?: "left" | "stacked-left" | "center" | "full-width";
  footerButtons?: ButtonProps[];
  customFooter?: React.ReactNode;
  flexWrapButton?: boolean;
  showFooterDivider?: boolean;

  /** Styling */
  contentHeight?: string;
  modalWidth?: string;
  zIndex?: number;

  /** Accessibility */
  ariaModal?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  icon,
  showHeader = true,
  onClose,
  headerOptions = "left",
  title,
  subHeading,
  content,
  headerImage,
  customHeader,
  flexWrapButton = false,
  showFooter = true,
  footerOptions = "center",
  footerButtons = [],
  customFooter,
  ariaModal = true,
  ariaLabel = "",
  ariaDescribedBy,
  showButton = true,
  buttonLabel,
  buttonOnClick,
  contentHeight = "max-h-72",
  modalWidth = "max-w-[1100px]",
  showHeaderDivider = true,
  showFooterDivider = true,
  showCloseIcon = true,
  buttonIcon,
  zIndex = 10,
  closeOnOverlayClick = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 15);
    } else {
      setVisible(false);
      setTimeout(() => setShouldRender(false), 100);
    }
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const headerOptionClasses = {
    left: "flex items-start gap-6",
    "stacked-left": "flex flex-col items-start gap-0",
    center: "flex flex-col items-center text-center gap-4",
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-[${zIndex}] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-modal={ariaModal}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onClick={handleOverlayClick}
    >
      <div
        className={`rounded-2xl bg-white transform transition-transform duration-200 mx-[4px] ${
          visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } ${modalWidth}`}
        style={{ boxShadow: "0 16px 24px 0 rgba(0, 0, 0, 0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER  ----------------------------------------- */}
        {showHeader && (
          <div
            className={`px-[24px] py-[16px] flex flex-wrap gap-4 rounded-t-2xl justify-between items-start bg-szWhite100 ${
              headerOptions === "center" ? "flex-col-reverse" : ""
            }`}
          >
            {customHeader ? (
              customHeader
            ) : (
              <div className="flex flex-row gap-[24px] justify-between w-full">
                <section
                  className={`flex flex-cols-2 ${
                    headerOptions === "center" ? "flex-row-reverse w-full" : ""
                  } ${headerOptionClasses[headerOptions]}`}
                >
                  {icon &&
                    React.cloneElement(
                      icon as React.ReactElement,
                      {
                        className: `w-10 h-10 text-szPrimary500 flex-shrink-0`,
                      } as React.HTMLAttributes<HTMLElement>
                    )}
                  <div>
                    <h3 className="text-h3 w-fit ">{title}</h3>
                    <p className="text-body-base-strong">{subHeading}</p>
                  </div>
                </section>

                <section
                  className={`${
                    headerOptions === "center"
                      ? `w-full rounded-lg flex justify-end bg-cover bg-center ${
                          headerImage ? "h-40" : ""
                        }`
                      : ""
                  }`}
                  style={{
                    backgroundImage:
                      headerOptions === "center" && headerImage
                        ? `url(${headerImage})`
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-x-[24px]">
                    {showButton && (
                      <Button
                        leftIcon={buttonIcon || <Add variant="Linear" />}
                        label={buttonLabel || "Button"}
                        variant="secondary"
                        size="small"
                        onClick={buttonOnClick}
                      />
                    )}
                    {showCloseIcon && (
                      <CloseCircle
                        onClick={onClose}
                        variant="Linear"
                        className={`w-10 h-10 cursor-pointer ${
                          headerOptions === "center"
                            ? "text-szPrimary500 m-2"
                            : "text-szBlack700 hover:text-szPrimary500"
                        }`}
                      />
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
        {showHeader && showHeaderDivider && <hr className="mb-[16px]" />}
        {/* CONTENT  ----------------------------------------- */}
        <div
          className={`px-[32px] text-body-small-reg bg-szWhite100 overflow-y-auto ${contentHeight} ${
            !showHeader ? "rounded-t-2xl" : ""
          } ${!showFooter ? "rounded-b-2xl" : ""}`}
        >
          {content}
        </div>

        {/* FOOTER  ----------------------------------------- */}
        {showFooter && showFooterDivider && <hr className="mt-[16px]" />}
        {showFooter && (
          <div
            className={`px-[24px] py-[16px] flex flex-wrap gap-4 rounded-b-2xl justify-between items-start bg-szWhite100`}
          >
            {customFooter ? (
              customFooter
            ) : (
              <section
                className={`flex gap-4 w-full ${
                  footerOptions === "center"
                    ? `items-center ${flexWrapButton ? "flex-wrap" : ""}`
                    : footerOptions === "stacked-left"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {footerButtons.length > 0 &&
                  footerButtons.map((buttonProps, index) => (
                    <Button
                      key={index}
                      fullWidth={
                        footerOptions === "center"
                          ? true
                          : buttonProps.fullWidth || false
                      }
                      {...buttonProps}
                    />
                  ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
