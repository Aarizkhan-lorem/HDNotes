import React, { useState } from "react";

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
  const [inputType, setInputType] = useState(type);

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type={inputType === "date" && !focused ? "text" : inputType}
        className={`peer w-full px-3 pt-5 pb-2 border rounded-md  
          border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
          focus:outline-none placeholder-transparent 
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
          className={`absolute left-3 transition-all duration-100 text-gray-500 
            ${
              focused || props.value
                ? "text-xs -top-1 bg-white px-1"
                : " top-3.5"
            }`}
        >
          {label}
        </label>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
