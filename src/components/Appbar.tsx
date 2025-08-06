import React from "react";

import { Notification } from "iconsax-react";
import Avatar from "../global-components/Avatar";

interface AppbarProps {
  title: string;
  subheader?: string;
}

const Appbar = ({ title, subheader }: AppbarProps) => {
  return (
    <div className="flex justify-between items-center bg-szWhite100 w-full px-6 py-4">
      <div className="flex flex-col ">
        {/* <h1 className="text-szBlack900 text-body-large-strong">{title}</h1> */}
        <h2 className="text-h2 text-szBlack800">{title}</h2>
        <p className="text-szDarkGrey600 text-body-small-reg">{subheader}</p>
      </div>
      <div className="flex items-center gap-4">
        <Notification
          variant="Bulk"
          className="text-szSecondary500 w-9 h-9 cursor-pointer"
          //   onClick={notifClick}
        />
        <Avatar src="https://i.pravatar.cc/150?img=5" size="medium" />
      </div>
    </div>
  );
};

export default Appbar;
