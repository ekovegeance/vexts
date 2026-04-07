import type {Metadata} from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import React, {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider"
import {env} from "@/lib/env";
import {TRPCProvider} from "@/trpc/client";


const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en"  suppressHydrationWarning={true}>
        <body
            className={`${plusJakartaSans.className} ${plusJakartaSans.className} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TRPCProvider>
                {children}
            </TRPCProvider>
            <Toaster richColors={true} closeButton={true} position="top-center"/>
        </ThemeProvider>
        </body>
        </html>
    );
}
