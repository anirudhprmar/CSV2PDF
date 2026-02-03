"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";

export default function SuccessPage() {
  const router = useRouter();

  // Poll for payment status every 1 second
  const { data: status, isPending } = api.payment.getUserPurchaseStatus.useQuery(
    undefined,
    {
      refetchInterval: (query) => {
        // Stop polling if we are paid
        if (query.state.data === "paid") {
          return false;
        }
        return 1000;
      },
    }
  );

  const isPaid = status === "paid";

  useEffect(() => {
    if (isPaid) {
      // Refresh router to update auth/payment state in the background
      // so when they click "Go to Dashboard", the layout check passes immediately
      router.refresh();
    }
  }, [isPaid, router]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-neutral-50 to-neutral-100 p-4 dark:from-neutral-950 dark:to-neutral-900">
      {/* Background Decor */}
      <div className="absolute left-[-10%] top-[-10%] h-125 w-125 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-purple-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/70"
      >
        <div className="flex flex-col items-center text-center">
          {/* Animated Success Icon */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 dark:bg-green-500/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
                <Check className="h-10 w-10 stroke-[3px]" />
              </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-neutral-600 dark:text-neutral-300"
          >
            Thank you for your purchase. Your account has been upgraded to{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">
              Lifetime Access
            </span>
            .
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              disabled={!isPaid}
              className="group w-full bg-neutral-900 text-base font-medium text-white shadow-lg hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {!isPaid ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            {!isPaid && !isPending && (
               <p className="mt-2 text-xs text-neutral-400">
                  Please wait while we confirm your transaction...
               </p>
            )}
          </motion.div>

          {/* Receipt Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-xs text-neutral-500 dark:text-neutral-400"
          >
            A receipt has been sent to your email.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}