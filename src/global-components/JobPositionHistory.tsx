import React, { useState } from "react";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";

import TextContent from "./TextContent";
import Avatar from "./Avatar";

interface JobPositionHistoryProps {
  state: "closed" | "open" | "other";
  data: {
    position: string;
    positionCode: string;
    startDate?: Date | string | number;
    endDate?: Date | string | number;
    department: string;
    length: string;
    directHead?: string;
    directHeadPhotoUrl?: string;
    category: string;
    monthlyCompensation?: string;
    otherAllowance?: string;
    clothingAllowance?: string;
    riceAllowance?: string;
    laundryAllowance?: string;
  };
}

const JobPositionHistory: React.FC<JobPositionHistoryProps> = ({
  state,
  data,
}) => {
  const [isOpen, setIsOpen] = useState(state === "open");

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const showChevron = state === "closed" || state === "open";

  // to format date
  const formatDate = (dateInput?: string | number | Date) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Header Section ------------------------------------------------ */}
      <div
        className="flex justify-between items-center"
        // Toggle on click
      >
        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <p className="text-body-base-strong text-szBlack900">
              {data.position}
            </p>
            <span className="text-[10px]">•</span>
            <p className="text-body-base-strong text-szPrimary500">
              {data.positionCode}
            </p>
          </div>
          <div className="flex gap-1 items-center text-body-small-reg text-szPrimary500">
            <p className="text-szDarkGrey600">
              {formatDate(data.startDate)} – {formatDate(data.endDate)}
            </p>
            <span className="text-[8px] text-szDarkGrey600">•</span>
            <p className="text-szDarkGrey600">{data.length}</p>
          </div>
          <p className="text-szDarkGrey600">{data.department}</p>
        </div>

        {/* Chevron Icon */}
        {showChevron && !isOpen && (
          <ArrowDown2
            className="text-szPrimary900 icon-sm cursor-pointer"
            onClick={toggleDropdown}
          />
        )}
      </div>

      {/* Dropdown Content ------------------------------------------------ */}
      {isOpen && (
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-wrap gap-y-[8px]">
            <div className="w-[280px] ">
              <TextContent
                icon={<Avatar size="small" src={data.directHeadPhotoUrl} />}
                header="Direct Head"
                text={data.directHead}
              />
            </div>
            <div className="w-[280px]">
              <TextContent header="Category" text={data.category} />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-body-small-strong text-szPrimary700">
              Benefits & Compensation
            </p>
            <div className="flex flex-wrap gap-y-[8px]">
              <div className="w-[280px]">
                <TextContent header="Monthly" text={data.monthlyCompensation} />
              </div>
              <div className="w-[280px]">
                <TextContent
                  header="Other Allowances"
                  text={data.otherAllowance}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-y-[8px]">
              <div className="w-[280px]">
                <TextContent header="Clothing" text={data.clothingAllowance} />
              </div>
              <div className="w-[280px]">
                <TextContent header="Rice" text={data.riceAllowance} />
              </div>
              <div className="flex grow gap-10 justify-between">
                <TextContent header="Laundry" text={data.laundryAllowance} />
                <ArrowUp2
                  className="text-szPrimary900 icon-sm cursor-pointer"
                  onClick={toggleDropdown}
                />
              </div>
              {/* <div className="flex justify-end grow ">
              
              </div> */}
            </div>
          </div>
          <hr className="mx-[80px]" />
        </div>
      )}
    </div>
  );
};

export default JobPositionHistory;
