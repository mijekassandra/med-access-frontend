import React from "react";

//components
import PersonnelTable from "../../user/components/PersonnelTable";
import Divider from "../../../global-components/Divider";

const PersonnelDashboardTable = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-8">
        <h4 className="text-h4 font-semibold text-szBlack700">
          View All Personnel
        </h4>
        <Divider className="flex-1 h-full " />
      </div>
      <PersonnelTable />
    </div>
  );
};

export default PersonnelDashboardTable;
