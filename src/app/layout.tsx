import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, DM_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "~/components/ui/sonner";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("~/providers/PostHogPageView"), { ssr: true });


const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CSV2PDF",
  description: "view and convert csv file to pdf in seconds",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(geist.variable, dmSans.variable)} suppressHydrationWarning>
      <body>
        <Providers>
          <TRPCReactProvider>
            <PostHogPageView />
            {children}
            <Toaster/>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
