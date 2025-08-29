import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../../components/ui/Input";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface SignInProps {
  onSwitch: () => void;
  onOTPRequired: (email: string) => void;
}

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export const SignIn: React.FC<SignInProps> = ({ onSwitch, onOTPRequired }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Move this to the very top

    // Add validation before API call
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err); // Add logging

      const errorMessage = err?.response?.data?.message || "Login failed";

      if (err?.response?.data?.data?.requiresVerification) {
        onOTPRequired(email);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto  p-8 ">
      <h2 className="text-2xl font-bold mb-2">Sign in</h2>
      <p className="text-gray-600 mb-6">
        Please login to continue to your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jonas.kahnwald@gmail.com"
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Keep me logged in</span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              const decoded: GoogleUser = jwtDecode(
                credentialResponse.credential
              );
              console.log("User Info:", decoded);
              alert(`Welcome ${decoded.name}`);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Need an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium"
        >
          Create one
        </button>
      </p>
    </div>
  );
};
