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
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";
import { env } from "~/env";

type SubscriptionDetails = {
  id: string;
  productId: string;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  organizationId: string | null;
};

type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: "CANCELED" | "EXPIRED" | "GENERAL";
};

interface PricingTableProps {
  subscriptionDetails: SubscriptionDetailsResult;
}

interface props {
  ref?: RefObject<HTMLElement | null>;
}

export default function PricingTable({
  ref,
  subscriptionDetails
}: props & PricingTableProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data?.user);
      } catch {
        setIsAuthenticated(false);
      }
    };
    void checkAuth();
  }, []);

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

  const handleManageSubscription = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open subscription management");
    }
  };


  const LIFETIME_TIER = env.NEXT_PUBLIC_LIFETIME_ID;
  const LIFETIME_SLUG = env.NEXT_PUBLIC_LIFETIME_SLUG;

  if ( !LIFETIME_TIER || !LIFETIME_SLUG) {
    throw new Error("Missing required environment variables for Starter tier");
  }

  const isCurrentPlan = (tierProductId: string) => {
    return (
      subscriptionDetails.hasSubscription &&
      subscriptionDetails.subscription?.productId === tierProductId &&
      subscriptionDetails.subscription?.status === "active"
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section id="pricing" className="flex flex-col items-center justify-center px-4 w-full py-24 bg-background" ref={ref}>
      <div className="text-center mb-16 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
          Invest in Your Words
        </h2>
        <p className="text-xl text-muted-foreground font-light">
          Choose the plan that fits your ambition. Simple, transparent pricing for unlimited growth.
        </p>
      </div>

      <div className="flex items-center justify-center gap-8 max-w-5xl w-full flex-col md:flex-row">

        {/* Lifetime Tier */}
        <Card className="relative h-fit w-full md:w-1/2 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-secondary/10">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-foreground text-background px-4 py-1 text-sm">Best Value</Badge>
          </div>
          {isCurrentPlan(LIFETIME_TIER) && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 mt-8">
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                Current Plan
              </Badge>
            </div>
          )}
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Lifetime Access</CardTitle>
            <CardDescription className="text-base mt-2">One payment, forever mastery</CardDescription>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold">$5</span>
              <span className="text-muted-foreground">/ once</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Everything in 1-Year Pass",
              "Lifetime Updates",
              "Priority Support",
              "Early Access to New Features",
              "Founding Member Badge"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-background" />
                </div>
                <span className="text-foreground font-medium">{feature}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="pt-8">
            {isCurrentPlan(LIFETIME_TIER) ? (
              <div className="w-full space-y-3">
                <Button
                  className="w-full py-6 text-lg"
                  variant="outline"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
                {subscriptionDetails.subscription && (
                  <p className="text-sm text-muted-foreground text-center">
                    Lifetime Access Active
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col w-full gap-3">
                <Button
                  className="w-full py-6 text-lg font-medium bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => handleCheckout(LIFETIME_TIER, LIFETIME_SLUG)}
                >
                  {isAuthenticated === false ? "Sign In to Subscribe" : "Get Lifetime Access"}
                </Button>
                <p className="text-muted-foreground text-xs">Pay once, own it forever</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}