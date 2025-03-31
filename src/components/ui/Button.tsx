import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  type: "submit" | "button" | "reset";
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({ type, title, children, ...props }) => {
  return (
    <button
      type={type}
      {...props}
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
    >
      {title || children}
    </button>
  );
};

interface ButtonPropsEd extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant: "edit" | "delete";
  title?: string;
}

export const ButtonEd: React.FC<ButtonPropsEd> = ({ variant, title, children, ...props }) => {
  return (
    <button
      {...props}
      className={`px-3 py-1 rounded mr-2 ${
        variant === "edit" ? "bg-blue-500 text-white hover:bg-blue-700" :
        "bg-red-500 text-white hover:bg-red-700"
      }`}
    >
      {title || children}
    </button>
  );
};
