import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft2, SearchNormal1 } from "iconsax-react";
import Button from "../global-components/Button";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-szPrimary50 via-szWhite100 to-szSecondary50 flex items-center justify-center p-4 relative">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-[120px] md:text-[160px] lg:text-[200px] font-bold text-szPrimary500 leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <SearchNormal1
                size={80}
                className="text-szPrimary200 opacity-50"
              />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-h2 text-szBlack900 font-semibold">
              Oops! Page Not Found
            </h2>
            <p className="text-body-base-reg text-szGrey600 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Don't
              worry, let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              label="Go Home"
              variant="primary"
              size="large"
              leftIcon={<Home size={20} />}
              onClick={handleGoHome}
              className="min-w-[160px]"
            />
            <Button
              label="Go Back"
              variant="secondary"
              size="large"
              leftIcon={<ArrowLeft2 size={20} />}
              onClick={handleGoBack}
              className="min-w-[160px]"
            />
          </div>

          {/* Helpful Links */}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-szPrimary100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-szSecondary100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-8 h-8 bg-szPrimary200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/3 right-8 w-6 h-6 bg-szSecondary200 rounded-full opacity-20 animate-bounce delay-500"></div>
      </div>
    </div>
  );
};

export default PageNotFound;
