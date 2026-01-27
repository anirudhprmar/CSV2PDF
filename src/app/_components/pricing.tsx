"use client";

import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";

const pricingFeatures = [
  "Unlimited CSV file uploads",
  "Instant preview and visualization",
  "Convert to PDF with one click",
  "Save and organize your files",
  "Local storage - your data stays private",
  "No ads, no tracking, no limits",
  "Lifetime access - pay once, use forever",
  "Priority email support",
];

export default function Pricing() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            One-time payment. Lifetime access. No subscriptions.
          </p>
        </div>

        <div className="mx-auto max-w-lg">
          <div className="relative rounded-2xl border-2 border-neutral-900 bg-white p-8 shadow-2xl">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8 mt-4">
              <h3 className="text-2xl font-bold text-neutral-900">
                Lifetime Access
              </h3>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold tracking-tight text-neutral-900">
                  $5
                </span>
                <span className="text-lg text-neutral-600">one-time</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                Pay once, use forever
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {pricingFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                  </div>
                  <span className="text-neutral-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Lifetime Access
            </Button>

            <p className="mt-6 text-center text-xs text-neutral-500">
              Secure payment powered by Polar. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
