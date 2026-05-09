"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  LineChart,
  ChevronFirst,
  ChevronLast,
  MoreVertical,
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Package,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: Package,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: LineChart,
  },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const pathname = usePathname();

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white/10 backdrop-blur-md border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div
            className={cn(
              "flex items-center gap-2 font-semibold transition-all",
              { "w-0 overflow-hidden": !isExpanded }
            )}
          >
            <Logo className="w-6 h-6" />
            <span className="whitespace-nowrap">ProjectFlow</span>
          </div>
          <button
            onClick={() => setIsExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20"
          >
            {isExpanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group",
                    {
                      "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800":
                        isActive,
                      "hover:bg-gray-500/10 text-gray-400 hover:text-gray-50":
                        !isActive,
                    }
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span
                    className={cn(
                      "w-44 ml-3 transition-all",
                      { "w-0 ml-0": !isExpanded }
                    )}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-indigo-400 rounded-r-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=AmbreenSheikh"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${isExpanded ? "w-44 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Ambreen Sheikh</h4>
              <span className="text-xs text-gray-400">
                ambreensheikh@example.com
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}