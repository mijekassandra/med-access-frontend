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
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onClick,
  icon,
  title = "Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  subDescription,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-[24px]">
          <InfoCircle className="icon-lg text-error700" />
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
        },
        {
          label: "Delete",
          variant: "secondaryDark",
          onClick: onClick,
          size: "medium",
          leftIcon: <Trash />,
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
