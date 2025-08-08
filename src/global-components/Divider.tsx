import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  className = "py-[16px] px-[80px]",
}) => {
  return (
    <div className={`${className} flex items-center`}>
      <hr className="w-full" />
    </div>
  );
};

export default Divider;
