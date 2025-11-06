import React from "react";

//icons
import { InfoCircle } from "iconsax-react";
import Checked from "../assets/checked.png";
//components
import Modal from "../global-components/Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  image?: string;
  description: string;
  content?: React.ReactNode;
  buttonLabel: string;
  buttonFooterIcon?: React.ReactNode;
  contentHeight?: string;
  isLoading?: boolean;
  isLoadingText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onClick,
  image = { Checked },
  description,
  content,
  buttonLabel,
  buttonFooterIcon,
  contentHeight = "h-auto min-h-[150px] max-h-[55vh]",
  isLoading,
  isLoadingText,
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
      zIndex={20}
      footerButtons={[
        {
          label: "Cancel",
          variant: "ghost",
          onClick: () => onClose(),
          size: "medium",
          disabled: isLoading,
        },
        {
          label: buttonLabel,
          variant: "primary",
          onClick: () => onClick(),
          size: "medium",
          leftIcon: buttonFooterIcon,
          disabled: isLoading,
          loading: isLoading,
          loadingText: isLoadingText,
        },
      ]}
      content={
        <div className="flex flex-col gap-4 items-center">
          {image && (
            <img
              src={typeof image === "string" ? image : image.Checked}
              alt="confirmation"
              className="w-[86px]"
            />
          )}

          <h6 className="text-h6 text-szBlack800 text-center">{description}</h6>
          <div className="flex flex-col gap-[8px] w-full">{content}</div>
        </div>
      }
    />
  );
};

export default ConfirmationModal;
