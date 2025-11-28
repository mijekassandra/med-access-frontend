import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Lock } from "iconsax-react";
import Avatar from "../global-components/Avatar";
import Notification from "../features/notification/Notification";
import Modal from "../global-components/Modal";
import ChangePasswordModal from "../features/auth/components/ChangePasswordModal";
import type { User } from "../types/auth";

interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface AppbarProps {
  title: string;
  subheader?: string;
  userRole: "admin" | "doctor" | "user";
  user: User;
}

const Appbar = ({ title, subheader, userRole, user }: AppbarProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
  } | null>(null);

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (!avatarRef.current) return null;

    const rect = avatarRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.right - 200, // Align right edge of dropdown with right edge of avatar area
    };
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!isPopoverOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (avatarRef.current?.contains(target)) {
        return;
      }
      setIsPopoverOpen(false);
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isPopoverOpen]);

  // Update position when popover opens
  useEffect(() => {
    if (isPopoverOpen) {
      const pos = calculateDropdownPosition();
      setDropdownPosition(pos);
    }
  }, [isPopoverOpen]);

  const handleAvatarClick = () => {
    const pos = calculateDropdownPosition();
    setDropdownPosition(pos);
    setIsPopoverOpen((prev) => !prev);
  };

  const handleResetPassword = () => {
    setIsPopoverOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const dropdownItems: DropdownMenuItem[] = [
    {
      label: "Reset Password",
      onClick: handleResetPassword,
      icon: <Lock />,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center bg-szWhite100 w-full px-6 py-4">
        <div className="flex flex-col ">
          {/* <h1 className="text-szBlack900 text-body-large-strong">{title}</h1> */}
          <p className={`text-h3 md:text-h2 text-szBlack800`}>{title}</p>
          <p className="text-szDarkGrey600 text-body-small-reg">{subheader}</p>
        </div>
        <div className="flex items-center gap-6 h-full">
          <Notification userRole={userRole} />
          <div
            ref={avatarRef}
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={handleAvatarClick}
          >
            <Avatar
              src={user.profilePicture}
              size="medium"
              firstName={user.profilePicture ? "" : user.firstName}
              lastName={user.profilePicture ? "" : user.lastName}
            />
            {/* <p className="text-szBlack800 text-body-small-reg">
              {user.fullName}
            </p> */}
          </div>
        </div>
      </div>

      {/* Popover Dropdown */}
      {isPopoverOpen &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bg-white border rounded-lg z-10 w-[200px]"
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 1000,
              boxShadow: "0px 4px 15px 0px rgba(9, 18, 39, 0.2)",
            }}
          >
            {/* User Name Header */}
            <div className="px-[12px] py-[8px] border-b border-szGrey150">
              <p className="text-body-small-strong text-szBlack800">
                {user.fullName}
              </p>
              {user.email && (
                <p className="text-caption-reg text-szDarkGrey600 mt-1">
                  {user.email}
                </p>
              )}
            </div>
            {/* Menu Items */}
            {dropdownItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsPopoverOpen(false);
                }}
                className="flex gap-[4px] px-[12px] py-[8px] w-full text-left text-szBlack800 hover:bg-szGrey150"
              >
                {item.icon && (
                  <span>
                    {React.cloneElement(item.icon as React.ReactElement, {
                      className: `icon-sm`,
                    })}
                  </span>
                )}
                <p className="text-body-small-reg">{item.label}</p>
              </button>
            ))}
          </div>,
          document.body
        )}

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        title="Reset Password"
        showHeader={true}
        showFooter={false}
        showButton={false}
        content={
          <ChangePasswordModal
            isOpen={isChangePasswordModalOpen}
            onClose={() => setIsChangePasswordModalOpen(false)}
            userEmail={user.email}
          />
        }
        modalWidth="max-w-[500px]"
      />
    </>
  );
};

export default Appbar;
