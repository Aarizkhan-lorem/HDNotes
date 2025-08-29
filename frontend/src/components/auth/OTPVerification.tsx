import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onBack,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.verifyOTP(email, otp);

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.resendOTP(email);
    } catch (err) {
      console.error("Failed to resend OTP");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg p-8 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">HD</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">Sign up</h2>
      <p className="text-gray-600 mb-6">Sign up to enjoy the feature of HD</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">Your Name</p>
        <p className="font-medium">Jonas Kahnwald</p>

        <p className="text-sm text-gray-600">Date of Birth</p>
        <p className="font-medium">11 December 1997</p>

        <p className="text-sm text-gray-600">Email</p>
        <p className="font-medium">{email}</p>

        <div className="relative">
          <Input
            label="OTP"
            type={showOTP ? "text" : "password"}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400"
            onClick={() => setShowOTP(!showOTP)}
          >
            {showOTP ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Sign up
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button onClick={onBack} className="text-blue-500 font-medium">
          Sign In
        </button>
      </p>
    </div>
  );
};
