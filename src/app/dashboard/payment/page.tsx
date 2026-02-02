import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function PaymentPage() {

  const purchaseDetails = await api.payment.getPurchaseDetails();

  return (
    <div>
      <div className="p-6 space-y-4">
        <div className="relative min-h-100 overflow-y-hidden">
          {!purchaseDetails?.hasPurchased ||
          purchaseDetails.purchase?.status !== "paid" ? (
            <>
              <div className="absolute inset-0 z-10 rounded-lg top-40 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md">
                  <h3 className="text-xl font-semibold mb-2">
                    Purchase Required
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need to purchase lifetime access to view payment details.
                  </p>
                  <Link href="/pricing">
                    <Button>Get Lifetime Access</Button>
                  </Link>
                </div>
              </div>
              <div className="blur-sm pointer-events-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                      View your purchase information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Status
                        </p>
                        <p className="text-md">Active</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Amount
                        </p>
                        <p className="text-md">$5.00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
                <CardDescription>
                  Your lifetime access purchase information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Status
                    </p>
                    <p className="text-md capitalize">
                      {purchaseDetails.purchase.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Amount Paid
                    </p>
                    <p className="text-md">
                      {(purchaseDetails.purchase.totalAmount / 100).toFixed(2)}{" "}
                      {purchaseDetails.purchase.currency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Payment Type
                    </p>
                    <p className="text-md capitalize">
                      One-Time Purchase
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Access Level
                    </p>
                    <p className="text-md">
                      Lifetime
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ You have lifetime access to all features. No recurring payments required.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}