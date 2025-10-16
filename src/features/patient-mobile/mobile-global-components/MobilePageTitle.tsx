import React from "react";

interface MobilePageTitleProps {
  title: string;
  description?: string;
}

const MobilePageTitle: React.FC<MobilePageTitleProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-h3 text-szBlack700 font-bold">{title}</h3>
      </div>
      {description && (
        <p className="text-szDarkGrey600 text-body-base-reg">{description}</p>
      )}
    </div>
  );
};

export default MobilePageTitle;
