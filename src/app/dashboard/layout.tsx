import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"
import { api } from "~/trpc/server"
import { Button } from "~/components/ui/button"
import Link from "next/link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const hasPurchased = await api.payment.hasUserPurchased()

  if (!hasPurchased) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card p-8 rounded-lg shadow-lg text-center max-w-md border">
          <h3 className="text-2xl font-semibold mb-3">
            Upgrade Required
          </h3>
          <p className="text-muted-foreground mb-6">
            You need to purchase lifetime access to use the dashboard and convert CSV files to PDF.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="w-full">
              Get Lifetime Access - $5
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}