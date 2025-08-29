import React, { useState } from "react";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { authService } from "../../services/auth.service";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface SignUpProps {
  onSwitch: () => void;
  onOTPRequired: (email: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSwitch, onOTPRequired }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.register(formData);

      if (response.success) {
        onOTPRequired(formData.email);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto  p-8">
      

      <h2 className="text-2xl font-bold mb-2">Sign up</h2>
      <p className="text-gray-600 mb-6">Sign up to enjoy the feature of HD</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jonas Kahnwald"
          required
        />

        
        <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jonas.kahnwald@gmail.com"
          required
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Get OTP
        </Button>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              const decoded = jwtDecode(
                credentialResponse.credential
              );
              console.log("User Info:", decoded);
              alert(`Welcome ${decoded?.name}`);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium">
          Sign In
        </button>
      </p>
    </div>
  );
};
