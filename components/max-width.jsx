import { cn } from "@/utils/cn";
import React from "react";

export default function MaxWidth({ children, className, ...props }) {
  return (
    <div
      className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}