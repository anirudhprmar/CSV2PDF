"use client";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authClient } from "~/server/better-auth/client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type RefObject } from "react";
import { env } from "~/env";
import { api } from "~/lib/api";

interface props {
  ref?: RefObject<HTMLElement | null>;
}

export default function PricingTable({ ref }: props) {
  const router = useRouter();
  
  // Use tRPC hooks for data fetching
  const { data: isAuthenticatedData, isLoading: isAuthLoading } = api.user.isAuthenticated.useQuery();
  const { data: purchaseDetails, isLoading: isPurchaseLoading } = api.payment.getPurchaseDetails.useQuery(undefined, {
    retry: 1,
    staleTime: 5000,
  });
  
  // Use the tRPC data directly, fallback to false if undefined
  const isAuthenticated = isAuthenticatedData ?? false;

  const handleCheckout = async (productId: string, slug: string) => {
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }

    try {
      await authClient.checkout({
        products: [productId],
        slug: slug,
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Oops, something went wrong");
    }
  };

  const handleManagePurchase = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open purchase management");
    }
  };


  const LIFETIME_TIER = env.NEXT_PUBLIC_LIFETIME_ID;
  const LIFETIME_SLUG = env.NEXT_PUBLIC_LIFETIME_SLUG;

  if ( !LIFETIME_TIER || !LIFETIME_SLUG) {
    throw new Error("Missing required environment variables for Lifetime tier");
  }

  const hasPurchasedProduct = (tierProductId: string) => {
    if (!purchaseDetails) return false;
    
    return (
      purchaseDetails.hasPurchased &&
      purchaseDetails.purchase?.productId === tierProductId &&
      purchaseDetails.purchase?.status === "paid" &&
      purchaseDetails.purchase?.paid === true
    );
  };



   const appFeatures = [
    "Unlimited CSV file uploads and conversions",
    "Convert to PDF instantly",
    "No monthly subscription",
    "Lifetime access",
    "Priority support",
  ];

  return (
    <section id="pricing" className="w-full p-5" ref={ref}>
    
     <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Simple Pricing. Lifetime Value
          </h2>
        </div>

      <div className="mx-auto max-w-md">

        <Card className="relative border-2 border-dashed ">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-foreground text-background px-4 py-1 text-sm">{hasPurchasedProduct(LIFETIME_TIER) ? "Purchased" : "Best Value"}</Badge>
          </div>
          <CardHeader className="text-center pt-10 pb-8">
            <CardTitle className="text-2xl font-semibold">Lifetime Access</CardTitle>

            <CardDescription className="text-base mt-2">One-time payment, unlimited access forever
            </CardDescription>

            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold tracking-tight">$5</span>
                <span className="text-muted-foreground text-sm">
                  one-time
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {appFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
          </CardContent>
          <CardFooter className="pt-8">
            {hasPurchasedProduct(LIFETIME_TIER) ? (
              <div className="w-full space-y-3">
                <Button
                  className="w-full py-6 text-lg"
                  variant="outline"
                  onClick={handleManagePurchase}
                >
                  Manage Purchase
                </Button>
                {purchaseDetails?.purchase && (
                  <p className="text-sm text-muted-foreground text-center">
                    Lifetime Access Active
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-col w-full gap-4">
                <Button
                  className="w-full"
                  size={'lg'}
                  onClick={() => handleCheckout(LIFETIME_TIER, LIFETIME_SLUG)}
                >
                  {isAuthenticated === false ? "Sign In to Purchase" : "Get Lifetime Access"}
                </Button>
                <p className="text-muted-foreground text-xs text-center">Pay once, own it forever</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}