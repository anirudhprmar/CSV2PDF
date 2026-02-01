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
import { BadgeCheck, ChevronsUpDown, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { api } from "~/lib/api";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";


export default function UserProfile({ mini, showName = false }: { mini?: boolean; showName?: boolean }) {
  const router = useRouter();
  
  // Use tRPC query hook for automatic caching, loading, and error states
  const { data: userInfo,error } = api.user.getProfile.useQuery(undefined, {
    retry: 1,
    staleTime: 5000, 
    refetchOnWindowFocus: false, 
  });

  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  };

  if (error) {
    return (
      <div
        className={`flex gap-3 justify-start items-center w-full rounded overflow-hidden whitespace-nowrap ${mini ? "px-2 py-2" : "px-4 pt-2 pb-3"}`}
      >
        <div className="text-red-500 text-sm shrink-0">⚠️</div>
        {!mini && (
          <div className={`text-red-500 text-sm transition-opacity duration-300 ${showName ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {error.message || "Failed to load user profile"}
          </div>
        )}
      </div>
    );
  }

  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex gap-3 justify-start items-center w-full rounded hover:cursor-pointer overflow-hidden whitespace-nowrap ${mini ? "px-2 py-2" : "px-4 pt-2 pb-3"}`}
        >
          <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userInfo?.image ?? "/default-avatar.png"} alt={userInfo?.name ?? "User"} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userInfo?.name ?? "Loading..."}</span>
                <span className="truncate text-xs">{userInfo?.email ?? ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userInfo?.image ?? "/default-avatar.png"} alt={userInfo?.name} />
                <AvatarFallback className="rounded-lg">{userInfo?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userInfo?.name}</span>
                <span className="truncate text-xs">{userInfo?.email}</span>
                </div>
            </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                <Link href={'/dashboard/profile'}>
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                <Link href={'/dashboard/payment'}>
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <div className="flex gap-2 px-2 pb-2 ">
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}