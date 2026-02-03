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
import { ChevronsUpDown, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import type { RouterOutputs } from "~/trpc/react";

interface UserProfileProps {
  userInfo: RouterOutputs["user"]["getProfile"];
  paymentStatus: RouterOutputs["payment"]["getUserPurchaseStatus"];
}

export default function UserProfile({ userInfo, paymentStatus }: UserProfileProps) {
  const router = useRouter();
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



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-3 justify-start items-center w-full rounded hover:cursor-pointer overflow-hidden whitespace-nowrap px-4 pt-2 pb-3">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userInfo.image ?? "/default-avatar.png"} alt={userInfo.name} />
            <AvatarFallback className="rounded-lg">{userInfo.name[0]}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userInfo.name}</span>
            <span className="truncate text-xs text-muted-foreground">{userInfo.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right" align="end" sideOffset={5} alignOffset={20}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userInfo.image ?? "/default-avatar.png"} alt={userInfo.name} />
              <AvatarFallback className="rounded-lg">{userInfo.name[0]}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userInfo.name}</span>
              <span className="truncate text-xs text-muted-foreground">{userInfo.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/payment">
            <DropdownMenuItem className="flex items-center justify-between">
              <div className="flex items-center justify-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Purchase History
              </div>
              <div>
                <p className="text-muted-foreground">{paymentStatus.toUpperCase()}</p>
              </div>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <DropdownMenuGroup>
          <Link href="/dashboard/pricing">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Order
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
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
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
