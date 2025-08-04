import React from "react";

interface AppbarProps {
  title: string;
  subheader?: string;
}

const Appbar = ({ title, subheader }: AppbarProps) => {
  return (
    <div className="bg-szWhite100 w-full px-6 py-4">
      <div className="flex flex-col gap-[4px]">
        {/* <h1 className="text-szBlack900 text-body-large-strong">{title}</h1> */}
        <h2 className="text-h2 text-szBlack800">{title}</h2>
        <p className="text-szDarkGrey600 text-body-small-reg">{subheader}</p>
      </div>
    </div>
  );
};

export default Appbar;
