"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";


export default function Navbar() {
  return (
     <header className="w-full relative">
        <nav className="flex items-center justify-between p-5">
          <div className="font-bold text-xl flex items-center gap-2">
            <Image
            src="/logo.png"
            alt="Logo"
            width={30}
            height={30}
            className="rounded-sm"
            />
            CSV2PDF</div>
          <div className="flex items-center justify-center gap-4 text-md">
            <ul className="hidden md:flex items-center justify-center gap-3 text-muted-foreground">
              {/* <li className="hover:text-foreground cursor-pointer transition-colors">Demo</li> */}
              <li className="hover:text-foreground cursor-pointer transition-colors">FAQ&apos;s</li>
              {/* <li className="hover:text-foreground cursor-pointer transition-colors">Blogs</li> */}
            </ul>
            <Link href={"/login"}>
              <Button variant={"default"} size={"lg"} className="text-lg shadow-md tracking-tight">Login</Button>
            </Link>
          </div>
        </nav>

        <div className="relative">
          <div className="h-px w-full absolute border border-dashed bg-linear-to-t from-neutral-300 to-neutral-300 pointer-events-none z-0"/>
        </div>

      </header>
  )
}
