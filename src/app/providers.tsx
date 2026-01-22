'use client'

import { ThemeProvider } from 'next-themes'
import { PostHogProvider } from '~/providers/PostHogProvider'
import PostHogPageView from '~/providers/PostHogPageView'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PostHogProvider>
            <ThemeProvider attribute="class" defaultTheme='dark' enableSystem disableTransitionOnChange>
                    <PostHogPageView />
                    {children}
            </ThemeProvider>
        </PostHogProvider> 
    )
}
