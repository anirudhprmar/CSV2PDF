"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { env } from "~/env";
import { authClient } from "~/server/better-auth/client";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: `${window.location.origin}/ingest`,
    ui_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PHAuthWrapper>{children}</PHAuthWrapper>
    </PHProvider>
  );
}

function PHAuthWrapper({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      posthog.reset();
    }
  }, [session]);

  return <>{children}</>;
}