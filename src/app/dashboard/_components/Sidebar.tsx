"use client";

import UserProfile from "~/components/user-profile";
import clsx from "clsx";
import Link from "next/link";
import {
  type LucideIcon,
  Settings,
  Bell,
  UserIcon,
  ListTodo,
  TreeDeciduousIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";


interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: TreeDeciduousIcon,
  },
];

export default function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <div className="group w-64 border-r h-full bg-background transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-col">
        <nav aria-label="Main Navigation" className="flex flex-col h-full justify-between items-start w-full space-y-1">
          {/* Main Navigation */}
          <div className="w-full space-y-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center group-hover:justify-start gap-3 w-full rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-2 w-full">
            <div className="px-4">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/settings"
                    className={clsx(
                      "flex items-center group-hover:justify-start w-full gap-3 rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Settings
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="overflow-hidden">
              <UserProfile/>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}