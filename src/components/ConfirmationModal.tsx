import React from "react";

//icons
import { InfoCircle } from "iconsax-react";

//components
import Modal from "../global-components/Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  image: string;
  description: string;
  content?: React.ReactNode;
  buttonLabel: string;
  buttonFooterIcon?: React.ReactNode;
  contentHeight?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onClick,
  image,
  description,
  content,
  buttonLabel,
  buttonFooterIcon,
  contentHeight = "h-auto min-h-[150px] max-h-[55vh]",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeaderDivider={false}
      showFooterDivider={false}
      icon={<InfoCircle />}
      title="Confirmation"
      showButton={false}
      modalWidth="w-[600px]"
      contentHeight={contentHeight}
      headerOptions="left"
      footerOptions="center"
      showCloseIcon={false}
      footerButtons={[
        {
          label: "Cancel",
          variant: "ghost",
          onClick: () => onClose(),
          size: "medium",
        },
        {
          label: buttonLabel,
          variant: "primary",
          onClick: () => onClick(),
          size: "medium",
          leftIcon: buttonFooterIcon,
        },
      ]}
      content={
        <div className="flex flex-col gap-[8px] items-center">
          <img src={image} alt="confirmation" className="w-[80px]" />
          <p className="text-body-base-strong text-szBlack800 text-center">
            {description}
          </p>
          <div className="flex flex-col gap-[8px] w-full">{content}</div>
        </div>
      }
    />
  );
};

export default ConfirmationModal;
