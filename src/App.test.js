import { useState } from "react";

export function Dialog({ children }) {
  return children;
}

export function DialogTrigger({ asChild, children }) {
  return children;
}

export function DialogContent({ children, className = "" }) {
  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-lg shadow-lg z-50 w-[90%] max-w-xl ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="border-b p-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h3 className="text-lg font-bold">{children}</h3>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-600">{children}</p>;
}
