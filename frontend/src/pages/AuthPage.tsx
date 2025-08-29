import React, { useState } from "react";
import { SignIn } from "../components/auth/SignIn";
import { SignUp } from "../components/auth/SignUp";
import { OTPVerification } from "../components/auth/OTPVerification";

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"signin" | "signup" | "otp">(
    "signin"
  );
  const [otpEmail, setOtpEmail] = useState("");

  const handleOTPRequired = (email: string) => {
    setOtpEmail(email);
    setCurrentView("otp");
  };

  return (
    <div className="min-h-screen relative flex">
      <div className="flex absolute top-5 left-[38%] sm:top-5 sm:left-5 items-center gap-2 mb-6">
          <img src="icon.svg" alt="" />
          <span className=" font-semibold text-2xl">HD</span>
      </div>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center py-8 bg-gray-50">
        {currentView === "signin" && (
          <SignIn
            onSwitch={() => setCurrentView("signup")}
            onOTPRequired={handleOTPRequired}
          />
        )}

        {currentView === "signup" && (
          <SignUp
            onSwitch={() => setCurrentView("signin")}
            onOTPRequired={handleOTPRequired}
          />
        )}

        {currentView === "otp" && (
          <OTPVerification
            email={otpEmail}
            onBack={() => setCurrentView("signin")}
          />
        )}
      </div>

      {/* Right side - Background Image */}
      <div className="hidden  py-0.5 lg:flex flex-1 items-center justify-center">
        <img
          src="/authImage.jpg"
          alt="Auth Image"
          className="w-full h-full  rounded-l-2xl object-cover"
        />
      </div>
    </div>
  );
};
