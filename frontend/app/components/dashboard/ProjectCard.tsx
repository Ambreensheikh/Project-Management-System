import { cn } from "@/lib/utils";
import React from "react";

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  date: string;
}

export function ProjectCard({
  title,
  description,
  date,
  className,
  ...props
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "relative p-5 rounded-lg bg-white/10 backdrop-blur-md border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group",
        className
      )}
      {...props}
    >
      <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mt-2 line-clamp-3">
        {description}
      </p>
      <p className="text-xs text-gray-500 mt-4">{date}</p>
      <div className="absolute inset-0 border border-transparent rounded-lg group-hover:border-indigo-500 transition-all duration-300" />
    </div>
  );
}
