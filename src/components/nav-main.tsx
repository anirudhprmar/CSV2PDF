"use client"

import { PlusIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { LayoutIcon } from "lucide-react"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { useTheme } from "next-themes"
import { Button } from "~/components/ui/button"

export function NavMain() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <Link
              href="/dashboard/upload"
              className="flex items-center gap-3 w-full rounded-none px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <PlusIcon className="h-5 w-5 shrink-0" />
              <span>Upload New File</span>
            </Link>
          </SidebarMenuItem>

            <SidebarMenuItem>
              <Link
                href={"/dashboard"}
                className={clsx(
                  "flex items-center gap-3 w-full rounded-none px-3 py-2 text-sm font-medium transition-all",
                  pathname === "/dashboard"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <LayoutIcon className="h-5 w-5 shrink-0" />
                <span>{"Dashboard"}</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div className="flex gap-2 px-2 pb-2">
          <Button
             size={'sm'}
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="w-fit"
          >
            Light
          </Button>
          <Button
            size={'sm'}
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="w-fit"
          >
            Dark
          </Button>
        </div>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}