import React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border bg-white text-black shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div
      className={`p-4 ${className}`}
      {...props}
    />
  );
}
