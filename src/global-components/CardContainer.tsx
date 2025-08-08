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
      className={`rounded-lg flex flex-col p-4 h-full border border-szGrey200 ${
        backgroundColor || "bg-szWhite100"
      }`}
    >
      {(icon || title) && (
        <div className={"flex flex-row gap-2 text-szSecondary500 mb-4"}>
          {icon}
          <h4 className="text-h4">{title}</h4>
        </div>
      )}
      {content}
    </div>
  );
};
export default CardContainer;
