import React from "react";

interface CardContainerProps {
  icon?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
  content: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({
  icon,
  title,
  backgroundColor,
  content,
}) => {
  return (
    <div
      className={`rounded-2xl flex flex-col p-4 h-full border border-szGrey200 ${
        backgroundColor || "bg-szWhite100"
      }`}
    >
      {(icon || title) && (
        <div className={"flex flex-row gap-2 text-szSecondary500 mb-4"}>
          {icon}
          <p className="text-h6 font-montserrat">{title}</p>
        </div>
      )}
      {content}
    </div>
  );
};
export default CardContainer;
