"use client";

import { ClipboardList } from "lucide-react";
import { Activity } from "lucide-react";
import { Settings } from "lucide-react";
import { ChartBar } from "lucide-react";

/**
 *
 * @param {'finance'|'technical'|'governance'|'monitoring'|'m&e'} category
 * @returns
 */
export const getCategoryIcon = (category) => {
  switch ((category || "").toLowerCase()) {
    case "finance":
      return <ChartBar className="w-5 h-5" />;
    case "technical":
      return <Settings className="w-5 h-5" />;
    case "governance":
      return <ClipboardList className="w-5 h-5" />;
    case "monitoring":
    case "m&e":
      return <Activity className="w-5 h-5" />;
    default:
      return null;
  }
};
