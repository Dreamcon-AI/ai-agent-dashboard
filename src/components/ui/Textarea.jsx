import React from "react";

export function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full p-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
