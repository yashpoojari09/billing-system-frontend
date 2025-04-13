import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // Add an error prop
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white mb-1">{label}</label>
      <input
        {...props}
        className={`px-3 py-2 rounded-md bg-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] ${
          error ? "border-red-500" : "border-gray-300"
        }`} // Apply a red border if there's an error
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Show the error message */}
    </div>
  );
};

export default Input;
