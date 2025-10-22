import React from "react";

// Global components
import Spinner from "../global-components/Spinner";

interface LoadingProps {
  message?: string;
  spinnerSize?: "small" | "medium" | "large";
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  spinnerSize = "large",
}) => {
  return (
    <div className="flex flex-col gap-2 text-center py-8 h-[200px] items-center justify-center">
      <Spinner size={spinnerSize} className="text-szSecondary500" />
      <p className="text-body-base-reg text-szSecondary500">{message}</p>
    </div>
  );
};

export default Loading;
