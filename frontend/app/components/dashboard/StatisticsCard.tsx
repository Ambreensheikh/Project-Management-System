import { cn } from "@/lib/utils";
import React from "react";

interface StatisticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
}

export function StatisticsCard({
  title,
  value,
  description,
  className,
  ...props
}: StatisticsCardProps) {
  return (
    <div
      className={cn(
        "relative p-4 rounded-lg bg-white/10 backdrop-blur-md border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
          {title}
        </h3>
        <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
          {value}
        </span>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
