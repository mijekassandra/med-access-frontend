import React from "react";

interface LabeledCardProps {
  label: string;
  children: React.ReactNode;
}

const PurpleTaggedCard: React.FC<LabeledCardProps> = ({ label, children }) => {
  return (
    <div className="relative border border-gray-300 rounded-[8px] px-[16px] py-[20px] ">
      {/* Label Floating with  */}
      <div className="absolute -top-3 left-4 bg-szPrimary500 rounded-[4px] px-[8px] py-[2px]">
        <p className="body-small-strong text-white">{label}</p>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
};

export default PurpleTaggedCard;
