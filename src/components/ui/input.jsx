import React from "react";

export function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
