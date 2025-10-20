import React from "react";

//icons
import { InfoCircle, Trash } from "iconsax-react";

//components
import Modal from "../global-components/Modal";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  title?: string;
  icon?: React.ReactNode;
  description?: string;
  subDescription?: string;
  isLoading?: boolean;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  iconColor?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onClick,
  icon,
  title = "Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  subDescription,
  isLoading = false,
  buttonLabel = "Delete",
  buttonIcon = <Trash />,
  iconColor = "text-error700",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-[24px]">
          <InfoCircle className={`icon-lg ${iconColor}`} />
          <h3 className="text-h3">{title}</h3>
        </div>
      }
      showCloseIcon={false}
      showButton={false}
      showHeaderDivider={false}
      showFooterDivider={false}
      modalWidth="max-w-[544px]"
      footerButtons={[
        {
          label: "Cancel",
          variant: "ghost",
          onClick: onClose,
          size: "medium",
          disabled: isLoading,
        },
        {
          label: isLoading ? `${buttonLabel}...` : buttonLabel,
          variant: "secondaryDark",
          onClick: onClick,
          size: "medium",
          leftIcon: buttonIcon,
          disabled: isLoading,
          loading: isLoading,
        },
      ]}
      content={
        <div className="flex flex-col items-center gap-4 text-center py-[20px]">
          <>
            {icon ? (
              icon
            ) : (
              <Trash size="50" variant="Bulk" className="text-error700" />
            )}
          </>
          <h4 className="text-h4 ">{description}</h4>
          {subDescription && (
            <p className="text-body-base-strong text-szGrey600">
              {subDescription}
            </p>
          )}
        </div>
      }
    />
  );
};

export default DeleteConfirmation;
