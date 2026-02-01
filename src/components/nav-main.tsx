"use client"

import { PlusIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  
} from "~/components/ui/sidebar"
import { Button } from "./ui/button"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup>
       <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <PlusIcon />
              <span>Preview file</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      <SidebarMenu>
        {items.map((item) => (
         
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span><Link href={item.url}>
                    {item.title}
                  </Link>
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          
        ))}
      </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}