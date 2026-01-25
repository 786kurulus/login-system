"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ children, variant, ...props }) => {
  const baseClass = "rounded-2xl px-6 py-3 font-semibold transition transform hover:scale-105";
  const variantClass =
    variant === "outline"
      ? "border border-white text-white bg-transparent"
      : "bg-white text-blue-600";

  return (
    <button className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};
