"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { env } from "~/env";
import { auth } from "~/server/better-auth";

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
    {/* <PHAuthWrapper> */}
      {children}
      {/* </PHAuthWrapper> */}
  </PHProvider>
  );
}

// async function PHAuthWrapper({ children }: { children: ReactNode }) {

//   const userInfo = await auth.api.getSession()

//  useEffect(()=>{
//    if(userInfo?.user) {
//     posthog.identify(userInfo.user.id, {
//       email: userInfo.user.email,
//       name: userInfo.user.name,
//     });
//   }else if(!userInfo?.user) {
//     posthog.reset();
//   }
//  },[])

//   return children;
// }