"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authClient } from "~/server/better-auth/client";
import { BadgeCheck, ChevronsUpDown, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { api } from "~/lib/api";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export default function UserProfile() {
  const router = useRouter();
  
  // Use tRPC query hook for automatic caching, loading, and error states
  const { data: userInfo, error } = api.user.getProfile.useQuery(undefined, {
    retry: 1,
    staleTime: 5000, 
    refetchOnWindowFocus: false, 
  });

  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (error) {
    return (
      <div className="flex gap-3 justify-start items-center w-full rounded overflow-hidden whitespace-nowrap px-4 pt-2 pb-3">
        <div className="text-red-500 text-sm shrink-0">⚠️</div>
        <div className="text-red-500 text-sm">
          {error.message || "Failed to load user profile"}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-3 justify-start items-center w-full rounded hover:cursor-pointer overflow-hidden whitespace-nowrap px-4 pt-2 pb-3">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userInfo?.image ?? "/default-avatar.png"} alt={userInfo?.name ?? "User"} />
            <AvatarFallback className="rounded-lg">{userInfo?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userInfo?.name ?? "Loading..."}</span>
            <span className="truncate text-xs text-muted-foreground">{userInfo?.email ?? ""}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userInfo?.image ?? "/default-avatar.png"} alt={userInfo?.name} />
              <AvatarFallback className="rounded-lg">{userInfo?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userInfo?.name}</span>
              <span className="truncate text-xs text-muted-foreground">{userInfo?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem>
              <BadgeCheck className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/payment">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
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
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
