// src/components/ui/tabs.js
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className = "", ...props }) => (
  <TabsPrimitive.List
    className={`inline-flex gap-2 rounded-full bg-gray-100 p-1 ${className}`}
    {...props}
  />
);

export const TabsTrigger = ({ className = "", ...props }) => (
  <TabsPrimitive.Trigger
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
      data-[state=active]:bg-indigo-600 data-[state=active]:text-white
      data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 ${className}`}
    {...props}
  />
);
