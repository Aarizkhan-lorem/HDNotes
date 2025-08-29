import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  type,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type={inputType === "date" && !focused ? "text" : inputType}
        className={`peer w-full px-3 pt-5 pb-2 border rounded-md
            border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
           focus:outline-none placeholder-transparent
           ${isPasswordType ? "pr-12" : ""}
           ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}`}
        placeholder={label}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        {...props}
      />

      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-100 text-gray-500 pointer-events-none
             ${
               focused || props.value
                 ? "text-xs -top-1 bg-white px-1"
                 : " top-3.5"
             }`}
        >
          {label}
        </label>
      )}

      {/* Password Toggle Button */}
      {isPasswordType && (
        <button
          type="button"
          className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
