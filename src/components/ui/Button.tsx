import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  type: "submit" | "button" | "reset";
  title?: string; // Add title as an optional prop
}

const Button: React.FC<ButtonProps> = ({ type, title, children, ...props }) => {
  return (
    <button type={type}
      {...props}
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
    {title || children}
    </button>
  );
};

export default Button;
