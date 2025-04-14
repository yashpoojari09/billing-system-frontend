"use client"

import React from "react";
import { useRouter } from "next/navigation";


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
      className="sm:w-auto px-2 py-2 rounded-md shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] text-white bg-blue-700 hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
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
      className={`px-3 py-1 rounded mr-2  cursor-pointer sm:w-auto ${
        variant === "edit" ? "shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] bg-blue-700 text-white hover:bg-blue-500" :
        "shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a]  bg-red-800 text-white hover:bg-red-500 text-white hover:bg-red-700"
      }`}
    >
      {title || children}
    </button>
  );
};


interface ButtonDashProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant: "blue" | "green" | "yellow"; // Define button color variants
  navigateTo?: string; // Allow navigation
}

export const ButtonDash: React.FC<ButtonDashProps> = ({ title, variant = "blue", navigateTo, ...props }) => {
  const router = useRouter();

  const variantClasses = {
    blue: "bg-blue-500 hover:bg-blue-700 text-white",
    green: "bg-green-500 hover:bg-green-700 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-700 text-white",
  };

  const handleClick = () => {
    if (navigateTo) {
      router.push(navigateTo); // Navigate when clicked
    }
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded w-full transition cursor-pointer sm:w-auto ${variantClasses[variant]}`}
      onClick={navigateTo ? handleClick : props.onClick}
    >
      {title}
    </button>
  );
};