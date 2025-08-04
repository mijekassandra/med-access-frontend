import React, { useState } from "react";
import Modal from "./Modal";

interface AvatarProps {
  size?: "large" | "medium" | "small" | "xsmall";
  src?: string;
  alt?: string;
  firstName?: string;
  lastName?: string;
  showBadge?: boolean;
  showEdit?: boolean;
  onProfileUpdate?: (
    file: {
      name: string;
      url: string;
      mimeType?: string;
      isLocal?: boolean;
    } | null
  ) => void;
}

const Avatar: React.FC<AvatarProps> = ({
  size = "large",
  src,
  alt = "Avatar",
  firstName = "",
  lastName = "",
  showBadge,
  showEdit = false,
  // onProfileUpdate,
}) => {
  const initials = `${firstName[0]?.toUpperCase() || ""}${
    lastName[0]?.toUpperCase() || ""
  }`;
  const [isModalOneOpen, setModalOneOpen] = useState(false);

  const sizeClasses = {
    large: "w-20 h-20",
    medium: "w-10 h-10",
    small: "w-8 h-8",
    xsmall: "w-6 h-6",
  };

  const fontSizeClasses = {
    large: "text-h1",
    medium: "text-h6",
    small: "text-caption-md",
    xsmall: "text-caption-sm",
  };

  const badgeSizeClasses = {
    large: "w-4 h-4",
    medium: "w-3.5 h-3.5",
    small: "w-3 h-3",
    xsmall: "w-2.5 h-2.5",
  };

  const editFontSizeClasses = {
    large: "text-caption-reg",
    medium: "text-[5px]",
    small: "text-[4px]",
    xsmall: "text-[3px]",
  };

  const badgeColor = showBadge ? "bg-success700" : "bg-szGrey200";

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {src ? (
        <div
          className={`relative ${sizeClasses[size]} overflow-hidden rounded-full group`}
        >
          <img src={src} alt={alt} className="object-cover w-full h-full" />
          {showEdit && (
            <span
              className={`absolute bottom-0 w-full text-center text-caption-reg cursor-pointer ${editFontSizeClasses[size]} text-szBlack800 bg-[#E3E3E3F2]/95 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              onClick={() => setModalOneOpen(true)}
            >
              Edit
            </span>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center justify-center rounded-full w-full h-full bg-szGrey150 text-szPrimary900 font-bold font-montserrat ${fontSizeClasses[size]}`}
        >
          {initials || "?"}
        </div>
      )}
      {showBadge !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${badgeSizeClasses[size]} ${badgeColor} rounded-full border-2 border-white`}
        ></span>
      )}

      <Modal
        showHeaderDivider={false}
        showFooterDivider={false}
        showButton={false}
        isOpen={isModalOneOpen}
        onClose={() => setModalOneOpen(false)}
        title="Edit Profile Picture"
        content={
          <></>
          // <EditProfilePicture
          //   profileImg={src || ""}
          //   onChange={onProfileUpdate}
          // />
        }
      />
    </div>
  );
};

export default Avatar;
