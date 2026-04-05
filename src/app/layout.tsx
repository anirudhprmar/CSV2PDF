import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, DM_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "~/components/ui/sonner";
import { env } from "~/env";
import { Analytics } from '@vercel/analytics/next';


const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const siteUrl = env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "View & Convert CSV Files to PDF Instantly",
    template: "%s | CSV2PDF",
  },
  description:
    "Instantly view, preview, and convert CSV files to beautifully formatted PDFs. Free online tool with no data storage. Privacy-first, fast, and easy to use.",
  keywords: [
    "CSV to PDF",
    "convert CSV",
    "CSV viewer",
    "CSV converter",
    "spreadsheet to PDF",
    "free CSV tool",
    "online CSV converter",
],
  authors: [{ name: "CSV2PDF" }],
  creator: "CSV2PDF",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CSV2PDF",
    title: "View & Convert CSV Files to PDF Instantly",
    description:
      "Instantly view, preview, and convert CSV files to beautifully formatted PDFs. Privacy-first, free, and easy to use.",
    images: [
      {
        url: "https://q843toljux.ufs.sh/f/Uf9YfZMg8a0ylHYQ0qxU01RioMFdgEO24lUzYGeWp3X67Lj8",
        width: 1200,
        height: 630,
        alt: "CSV2PDF - Convert CSV to PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "View & Convert CSV Files Instantly",
    description:
      "A simple and fast CSV files viewer. Easily handles large files. Instant conversion to beautifully formatted PDFs. Privacy-first, free, and easy to use.",
    images: ["https://q843toljux.ufs.sh/f/Uf9YfZMg8a0yMgPDY1HOLBCQmaoyh2UuN9eiVWXSwRtGpZK0"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
     icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ]
  },
  manifest: "/site.webmanifest",
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
            {children}
              <Analytics />
            <Toaster/>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
