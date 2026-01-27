"use client";

import { Sparkles, Infinity, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Beautiful",
    description:
      "Professionally designed and visually appealing invoices can increase the chances of clients paying promptly.",
  },
  {
    icon: Infinity,
    title: "Free & Unlimited",
    description:
      "Create and send as many invoices as you need — no limits, no hidden costs, just seamless billing freedom.",
  },
  {
    icon: Shield,
    title: "Safe & Open Source",
    description:
      "Your data stays yours — we never track, sell, or share it. Store everything locally or securely on our server — the choice is yours.",
  },
];

export default function Features() {
  return (
    <section className="w-full py-20 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col space-y-4 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <Icon className="h-5 w-5 text-neutral-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-neutral-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
