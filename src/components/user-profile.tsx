"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";


export default function UserProfile() {
  const { setTheme, theme } = useTheme();



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-3 justify-start items-center w-full rounded hover:cursor-pointer overflow-hidden whitespace-nowrap px-4 pt-2 pb-3">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={"/default-avatar.png"} alt={"userimage"} />
            <AvatarFallback className="rounded-lg">U</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right" align="end" sideOffset={5} alignOffset={20}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={"/default-avatar.png"} alt={"userimage"} />
              <AvatarFallback className="rounded-lg">U</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-foreground">Theme</DropdownMenuLabel>
        <div className="flex gap-2 px-2 pb-2">
          <Button
            size="sm"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="w-fit"
          >
            Light
          </Button>
          <Button
            size="sm"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="w-fit"
          >
            Dark
          </Button>
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
