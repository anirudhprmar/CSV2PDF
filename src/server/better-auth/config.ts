import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { account, session, user, verification } from '~/server/db/schema';
import { env } from "~/env";
import { db } from "~/server/db";



export const auth = betterAuth({
    trustedOrigins: [
        env.NEXT_PUBLIC_APP_URL
    ],
    allowedDevOrigins: [
        env.NEXT_PUBLIC_APP_URL,
    ],
    cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
    },
    database:drizzleAdapter(db,{
        provider:"pg",
        schema:{
            user,
            session,
            account,
            verification,
        }
    }),
    socialProviders:{
        google:{
            prompt:"select_account",
            clientId:env.AUTH_GOOGLE_ID,
            clientSecret:env.AUTH_GOOGLE_SECRET
        }
    },
    plugins:[nextCookies()]
});


export type Session = typeof auth.$Infer.Session;
